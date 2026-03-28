const axios = require("axios");

exports.syncToWoo = async (product) => {
  const url = `${process.env.WOO_URL}/wp-json/wc/v3/products`;

  const data = {
    name: product.name,
    type: "simple",
    regular_price: product.price.toString(),
    attributes: Object.entries(product.attributes).map(([key, value]) => ({
      name: key,
      options: [value]
    }))
  };

  const response = await axios.post(url, data, {
    auth: {
      username: process.env.WOO_KEY,
      password: process.env.WOO_SECRET
    }
  });

  return response.data;
};