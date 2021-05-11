/// <reference types="cypress" />

context("Add apartment", () => {
  let apartmentData
  const apartmentRandomName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)

  before(() => {
    cy.visit("http://localhost:3000/login");
    cy.signIn("admin@test.com", "hunter2")
  });

  beforeEach(() => {
    apartmentData = {
      name: `Boulder ${apartmentRandomName}`,
      floorSize: 1800,
      pricePerMonth: 2000,
      numRooms: 3,
      latLng: "40.0150, -105.2705",
      description: "Hello",
      realtor: "Toptal Realtor"
    }
  })

  after(() => {
    cy.signOut()
  })

  it("creates and removes a new apartment", () => {

    cy.addApartment(apartmentData);

    cy.location('pathname', {timeout: 10000})
    .should('equal', '/');
    
    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`, {timeout: 10000}).should('be.visible')

  });

  it("should show the available apartment to a client", () => {
    cy.signOut()
    cy.signIn("client@test.com", "hunter2")

    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`).should('be.visible')

    cy.signOut()
    cy.signIn("admin@test.com", "hunter2")
  })

  it("edits an apartment to be rented", () => {
    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`, {timeout: 10000}).click()
    cy.get(`[data-cy="edit-apartment"`, {timeout: 10000}).click()
    cy.get('[data-cy="rent-apartment"]').check()

    cy.get('button[type=submit]').click()

    cy.location('pathname', {timeout: 10000})
    .should('equal', '/');

    cy.get('[data-cy="apartment-status"').should('have.text', "Currently Rented")
  })

  it("should not show the rented apartment to a client", () => {
    cy.signOut()
    cy.signIn("client@test.com", "hunter2")

    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`).should('not.exist')

    cy.signOut()
    cy.signIn("admin@test.com", "hunter2")
  })

  it("deletes the created apartment", () => {
    cy.get(`[data-cy="apartment-card-${apartmentData.name}"`).click()
    cy.get(`[data-cy="edit-apartment"`, {timeout: 10000}).click()
    cy.get(`[data-cy=delete-apartment]`, { timeout: 10000},).click()

    cy.location('pathname', {timeout: 10000})
    .should('equal', '/');

    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`).should('not.exist')

  })
});