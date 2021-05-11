Toptal Real Estate App

To run in dev:
`npm run dev` or `yarn dev`

To test:

A seperate firebase project exists for testing purposes. To start the environment you can with run `yarn dev:test` in one shell and then `yarn cy:open` to open the cypress interface. Alternatively if you run `yarn test` the project will be built, started, and tests will be executed using cypress run.

In the test environment there are three users:

Admin: admin@test.com//hunter2
Realtor: realtor@test.com//hunter2
Client: client@test.com//hunter2

These users are used in various places in the tests and should not be modified. There are Cypress commands in ./cypress/support/commands that can create new users if needed.

Currently happy paths are tested, more is needed around the edges.

The production app is available at:

https://toptal-real-estate-52zwezeqv-jdgronewold.vercel.app

