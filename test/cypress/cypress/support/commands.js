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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('install', () => {
    cy.visit('/');
		
    //Set data for admin account
    cy.get('input[name=adminUsername]').type('o2r');
    cy.get('input[name=adminPassword]').type('o2r');
    cy.get('input[name=adminPassword2]').type('o2r');
    cy.get('input[name=adminEmail]').type('cypresstester@o2r.de');

    //Set data for database
    cy.get('select[name=databaseDriver]').select('mysqli');
    
    cy.get('input[name=databaseHost]').invoke('val', '');
    cy.get('input[name=databaseHost]').type('db_ojs');
    cy.get('input[name=databaseHost]').invoke('val').should('eq','db_ojs');

    cy.get('input[name=databaseUsername]').invoke('val', '');
    cy.get('input[name=databaseUsername]').type('ojs');
    cy.get('input[name=databaseUsername]').invoke('val').should('eq','ojs');
    
    cy.get('input[name=databasePassword]').type('ojs');

    cy.get('input[name=databaseName]').invoke('val', '');
    cy.get('input[name=databaseName]').type('ojs');
    cy.get('input[name=databaseName]').invoke('val').should('eq','ojs');

    cy.get('input[name=enableBeacon]').invoke('val',0);

    //Finish installation 
    cy.get('button[name=submitFormButton]').click();
    Cypress.config('defaultCommandTimeout', 60000);
    cy.get('p:contains("has completed successfully.")');

});

Cypress.Commands.add('login', (username, password, context) => {
	context = context || 'index';
	password = password || (username + username);
	cy.visit('index.php/' + context + '/login/signIn', {
		method: 'POST',
		body: {username: username, password: password}
	});
});

Cypress.Commands.add('waitJQuery', function() {
	cy.waitUntil(() => cy.window().then(win => win.jQuery.active == 0));
});

// cypress/support/index.js
Cypress.Commands.add('getIframeBody', (selectors) => {
    // get the iframe > document > body
    // and retry until the body element is not empty
    return cy
    .get('iframe' + selectors)
    .its('0.contentDocument.body').should('not.be.empty')
    // wraps "body" DOM element to allow
    // chaining more Cypress commands, like ".find(...)"
    // https://on.cypress.io/wrap
    .then(cy.wrap)
  });

  Cypress.Commands.add('getIframeCeption', (selectors_first, selectors_second) => {
    // get iframe inside an iframe 
    // and retry until the body element is not empty
    return cy
    .get('iframe' + selectors_first)
    .its('0.contentDocument.body').should('not.be.empty')
    // wraps "body" DOM element to allow
    // chaining more Cypress commands, like ".find(...)"
    // https://on.cypress.io/wrap
    .then(cy.wrap)
    .find('iframe' + selectors_second)
    .its('0.contentDocument.body').should('not.be.empty')
    .then(cy.wrap)
  });