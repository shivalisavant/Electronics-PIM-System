const listEl = document.getElementById("products");
const statusEl = document.getElementById("status");
const refreshBtn = document.getElementById("refreshBtn");

function renderProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    listEl.innerHTML = "<li>No products found yet.</li>";
    return;
  }

  listEl.innerHTML = products
    .map((p) => {
      const name = p.name || "Unnamed product";
      const brand = p.brand || "Unknown brand";
      const category = p.category || "Uncategorized";
      const price = typeof p.price === "number" ? p.price.toFixed(2) : p.price || "-";
      const wooId = p.woo_id || "Not synced";

      return `
        <li>
          <div class="row">
            <strong>${name}</strong>
            <span class="price">$${price}</span>
          </div>
          <div class="meta">${brand} • ${category}</div>
          <div class="meta">Woo ID: ${wooId}</div>
        </li>
      `;
    })
    .join("");
}

async function loadProducts() {
  statusEl.textContent = "Loading...";

  try {
    const res = await fetch("/api");
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    const data = await res.json();
    renderProducts(data);
    statusEl.textContent = `Loaded ${Array.isArray(data) ? data.length : 0} product(s)`;
  } catch (err) {
    listEl.innerHTML = "<li>Could not load products. Check backend and database connection.</li>";
    statusEl.textContent = err.message;
  }
}

refreshBtn.addEventListener("click", loadProducts);
loadProducts();
