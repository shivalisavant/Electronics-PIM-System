require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/product");

const categories = ["smartphone", "laptop", "headphones", "smartwatch"];
const brands = ["NovaTech", "Pixelon", "Auralink", "VoltEdge", "SkyByte", "Nexa"];

function makeAttrs(category, i) {
  return {
    color: ["Black", "Silver", "Blue", "Red"][i % 4],
    stock: 10 + (i % 40),
    rating: Number((3.8 + (i % 12) / 10).toFixed(1)),
    ...(category === "smartphone"
      ? { ram: [6, 8, 12][i % 3] + "GB", storage: [128, 256, 512][i % 3] + "GB" }
      : {}),
    ...(category === "laptop"
      ? { ram: [8, 16, 32][i % 3] + "GB", storage: [256, 512, 1024][i % 3] + "GB" }
      : {}),
    ...(category === "headphones" ? { wireless: i % 2 === 0, batteryHours: 20 + (i % 25) } : {}),
    ...(category === "smartwatch"
      ? { display: ["AMOLED", "OLED"][i % 2], waterResistance: ["3ATM", "5ATM"][i % 2] }
      : {})
  };
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Product.countDocuments();
  if (existing >= 30) {
    console.log("SKIPPED_ALREADY_HAVE", existing);
    await mongoose.disconnect();
    return;
  }

  const docs = [];
  for (let i = 1; i <= 50; i += 1) {
    const category = categories[i % categories.length];
    docs.push({
      name: `${brands[i % brands.length]} ${category} ${1000 + i}`,
      brand: brands[i % brands.length],
      category,
      price: 99 + i * 7,
      attributes: makeAttrs(category, i),
      woo_id: null
    });
  }

  await Product.insertMany(docs);
  const total = await Product.countDocuments();
  console.log("SEEDED", docs.length);
  console.log("TOTAL_PRODUCTS", total);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("SEED_ERR", error.message);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore
  }
  process.exit(1);
});