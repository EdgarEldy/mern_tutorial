const CUSTOMERS = [
  {
    id: 1,
    first_name: 'Alice',
    last_name: 'Smith',
    email: 'alice@example.com',
    telephone: '555-0100',
    address: '1 Main St',
  },
  {
    id: 2,
    first_name: 'Bob',
    last_name: 'Jones',
    email: 'bob@example.com',
    telephone: '555-0200',
    address: '2 Main St',
  },
];

const stubCustomers = (body = CUSTOMERS) =>
  cy
    .intercept('GET', '/api/v1/customers', { statusCode: 200, body: { success: true, data: body } })
    .as('getCustomers');

describe('Customers CRUD', () => {
  beforeEach(() => {
    stubCustomers();
    cy.visit('/customers');
    cy.wait('@getCustomers');
  });

  it('displays the list of customers', () => {
    cy.contains('Alice').should('be.visible');
    cy.contains('Smith').should('be.visible');
    cy.contains('Bob').should('be.visible');
    cy.contains('Jones').should('be.visible');
  });

  it('opens the New Customer modal and shows all 5 fields', () => {
    cy.contains('button', 'New').click();
    cy.contains('New Customer').should('be.visible');
    cy.get('#firstName').should('be.visible');
    cy.get('#lastName').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#telephone').should('be.visible');
    cy.get('#address').should('be.visible');
  });

  it('closes the modal when Cancel is clicked', () => {
    cy.contains('button', 'New').click();
    cy.contains('button', 'Cancel').click();
    cy.contains('New Customer').should('not.exist');
  });

  it('creates a new customer', () => {
    const newCustomer = {
      id: 3,
      first_name: 'Carol',
      last_name: 'White',
      email: 'carol@example.com',
      telephone: '555-0300',
      address: '3 Main St',
    };
    cy.intercept('POST', '/api/v1/customers', {
      statusCode: 201,
      body: { success: true, data: newCustomer },
    }).as('createCustomer');
    stubCustomers([...CUSTOMERS, newCustomer]);

    cy.contains('button', 'New').click();
    cy.get('#firstName').type('Carol');
    cy.get('#lastName').type('White');
    cy.get('#email').type('carol@example.com');
    cy.get('#telephone').type('555-0300');
    cy.get('#address').type('3 Main St');
    cy.contains('button', 'Save').click();
    cy.wait('@createCustomer');
    cy.wait('@getCustomers');
    cy.contains('Carol').should('be.visible');
  });

  it('opens the Edit Customer modal with pre-filled data', () => {
    cy.intercept('GET', '/api/v1/customers/1', {
      statusCode: 200,
      body: { success: true, data: CUSTOMERS[0] },
    }).as('getCustomerById');

    cy.contains('tr', 'Alice').contains('button', 'Edit').click();
    cy.wait('@getCustomerById');
    cy.contains('Edit Customer').should('be.visible');
    cy.get('#firstName').should('have.value', 'Alice');
    cy.get('#lastName').should('have.value', 'Smith');
    cy.get('#email').should('have.value', 'alice@example.com');
    cy.get('#telephone').should('have.value', '555-0100');
    cy.get('#address').should('have.value', '1 Main St');
  });

  it('updates a customer', () => {
    const updated = { ...CUSTOMERS[0], first_name: 'Alicia', telephone: '555-9999' };
    cy.intercept('GET', '/api/v1/customers/1', {
      statusCode: 200,
      body: { success: true, data: CUSTOMERS[0] },
    }).as('getCustomerById');
    cy.intercept('PUT', '/api/v1/customers/1', {
      statusCode: 200,
      body: { success: true, data: updated },
    }).as('updateCustomer');
    stubCustomers([updated, CUSTOMERS[1]]);

    cy.contains('tr', 'Alice').contains('button', 'Edit').click();
    cy.wait('@getCustomerById');
    cy.get('#firstName').clear().type('Alicia');
    cy.get('#telephone').clear().type('555-9999');
    cy.contains('button', 'Save').click();
    cy.wait('@updateCustomer');
    cy.wait('@getCustomers');
    cy.contains('Alicia').should('be.visible');
  });

  it('deletes a customer after confirmation', () => {
    cy.intercept('DELETE', '/api/v1/customers/1', {
      statusCode: 200,
      body: { success: true },
    }).as('deleteCustomer');
    stubCustomers([CUSTOMERS[1]]);

    cy.on('window:confirm', () => true);
    cy.contains('tr', 'Alice').contains('button', 'Delete').click();
    cy.wait('@deleteCustomer');
    cy.wait('@getCustomers');
    cy.contains('Alice').should('not.exist');
  });

  it('does not delete when confirmation is cancelled', () => {
    cy.on('window:confirm', () => false);
    cy.contains('tr', 'Alice').contains('button', 'Delete').click();
    cy.contains('Alice').should('be.visible');
  });

  it('shows an alert when create customer fails', () => {
    cy.intercept('POST', '/api/v1/customers', {
      statusCode: 500,
      body: { success: false, message: 'Internal server error' },
    }).as('createCustomerFail');

    cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

    cy.contains('button', 'New').click();
    cy.get('#firstName').type('Bad');
    cy.get('#lastName').type('Request');
    cy.get('#email').type('bad@example.com');
    cy.get('#telephone').type('000-0000');
    cy.get('#address').type('Bad St');
    cy.contains('button', 'Save').click();
    cy.wait('@createCustomerFail');
    cy.get('@alertStub').should('have.been.calledWith', 'Internal server error');
  });
});
