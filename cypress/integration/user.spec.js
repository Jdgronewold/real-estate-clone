/// <reference types="cypress" />

context("Create and Remove User", () => {
  let userData
  const userRandomName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3)
  beforeEach(() => {
    cy.visit("http://localhost:3000/register");
    userData = {
      firstName: "Jeff",
      lastName: "Gronewold",
      email: `test${userRandomName}@test.com`,
      passwordOne: "hunter2",
      passwordTwo: "hunter2",
    }
  });

  it("creates a new user", () => {
    cy.intercept("/api/register").as("register");
    cy.register(userData);
    cy.wait("@register").then(() => {
      cy.get('[data-cy=header-menu]').should('be.visible')
    });
  });

  it('edits the user', () => {
    const newPassword = 'fakePassword'
    cy.signOut()
    cy.signIn("admin@test.com", "hunter2")

    cy.clickHeader('admin')
    cy.get(`[data-cy='${userData.email}']`).click()

    cy.get(cy.get('input[name=passwordOne]').type(newPassword))
    cy.get(cy.get('input[name=passwordTwo]').type(newPassword))

    cy.get('button[type=submit]').click()

    cy.location('pathname')
    .should('equal', '/');

    cy.signOut()
    cy.signIn(userData.email, newPassword)

    cy.location('pathname')
    .should('equal', '/');
  })

  it('removes the user', () => {
    cy.signOutAndRemoveUserAsAdmin(userData.email)
  })
});
