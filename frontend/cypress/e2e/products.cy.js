const CATEGORIES = [{ id: 1, category_name: 'Electronics' }];

const PRODUCTS = [
  {
    id: 1,
    product_name: 'Laptop',
    unit_price: 999.99,
    category_id: 1,
    category: { id: 1, category_name: 'Electronics' },
  },
  {
    id: 2,
    product_name: 'Phone',
    unit_price: 599.99,
    category_id: 1,
    category: { id: 1, category_name: 'Electronics' },
  },
];

const stubProducts = (body = PRODUCTS) =>
  cy
    .intercept('GET', '/api/v1/products', { statusCode: 200, body: { success: true, data: body } })
    .as('getProducts');

const stubCategories = () =>
  cy
    .intercept('GET', '/api/v1/categories', { statusCode: 200, body: { success: true, data: CATEGORIES } })
    .as('getCategories');

describe('Products CRUD', () => {
  beforeEach(() => {
    stubProducts();
    stubCategories();
    cy.visit('/products');
    cy.wait('@getProducts');
  });

  it('displays the list of products', () => {
    cy.contains('Laptop').should('be.visible');
    cy.contains('Phone').should('be.visible');
  });

  it('opens the New Product modal when New button is clicked', () => {
    cy.contains('button', 'New').click();
    cy.contains('New Product').should('be.visible');
    cy.get('#productName').should('be.visible');
    cy.get('#unitPrice').should('be.visible');
    cy.get('#categoryId').should('be.visible');
  });

  it('closes the modal when Cancel is clicked', () => {
    cy.contains('button', 'New').click();
    cy.contains('button', 'Cancel').click();
    cy.contains('New Product').should('not.exist');
  });

  it('creates a new product', () => {
    const newProduct = {
      id: 3,
      product_name: 'Tablet',
      unit_price: 499.99,
      category_id: 1,
      category: { id: 1, category_name: 'Electronics' },
    };
    cy.intercept('POST', '/api/v1/products', {
      statusCode: 201,
      body: { success: true, data: newProduct },
    }).as('createProduct');
    stubProducts([...PRODUCTS, newProduct]);

    cy.contains('button', 'New').click();
    cy.wait('@getCategories');
    cy.get('#productName').type('Tablet');
    cy.get('#unitPrice').type('499.99');
    cy.get('#categoryId').select('Electronics');
    cy.contains('button', 'Save').click();
    cy.wait('@createProduct');
    cy.wait('@getProducts');
    cy.contains('Tablet').should('be.visible');
  });

  it('opens the Edit Product modal with pre-filled data', () => {
    cy.intercept('GET', '/api/v1/products/1', {
      statusCode: 200,
      body: { success: true, data: PRODUCTS[0] },
    }).as('getProductById');

    cy.contains('tr', 'Laptop').contains('button', 'Edit').click();
    cy.wait('@getProductById');
    cy.wait('@getCategories');
    cy.contains('Edit Product').should('be.visible');
    cy.get('#productName').should('have.value', 'Laptop');
    cy.get('#unitPrice').should('have.value', '999.99');
    cy.get('#categoryId').should('have.value', '1');
  });

  it('updates a product', () => {
    const updated = { ...PRODUCTS[0], product_name: 'Laptop Pro', unit_price: 1099.99 };
    cy.intercept('GET', '/api/v1/products/1', {
      statusCode: 200,
      body: { success: true, data: PRODUCTS[0] },
    }).as('getProductById');
    cy.intercept('PUT', '/api/v1/products/1', {
      statusCode: 200,
      body: { success: true, data: updated },
    }).as('updateProduct');
    stubProducts([updated, PRODUCTS[1]]);

    cy.contains('tr', 'Laptop').contains('button', 'Edit').click();
    cy.wait('@getProductById');
    cy.wait('@getCategories');
    cy.get('#productName').clear().type('Laptop Pro');
    cy.get('#unitPrice').clear().type('1099.99');
    cy.contains('button', 'Save').click();
    cy.wait('@updateProduct');
    cy.wait('@getProducts');
    cy.contains('Laptop Pro').should('be.visible');
  });

  it('deletes a product after confirmation', () => {
    cy.intercept('DELETE', '/api/v1/products/1', {
      statusCode: 200,
      body: { success: true },
    }).as('deleteProduct');
    stubProducts([PRODUCTS[1]]);

    cy.on('window:confirm', () => true);
    cy.contains('tr', 'Laptop').contains('button', 'Delete').click();
    cy.wait('@deleteProduct');
    cy.wait('@getProducts');
    cy.contains('Laptop').should('not.exist');
  });

  it('does not delete when confirmation is cancelled', () => {
    cy.on('window:confirm', () => false);
    cy.contains('tr', 'Laptop').contains('button', 'Delete').click();
    cy.contains('Laptop').should('be.visible');
  });

  it('shows an alert when create product fails', () => {
    cy.intercept('POST', '/api/v1/products', {
      statusCode: 500,
      body: { success: false, message: 'Internal server error' },
    }).as('createProductFail');

    cy.contains('button', 'New').click();
    cy.wait('@getCategories');
    cy.get('#productName').type('Broken');
    cy.get('#unitPrice').type('1');
    cy.get('#categoryId').select('Electronics');

    cy.on('window:alert', (msg) => {
      expect(msg).to.eq('Save failed');
    });
    cy.contains('button', 'Save').click();
    cy.wait('@createProductFail');
  });
});
