'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const request = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/customers', () => {
  it('returns 200 with an empty list when no customers exist', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });
});

describe('POST /api/customers', () => {
  it('creates a customer and returns 201', async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({ first_name: 'Alice', last_name: 'Smith', email: 'alice@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.data.first_name).toBe('Alice');
    expect(res.body.data.email).toBe('alice@example.com');
  });

  it('returns 422 when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({ email: 'not-an-email' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/customers/:id', () => {
  let customerId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({ first_name: 'Bob', last_name: 'Jones' });
    customerId = res.body.data.id;
  });

  it('returns the customer by id', async () => {
    const res = await request(app).get(`/api/customers/${customerId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.first_name).toBe('Bob');
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/api/customers/999999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/customers/:id', () => {
  let customerId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({ first_name: 'Carol', last_name: 'White' });
    customerId = res.body.data.id;
  });

  it('updates the customer and returns new data', async () => {
    const res = await request(app)
      .put(`/api/customers/${customerId}`)
      .send({ last_name: 'Black' });
    expect(res.status).toBe(200);
    expect(res.body.data.last_name).toBe('Black');
  });
});

describe('DELETE /api/customers/:id', () => {
  let customerId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({ first_name: 'Temp', last_name: 'User' });
    customerId = res.body.data.id;
  });

  it('deletes the customer and returns 200', async () => {
    const res = await request(app).delete(`/api/customers/${customerId}`);
    expect(res.status).toBe(200);
  });

  it('returns 404 after deletion', async () => {
    const res = await request(app).get(`/api/customers/${customerId}`);
    expect(res.status).toBe(404);
  });
});
