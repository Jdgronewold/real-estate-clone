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

  it("creates a new apartment", () => {

    cy.addApartment(apartmentData);

    cy.location('pathname')
    .should('equal', '/');
    
    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`).should('exist')
    cy.get(`[data-cy="marker-${apartmentData.name}"]`).should('exist')

  });

  it("should show the available apartment to a client", () => {
    cy.signOut()
    cy.signIn("client@test.com", "hunter2")

    cy.location('pathname')
    .should('equal', '/');

    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`).should('exist')
    cy.get(`[data-cy="marker-${apartmentData.name}"]`).should('exist')

    cy.signOut()
    cy.signIn("admin@test.com", "hunter2")
  })

  it("edits an apartment to be rented", () => {
    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`).click()
    cy.get(`[data-cy="edit-apartment"`).click()
    cy.get('[data-cy="rent-apartment"]').check()

    cy.get('button[type=submit]').click()

    cy.location('pathname')
    .should('equal', '/');

    cy.get(`[data-cy="apartment-status-${apartmentData.name}"]`).should('have.text', "Currently Rented")
  })

  it("should not show the rented apartment to a client", () => {
    cy.signOut()
    cy.signIn("client@test.com", "hunter2")

    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`).should('not.exist')
    cy.get(`[data-cy="marker-${apartmentData.name}"]`).should('not.exist')

    cy.signOut()
    cy.signIn("admin@test.com", "hunter2")
  })

  it("filters the apartment based on price", () => {
    cy.get('[data-cy="toggle-filter"]').click()
    cy.wait(1000)
    cy.get(`input[name=minPrice]`).type("2100")

    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`).should('not.exist')
    cy.get(`[data-cy="marker-${apartmentData.name}"]`).should('not.exist')

    cy.get(`input[name="minPrice"]`).clear()
    cy.get(`input[name="minPrice"]`).type("1500")

    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`).should('exist')
    cy.get(`[data-cy="marker-${apartmentData.name}"]`).should('exist')

  })

  it("deletes the created apartment", () => {
    cy.get(`[data-cy="apartment-card-${apartmentData.name}"`).click()
    cy.get(`[data-cy="edit-apartment"`).click()
    cy.get(`[data-cy=delete-apartment]`).click()

    cy.location('pathname')
    .should('equal', '/');

    cy.get(`[data-cy="apartment-card-${apartmentData.name}"]`).should('not.exist')

  })
});