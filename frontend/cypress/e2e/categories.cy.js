const CATEGORIES = [
  { id: 1, category_name: 'Electronics' },
  { id: 2, category_name: 'Books' },
];

const stubGet = (body = CATEGORIES) =>
  cy.intercept('GET', '/api/v1/categories', { statusCode: 200, body: { success: true, data: body } }).as('getCategories');

describe('Categories CRUD', () => {
  beforeEach(() => {
    stubGet();
    cy.visit('/categories');
    cy.wait('@getCategories');
  });

  it('displays the list of categories', () => {
    cy.contains('Electronics').should('be.visible');
    cy.contains('Books').should('be.visible');
  });

  it('opens the New Category modal when New button is clicked', () => {
    cy.contains('button', 'New').click();
    cy.contains('New Category').should('be.visible');
    cy.get('#categoryName').should('be.visible');
  });

  it('closes the modal when Cancel is clicked', () => {
    cy.contains('button', 'New').click();
    cy.contains('button', 'Cancel').click();
    cy.contains('New Category').should('not.exist');
  });

  it('creates a new category', () => {
    cy.intercept('POST', '/api/v1/categories', {
      statusCode: 201,
      body: { success: true, data: { id: 3, category_name: 'Clothing' } },
    }).as('createCategory');
    stubGet([...CATEGORIES, { id: 3, category_name: 'Clothing' }]);

    cy.contains('button', 'New').click();
    cy.get('#categoryName').type('Clothing');
    cy.contains('button', 'Save').click();
    cy.wait('@createCategory');
    cy.wait('@getCategories');
    cy.contains('Clothing').should('be.visible');
  });

  it('opens the Edit Category modal with pre-filled data', () => {
    cy.intercept('GET', '/api/v1/categories/1', {
      statusCode: 200,
      body: { success: true, data: { id: 1, category_name: 'Electronics' } },
    }).as('getCategoryById');

    cy.contains('tr', 'Electronics').contains('button', 'Edit').click();
    cy.wait('@getCategoryById');
    cy.contains('Edit Category').should('be.visible');
    cy.get('#categoryName').should('have.value', 'Electronics');
  });

  it('updates a category', () => {
    cy.intercept('GET', '/api/v1/categories/1', {
      statusCode: 200,
      body: { success: true, data: { id: 1, category_name: 'Electronics' } },
    }).as('getCategoryById');
    cy.intercept('PUT', '/api/v1/categories/1', {
      statusCode: 200,
      body: { success: true, data: { id: 1, category_name: 'Consumer Electronics' } },
    }).as('updateCategory');
    stubGet([{ id: 1, category_name: 'Consumer Electronics' }, CATEGORIES[1]]);

    cy.contains('tr', 'Electronics').contains('button', 'Edit').click();
    cy.wait('@getCategoryById');
    cy.get('#categoryName').clear().type('Consumer Electronics');
    cy.contains('button', 'Save').click();
    cy.wait('@updateCategory');
    cy.wait('@getCategories');
    cy.contains('Consumer Electronics').should('be.visible');
  });

  it('deletes a category after confirmation', () => {
    cy.intercept('DELETE', '/api/v1/categories/1', {
      statusCode: 200,
      body: { success: true },
    }).as('deleteCategory');
    stubGet([CATEGORIES[1]]);

    cy.on('window:confirm', () => true);
    cy.contains('tr', 'Electronics').contains('button', 'Delete').click();
    cy.wait('@deleteCategory');
    cy.wait('@getCategories');
    cy.contains('Electronics').should('not.exist');
  });

  it('does not delete when confirmation is cancelled', () => {
    cy.on('window:confirm', () => false);
    cy.contains('tr', 'Electronics').contains('button', 'Delete').click();
    cy.contains('Electronics').should('be.visible');
  });
});
