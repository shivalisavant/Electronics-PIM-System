# Electronics PIM System

Simple Product Information Management (PIM) backend built with Node.js, Express, and MongoDB, with a basic frontend UI for listing products.

## Features

- Create products in MongoDB
- List all products
- Attempt WooCommerce sync on product creation
- Basic frontend UI at `/` to display products
- Seed script to quickly generate many real products

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Axios
- Dotenv

## Project Structure

```text
config/
	db.js
controllers/
	productController.js
models/
	product.js
public/
	index.html
	app.js
	styles.css
routes/
	productRoutes.js
scripts/
	seedProducts.js
servcices/
	woocommerce.js
server.js
```

Note: The folder name is currently `servcices` (existing project naming).

## Environment Variables

Create a `.env` file in project root:

```env
WOO_URL=http://electronics-pim-system.local
WOO_KEY=your_consumer_key
WOO_SECRET=your_consumer_secret
MONGO_URI=mongodb://localhost:27017/electronics-pim-db
```

## Install

```bash
npm install
```

## Run

```bash
node server.js
```

Server runs at:

- `http://localhost:3000` (frontend)
- `http://localhost:3000/api` (products list API)

## API Endpoints

### Get all products

`GET /api`

### Create product

`POST /api/products`

Example body:

```json
{
	"name": "Nova Phone X",
	"brand": "NovaTech",
	"category": "smartphone",
	"price": 499,
	"attributes": {
		"ram": "8GB",
		"storage": "256GB"
	}
}
```

## Seed Many Products

Populate database with sample products:

```bash
node scripts/seedProducts.js
```

## Current Notes

- Product listing and frontend are working.
- WooCommerce sync depends on valid API credentials and correct user permissions in WooCommerce REST API.