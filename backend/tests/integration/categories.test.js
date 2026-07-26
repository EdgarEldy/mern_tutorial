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

describe('GET /api/v1/categories', () => {
  it('returns 200 with an empty list when no categories exist', async () => {
    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });
});

describe('POST /api/v1/categories', () => {
  it('creates a category and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/categories')
      .send({ category_name: 'Electronics' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.category_name).toBe('Electronics');
    expect(res.body.data.id).toBeDefined();
  });

  it('returns 422 when category_name is missing', async () => {
    const res = await request(app).post('/api/v1/categories').send({});
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/v1/categories/:id', () => {
  let createdId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/categories')
      .send({ category_name: 'Books' });
    createdId = res.body.data.id;
  });

  it('returns the category by id', async () => {
    const res = await request(app).get(`/api/v1/categories/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.category_name).toBe('Books');
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/api/v1/categories/999999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('PUT /api/v1/categories/:id', () => {
  let createdId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/categories')
      .send({ category_name: 'Clothing' });
    createdId = res.body.data.id;
  });

  it('updates the category and returns the new data', async () => {
    const res = await request(app)
      .put(`/api/v1/categories/${createdId}`)
      .send({ category_name: 'Fashion' });
    expect(res.status).toBe(200);
    expect(res.body.data.category_name).toBe('Fashion');
  });
});

describe('DELETE /api/v1/categories/:id', () => {
  let createdId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/categories')
      .send({ category_name: 'Temp' });
    createdId = res.body.data.id;
  });

  it('deletes the category and returns 200', async () => {
    const res = await request(app).delete(`/api/v1/categories/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 404 after deletion', async () => {
    const res = await request(app).get(`/api/v1/categories/${createdId}`);
    expect(res.status).toBe(404);
  });
});
