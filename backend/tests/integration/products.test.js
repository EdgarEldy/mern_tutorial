'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const request = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await sequelize.models.Category.create({ category_name: 'Electronics' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/v1/products', () => {
  it('returns 200 with an empty list when no products exist', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });
});

describe('POST /api/v1/products', () => {
  it('creates a product and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({ product_name: 'Laptop', unit_price: 999.99, category_id: 1 });
    expect(res.status).toBe(201);
    expect(res.body.data.product_name).toBe('Laptop');
    expect(res.body.data.unit_price).toBe(999.99);
  });

  it('returns 422 when required fields are missing', async () => {
    const res = await request(app).post('/api/v1/products').send({ product_name: 'X' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/v1/products/:id', () => {
  let productId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({ product_name: 'Mouse', unit_price: 29.99, category_id: 1 });
    productId = res.body.data.id;
  });

  it('returns the product with its category', async () => {
    const res = await request(app).get(`/api/v1/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.product_name).toBe('Mouse');
    expect(res.body.data.category).toBeDefined();
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/api/v1/products/999999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/v1/products/:id', () => {
  let productId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({ product_name: 'Keyboard', unit_price: 49.99, category_id: 1 });
    productId = res.body.data.id;
  });

  it('updates the product and returns new data', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .send({ unit_price: 59.99 });
    expect(res.status).toBe(200);
    expect(parseFloat(res.body.data.unit_price)).toBe(59.99);
  });
});

describe('DELETE /api/v1/products/:id', () => {
  let productId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({ product_name: 'Temp', unit_price: 1.0, category_id: 1 });
    productId = res.body.data.id;
  });

  it('deletes the product and returns 200', async () => {
    const res = await request(app).delete(`/api/v1/products/${productId}`);
    expect(res.status).toBe(200);
  });

  it('returns 404 after deletion', async () => {
    const res = await request(app).get(`/api/v1/products/${productId}`);
    expect(res.status).toBe(404);
  });
});
