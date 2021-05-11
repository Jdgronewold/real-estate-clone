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
Cypress.Commands.add('register', (userData) => {
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
  cy.clickHeader('sign-out')
})

Cypress.Commands.add('signIn', (email, password) => {
  cy.get('input[name=email]').type(email)
  cy.get('input[name=password]').type(password)
  cy.get('button[type=submit]').click()
  cy.get('[data-cy=header-menu]', { timeout: 30000 }).should('be.visible')
})

Cypress.Commands.add('signOutAndRemoveUserAsAdmin', (userEmail) => {
  cy.clickHeader('sign-out')

  cy.signIn('admin@test.com', 'hunter2')

  cy.clickHeader('admin')

  cy.intercept('/api/admin/delete').as("deleteUser")

  cy.get(`[data-cy='${userEmail}']`).click()
  cy.get(`[data-cy=delete-user]`).click()

  cy.wait('@deleteUser').then((response) => {
    expect(response.response.statusCode).to.equal(200)
    cy.location('pathname')
      .should('equal', '/admin');
    cy.signOut()
  })
})

Cypress.Commands.add('clickHeader', (option) => {
  cy.wait(1000)
  cy.get('[data-cy=header-menu]').click()
  cy.wait(1000)
  cy.get(`[data-cy=${option}]`).click({ waitForAnimations: true})
})

Cypress.Commands.add('addApartment', (apartmentData) => {
  cy.clickHeader('new-listing')
  cy.get('input[name=name]').type(apartmentData.name)
  cy.get('input[name=floorSize]').type(apartmentData.floorSize)
  cy.get('input[name=pricePerMonth]').type(apartmentData.pricePerMonth)
  cy.get('input[name=numRooms]').type(apartmentData.numRooms)
  cy.get('input[type="radio"]').check("geolocation")
  cy.get('input[type="radio"]').first().click()
  cy.get('input[value=geolocation]').should('be.checked')
  cy.get('input[name=locationVal]').type(apartmentData.latLng)
  cy.get('select').select(apartmentData.realtor)
  cy.get('textarea[name=description]').type(apartmentData.description)

  cy.intercept("/api/apartments/create").as("createApartment");

  cy.get('button[type=submit]').click()

  cy.wait('@createApartment').then((response) => {
    expect(response.response.statusCode).to.equal(200)
  })
})
