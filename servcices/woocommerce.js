const axios = require("axios");

const normalizedBase = process.env.WOO_URL?.startsWith("http")
    ? process.env.WOO_URL
    : `http://${process.env.WOO_URL}`;

const wooAPI = axios.create({
    baseURL: `${normalizedBase}/wp-json/wc/v3`
});

wooAPI.interceptors.request.use((config) => {
    config.params = {
        ...(config.params || {}),
        consumer_key: process.env.WOO_KEY,
        consumer_secret: process.env.WOO_SECRET
    };
    return config;
});

module.exports = wooAPI;