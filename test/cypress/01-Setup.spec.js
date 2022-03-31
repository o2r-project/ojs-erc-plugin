describe('Setup in general is tested', () => {

	it('Installs the software', () => {
		cy.install();
	});

	it('Login as admin and create new journal', () => {
		cy.login('o2r', 'o2r', 'index'); 
		cy.visit('/');

		cy.get('a:contains(Create Journal)').click();
		//Necessary for loading in journal creation form
		cy.wait(1000);

		//Fill out the form for a new journal called 'O2R News'
		cy.get('input[name=name-en_US]').invoke('val', 'O2RNews');
		cy.get('input[name=acronym-en_US]').invoke('val', 'o2rn'); 
		cy.get('input[name=urlPath]').invoke('val', '');
		cy.get('input[name=urlPath]').invoke('val', 'o2rn');
		cy.wait(1000);
		cy.get('input[name=supportedLocales][value="en_US').check(); 
		cy.get('input[name=primaryLocale][value="en_US').check();
		
		cy.get('button').contains('Save').click();

		cy.get('input[name=name-en_US]').type('O2RNews', {delay: 0});
		cy.get('input[name=acronym-en_US]').type( 'o2rn', {delay: 0});
		cy.get('input[name=urlPath]').clear().type('o2rn', {delay: 0});

		cy.get('button').contains('Save').click();

		cy.get('h1').contains('Settings Wizard');

	});

  })
