const Product = require("../models/product");
const wooAPI = require("../servcices/woocommerce");

function isValidId(id) {
    return /^[a-f\d]{24}$/i.test(id);
}

function buildUpdatePayload(body) {
    const allowed = ["name", "brand", "category", "price", "attributes"];
    const payload = {};

    for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
            payload[key] = body[key];
        }
    }

    return payload;
}

exports.createProduct = async (req, res) => {
    try {
        const { name, brand, category, price, attributes } = req.body;

        if (!name || !brand || !category || price === undefined || price === null) {
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
        const response = { product: saved, wooSync: { success: false } };

        // Woo sync is best-effort so CRUD remains available even if Woo auth fails.
        try {
            const wooRes = await wooAPI.post("/products", {
                name,
                type: "simple",
                regular_price: price.toString(),
                description: `${brand} ${category}`,
                categories: [{ name: category }]
            });

            saved.woo_id = wooRes.data.id;
            await saved.save();
            response.product = saved;
            response.wooSync = { success: true, id: wooRes.data.id };
        } catch (wooError) {
            response.wooSync = {
                success: false,
                message: wooError.response?.data?.message || wooError.message
            };
        }

        res.status(201).json(response);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const payload = buildUpdatePayload(req.body);
        if (Object.keys(payload).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        const updated = await Product.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });

        if (!updated) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};