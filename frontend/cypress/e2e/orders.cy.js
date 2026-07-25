const CUSTOMERS = [{ id: 1, first_name: 'Alice', last_name: 'Smith' }];
const PRODUCTS = [{ id: 1, product_name: 'Laptop', unit_price: 999.99 }];
const ORDERS = [
  {
    id: 1,
    customer_id: 1,
    customer: { id: 1, first_name: 'Alice', last_name: 'Smith' },
    product_id: 1,
    product: { id: 1, product_name: 'Laptop' },
    quantity: 2,
    total: 1999.98,
  },
];

const stubOrders = (body = ORDERS) =>
  cy
    .intercept('GET', '/api/v1/orders', { statusCode: 200, body: { success: true, data: body } })
    .as('getOrders');

const stubCustomers = () =>
  cy
    .intercept('GET', '/api/v1/customers', {
      statusCode: 200,
      body: { success: true, data: CUSTOMERS },
    })
    .as('getCustomers');

const stubProducts = () =>
  cy
    .intercept('GET', '/api/v1/products', {
      statusCode: 200,
      body: { success: true, data: PRODUCTS },
    })
    .as('getProducts');

describe('Orders CRUD', () => {
  beforeEach(() => {
    stubOrders();
    stubCustomers();
    stubProducts();
    cy.visit('/orders');
    cy.wait('@getOrders');
  });

  it('displays the list of orders', () => {
    cy.contains('Alice').should('be.visible');
    cy.contains('Smith').should('be.visible');
    cy.contains('Laptop').should('be.visible');
    cy.contains('1999.98').should('be.visible');
  });

  it('opens the New Order modal and shows Customer, Product, and Quantity fields', () => {
    cy.contains('button', 'New').click();
    cy.wait('@getCustomers');
    cy.wait('@getProducts');
    cy.contains('New Order').should('be.visible');
    cy.get('#customerId').should('be.visible');
    cy.get('#productId').should('be.visible');
    cy.get('#quantity').should('be.visible');
  });

  it('closes the modal when Cancel is clicked', () => {
    cy.contains('button', 'New').click();
    cy.contains('button', 'Cancel').click();
    cy.contains('New Order').should('not.exist');
  });

  it('creates a new order', () => {
    const newOrder = {
      id: 2,
      customer_id: 1,
      customer: { id: 1, first_name: 'Alice', last_name: 'Smith' },
      product_id: 1,
      product: { id: 1, product_name: 'Laptop' },
      quantity: 1,
      total: 999.99,
    };
    cy.intercept('POST', '/api/v1/orders', {
      statusCode: 201,
      body: { success: true, data: newOrder },
    }).as('createOrder');
    stubOrders([...ORDERS, newOrder]);

    cy.contains('button', 'New').click();
    cy.wait('@getCustomers');
    cy.wait('@getProducts');
    cy.get('#customerId').select('Alice Smith');
    cy.get('#productId').select('Laptop ($999.99)');
    cy.get('#quantity').type('1');
    cy.contains('button', 'Save').click();
    cy.wait('@createOrder');
    cy.wait('@getOrders');
    cy.contains('Alice').should('be.visible');
  });

  it('opens the Edit Order modal with pre-filled data', () => {
    cy.intercept('GET', '/api/v1/orders/1', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: 1,
          customer_id: 1,
          product_id: 1,
          quantity: 2,
          total: 1999.98,
          customer: { id: 1, first_name: 'Alice', last_name: 'Smith' },
          product: { id: 1, product_name: 'Laptop' },
        },
      },
    }).as('getOrderById');

    cy.contains('tr', 'Alice').contains('button', 'Edit').click();
    cy.wait('@getOrderById');
    cy.wait('@getCustomers');
    cy.wait('@getProducts');
    cy.contains('Edit Order').should('be.visible');
    cy.get('#customerId').should('have.value', '1');
    cy.get('#productId').should('have.value', '1');
    cy.get('#quantity').should('have.value', '2');
  });

  it('updates an order', () => {
    const updated = { ...ORDERS[0], quantity: 3, total: 2999.97 };
    cy.intercept('GET', '/api/v1/orders/1', {
      statusCode: 200,
      body: { success: true, data: { ...ORDERS[0], customer_id: 1, product_id: 1 } },
    }).as('getOrderById');
    cy.intercept('PUT', '/api/v1/orders/1', {
      statusCode: 200,
      body: { success: true, data: updated },
    }).as('updateOrder');
    stubOrders([updated]);

    cy.contains('tr', 'Alice').contains('button', 'Edit').click();
    cy.wait('@getOrderById');
    cy.wait('@getCustomers');
    cy.wait('@getProducts');
    cy.get('#quantity').clear().type('3');
    cy.contains('button', 'Save').click();
    cy.wait('@updateOrder');
    cy.wait('@getOrders');
    cy.contains('2999.97').should('be.visible');
  });

  it('deletes an order after confirmation', () => {
    cy.intercept('DELETE', '/api/v1/orders/1', {
      statusCode: 200,
      body: { success: true },
    }).as('deleteOrder');
    stubOrders([]);

    cy.on('window:confirm', () => true);
    cy.contains('tr', 'Alice').contains('button', 'Delete').click();
    cy.wait('@deleteOrder');
    cy.wait('@getOrders');
    cy.contains('Alice').should('not.exist');
  });

  it('does not delete when confirmation is cancelled', () => {
    cy.on('window:confirm', () => false);
    cy.contains('tr', 'Alice').contains('button', 'Delete').click();
    cy.contains('Alice').should('be.visible');
  });

  it('shows an alert when create order fails', () => {
    cy.intercept('POST', '/api/v1/orders', {
      statusCode: 500,
      body: { success: false, message: 'Internal server error' },
    }).as('createOrderFail');

    cy.contains('button', 'New').click();
    cy.wait('@getCustomers');
    cy.wait('@getProducts');
    cy.get('#customerId').select('Alice Smith');
    cy.get('#productId').select('Laptop ($999.99)');
    cy.get('#quantity').type('1');

    cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));
    cy.contains('button', 'Save').click();
    cy.wait('@createOrderFail');
    cy.get('@alertStub').should('have.been.calledWith', 'Internal server error');
  });
});
