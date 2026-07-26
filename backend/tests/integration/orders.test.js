'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const request = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/config/database');

let categoryId;
let productId;
let customerId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const catRes = await request(app)
    .post('/api/v1/categories')
    .send({ category_name: 'Electronics' });
  categoryId = catRes.body.data.id;

  const prodRes = await request(app)
    .post('/api/v1/products')
    .send({ product_name: 'Laptop', unit_price: 999.99, category_id: categoryId });
  productId = prodRes.body.data.id;

  const custRes = await request(app)
    .post('/api/v1/customers')
    .send({ first_name: 'Alice', last_name: 'Smith' });
  customerId = custRes.body.data.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/v1/orders', () => {
  it('returns 200 with an empty list when no orders exist', async () => {
    const res = await request(app).get('/api/v1/orders');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });
});

describe('POST /api/v1/orders', () => {
  it('creates an order and computes total server-side', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ customer_id: customerId, product_id: productId, quantity: 2 });
    expect(res.status).toBe(201);
    expect(res.body.data.quantity).toBe(2);
    expect(parseFloat(res.body.data.total)).toBeCloseTo(1999.98, 1);
  });

  it('returns 422 when required fields are missing', async () => {
    const res = await request(app).post('/api/v1/orders').send({ customer_id: customerId });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 when product_id does not exist', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ customer_id: customerId, product_id: 999999, quantity: 1 });
    expect(res.status).toBe(404);
  });
});

describe('GET /api/v1/orders/:id', () => {
  let orderId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ customer_id: customerId, product_id: productId, quantity: 1 });
    orderId = res.body.data.id;
  });

  it('returns the order with customer and product nested', async () => {
    const res = await request(app).get(`/api/v1/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.customer).toBeDefined();
    expect(res.body.data.product).toBeDefined();
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/api/v1/orders/999999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/v1/orders/:id', () => {
  let orderId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ customer_id: customerId, product_id: productId, quantity: 1 });
    orderId = res.body.data.id;
  });

  it('updates quantity and recomputes total', async () => {
    const res = await request(app)
      .put(`/api/v1/orders/${orderId}`)
      .send({ quantity: 3 });
    expect(res.status).toBe(200);
    expect(res.body.data.quantity).toBe(3);
    expect(parseFloat(res.body.data.total)).toBeCloseTo(2999.97, 1);
  });
});

describe('DELETE /api/v1/orders/:id', () => {
  let orderId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ customer_id: customerId, product_id: productId, quantity: 1 });
    orderId = res.body.data.id;
  });

  it('deletes the order and returns 200', async () => {
    const res = await request(app).delete(`/api/v1/orders/${orderId}`);
    expect(res.status).toBe(200);
  });

  it('returns 404 after deletion', async () => {
    const res = await request(app).get(`/api/v1/orders/${orderId}`);
    expect(res.status).toBe(404);
  });
});
