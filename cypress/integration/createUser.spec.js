/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register')
  })


  it('creates a new user', () => {
    cy.intercept('/api/register').as('register')
    cy.signIn({ firstName: "Jeff", lastName: "Gronewold", email: "admin@test.com", passwordOne: "hunter2", passwordTwo: "hunter2"})
    cy.wait('@register')
  })
})
