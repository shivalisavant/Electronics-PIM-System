const http = require("http");

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;

    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path,
        method,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": body ? Buffer.byteLength(body) : 0
        }
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          let parsed = null;
          try {
            parsed = JSON.parse(raw);
          } catch (_) {
            // non-json response is fine for smoke checks
          }
          resolve({ status: res.statusCode, body: parsed, raw });
        });
      }
    );

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function run() {
  const created = await request("POST", "/api/products", {
    name: "Quick CRUD Demo",
    brand: "Nexa",
    category: "smartphone",
    price: 399,
    attributes: { ram: "8GB" }
  });

  const id = created.body?.product?._id;
  console.log("CREATE", created.status, id ? "ID_OK" : "NO_ID", created.body?.wooSync?.success === false ? "WOO_NON_BLOCKING" : "WOO_OK");

  const list = await request("GET", "/api/products");
  console.log("LIST", list.status, Array.isArray(list.body) ? list.body.length : "NA");

  const one = await request("GET", `/api/products/${id}`);
  console.log("GET_ONE", one.status, one.body?._id ? "OK" : "NO");

  const updated = await request("PUT", `/api/products/${id}`, {
    price: 449,
    brand: "Nexa Pro"
  });
  console.log("UPDATE", updated.status, updated.body?.price === 449 ? "OK" : "NO");

  const deleted = await request("DELETE", `/api/products/${id}`);
  console.log("DELETE", deleted.status, deleted.body?.message || "");
}

run().catch((error) => {
  console.error("SMOKE_ERR", error.message);
  process.exit(1);
});
