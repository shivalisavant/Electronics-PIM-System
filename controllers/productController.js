const Product = require("../models/product");
const wooAPI = require("../servcices/woocommerce");

exports.createProduct = async (req, res) => {
    try {
        const { name, brand, category, price, attributes } = req.body;

        if (!name || !brand || !category || !price) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const product = new Product({
            name,
            brand,
            category,
            price,
            attributes
        });

        const saved = await product.save();

        const wooRes = await wooAPI.post("/products", {
            name: name,
            type: "simple",
            regular_price: price.toString(),
            description: `${brand} ${category}`,
            categories: [{ name: category }]
        });

        saved.woo_id = wooRes.data.id;
        await saved.save();

        res.status(201).json(saved);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};