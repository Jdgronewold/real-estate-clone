/// <reference types="cypress" />

context("Create and Remove User", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/register");
  });

  after(() => {
    cy.signOutAndRemoveUserAsAdmin("test@test.com")
  })

  it("creates a new user", () => {
    cy.intercept("/api/register").as("register");
    cy.register({
      firstName: "Jeff",
      lastName: "Gronewold",
      email: "test@test.com",
      passwordOne: "hunter2",
      passwordTwo: "hunter2",
    });
    cy.wait("@register").should((xhr) => {
      cy.get('[data-cy=header-menu]', { timeout: 10000 }).should('be.visible')
    });
  });
});
