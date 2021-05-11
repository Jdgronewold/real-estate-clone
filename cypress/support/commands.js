// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('signIn', (userData) => {
  cy.get('input[name=firstName]').type(userData.firstName)
  cy.get('input[name=lastName]').type(userData.lastName)
  cy.get('input[name=email]').type(userData.email)
  cy.get('input[name=passwordOne]').type(userData.passwordOne)
  cy.get('input[name=passwordTwo]').type(userData.passwordTwo)
  cy.get('select').select('Admin')

  cy.get('button[type=submit]').click()
})

Cypress.Commands.add('signOut', () => {
  cy.get('[data-cy=header-menu]', { timeout: 20000 }).should('be.visible')
  cy.get('[data-cy=header-menu]').click()
  cy.get('[data-cy=sign-out]').click()
})

Cypress.Commands.add('signOutAndRemoveUserAsAdmin', (userEmail) => {
  cy.get('[data-cy=header-menu]').click()
  cy.get('[data-cy=sign-out]').click()

  cy.get('input[name=email]', { timeout: 10000}).type('admin@test.com')
  cy.get('input[name=password]').type('hunter2')
  cy.get('button[type=submit]').click()

  cy.get('[data-cy=header-menu]', { timeout: 10000}).click()
  cy.get('[data-cy=admin]', { timeout: 10000}).click()

  cy.intercept('/api/admin/delete').as("deleteUser")

  cy.get(`[data-cy='${userEmail}']`, { timeout: 10000}).click()
  cy.get(`[data-cy=delete-user]`, { timeout: 10000},).click()

  cy.wait('@deleteUser').then((response) => {
    expect(response.response.statusCode).to.equal(200)
    cy.location('pathname', {timeout: 10000})
      .should('equal', '/admin');
    cy.signOut()
  })

})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
