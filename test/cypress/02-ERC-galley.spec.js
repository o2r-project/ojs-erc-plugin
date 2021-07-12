describe('Test whether all ERC galley functionality is available.', () => {
	it('Give user all rights.', () => {
        cy.login('o2r', 'o2r', 'index');
        cy.visit('/o2rn/submissions');

        cy.get('a:contains("Users & Roles")').click();
        cy.get('div#users a.show_extras').click();
        cy.get('a:contains("Edit User")').click();
        cy.get('div.header').contains('Edit User');
        cy.wait(1000);
        cy.get('label').contains("Journal Manager");
        cy.get('input[name="userGroupIds[]"]').first().uncheck();
        cy.get('input[name="userGroupIds[]"]').check();
        cy.get('div.header').contains('Edit User');

        cy.get('button:contains("OK")').click();
        cy.get('div:contains(\'User edited.\')');

    });


    it('Create a new submission.', () => {
        cy.login('o2r', 'o2r', 'index');
        cy.visit('/o2rn/submissions');
        cy.get('div#myQueue a:contains("New Submission")').click();

        //Page 1
        cy.get('h1').contains('Submit an Article');

        cy.get('input[type="checkbox"]').check();
        cy.get('button').contains("Save and continue").click();

        //Page 2
        cy.get('h2').contains('Files');
        cy.get('button').contains("Save and continue").click();

        //Page 3
        cy.get('input[name="title[en_US]"]').type('o2r is great!', {delay: 0});
        
        cy.getIframeBody('').find('p').invoke('text', 'o2r is also cool!');//.invoke('text','o2r is also cool.');//.its('0.contentDocument').its('body');//.invoke('text', 'o2r is also cool');
        cy.get('input[name="ErcId"]').type('geQfc', {delay: 0})
        cy.get('button:visible').contains("Save and continue").click();
        
        //Page 4
        cy.wait(3000);
        cy.get('button').contains("Finish Submission").click();
        // Page 4 pop up
        cy.get('div.message').contains('Are you sure you wish to submit this article to the journal?');
        cy.get('button.ok').contains('OK').click(); 

        // Page 5
        cy.wait(2000);
        cy.get('h2').contains('Submission complete'); 


    });

    it('Test components of ERC Galley', () => {
        cy.login('o2r', 'o2r', 'index');
        cy.visit('/o2rn/submissions');

        cy.get('a > span').contains('View').click();
        cy.get('h4:contains("Submission Files")');
        cy.wait(1000);
        cy.get('a').contains('Accept and Skip Review').click();

        cy.get('div.header').contains('Accept and Skip Review');
        cy.wait(1000);
        cy.get('button').contains('Next: Select Files for Copyediting').click();

        cy.get('button').contains('Record Editorial Decision').click();

        cy.wait(1000);
        cy.get('a').contains('Preview').click();

        cy.wait(10000);

        cy.get('h1.page_title').contains('o2r is great!');
        cy.get('a.obj_galley_link')
            .contains('ERC-Galley')
            .click();

        cy.get('iframe[name="htmlFrame"]')
            .should('have.attr', 'src').and('include', 'geQfc');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('div#footer')
            .should('have.css', 'background-color')
            .and('eq', 'rgb(144, 18, 163)');

        cy.task('log', '☑️ \tFooter check successful.');
        
        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('div#header')
            .should('be.visible');        

        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('h1.title')
            .contains('Monitoring Deforestation In Landsat Data Cubes Using NDVI')
            .should('be.visible');

        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('h4.author')
            .contains('Nick Jakuschona – n_jaku01@uni-muenster.de, Tom Niers – tom.niers@uni-muenster.de')
            .should('be.visible');

        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('h4.date')
            .contains('24.3.2021')
            .should('be.visible');

        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('div#abstract')
            .should('be.visible');
        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('div#introduction')
            .should('be.visible');
        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('div#data')
            .should('be.visible');
        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('div#methods')
            .should('be.visible');
        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('div#results')
            .should('be.visible');
        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('div#discussion')
            .should('be.visible');
        cy.getIframeCeption('[name="htmlFrame"]', '.iframe')
            .find('div#conclusion')
            .should('be.visible');
        cy.task('log', '☑️ \tArticle view check successful.');

        //Tab buttons check
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#inspect')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#check')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#manipulate')
            .should('be.visible');

        //Inspect tab
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#inspect')
            .invoke('attr', 'tabindex')
            .should('eq', '0');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('code.R')
            .should('be.visible');
        cy.task('log', '☑️ \tInspect tab check successful.');

        //Check tab
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#check')
            .click();
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#check')
            .invoke('attr', 'tabindex')
            .should('eq', '0');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#runAnalysis')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('p.MuiTypography-root')
            .eq(0)
            .contains(/Started: [0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]\.[0-9]{3}Z/)
            .should('be.visible');
        cy.task('log', '☑️ \tCheck tab check successful.');
        
        //Change visible tabs
        cy.getIframeBody('[name="htmlFrame"]')
            .find('div.MuiTabs-scrollButtonsDesktop:last-child')
            .should('be.visible')
            .click();

        //Manipulate tab
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#manipulate')
            .click();
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#manipulate')
            .invoke('attr', 'tabindex')
            .should('eq', '0');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button.Mui-selected span.MuiTab-wrapper')
            .contains('Figure 1')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button span.MuiTab-wrapper')
            .contains('Figure 2')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('div.slider')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button')
            .contains('Set original values')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#saveComparison')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#showComparison')
            .should('be.visible');
        
        var log_img = 'foo';
        cy.getIframeBody('[name="htmlFrame"]')
            .find('img')
            .then(elem => {
                if(elem.attr('src')==('')){
                    console.warn("FOO!");
                    return null
                }
                else{
                    log_img = 'img src attribute not empty.';
                    if(elem.attr('src').includes('https://o2r.uni-muenster.de/api/v1/compendium/geQfc/binding')){
                        return true;
                    }
                    else{
                        throw new Error("Incorrect src attribute for img in manipulate tab.");
                    }
                }
            });
        cy.getIframeBody('[name="htmlFrame"]')
            .find('img')
            .should('be.visible');
        cy.task('log', '☑️ \tManipulate tab check successful.');

        
        //Substitution tab
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#substitution')
            .click();
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#substitution')
            .invoke('attr', 'tabindex')
            .should('eq', '0');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span.MuiTypography-h5')
            .contains('Development of a new gas-flaring emission dataset for southern West Africa')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains(' Created on: ')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('p')
            .contains('2020-08-10 10:03')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('by:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('p')
            .contains('0000-0001-6651-0976')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('div')
            .contains('A new gas-flaring emission parameterization has been developed, which combines remote sensing observations using Visible Infrared Imaging Radiometer Suite (VIIRS) nighttime data with combustion equations. The parameterization has been applied to southern West Africa, including the Niger Delta as a r')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button svg')
            .eq(1)
            .click();
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('egion that is highly exposed to gas flaring. Two 2-month datasets for June–July 2014 and 2015 were created. The parameterization delivers emissions of CO, CO2, NO, NO2 and SO2. A flaring climatology for both time periods has been derived. The uncertainties owing to cloud cover, parameter selection, natural gas composition and the interannual differences are assessed. The largest uncertainties in the emission estimation are linked to the parameter selection. It can be shown that the flaring emissions in Nigeria have significantly decreased by 25 % from 2014 to 2015. Existing emission inventories were used for validation. CO2 emissions with the estimated uncertainty in parentheses of 2.7 (3. 6∕0. 5) Tg yr−1 for 2014 and 2.0 (2. 7∕0. 4) Tg yr−1 for 2015 were derived. Regarding the uncertainty range, the emission estimate is in the same order of magnitude compared to existing emission inventories with a tendency for underestimation. The deviations might be attributed to a shortage in information about the combustion efficiency within southern West Africa, the decreasing trend in gas flaring or inconsistent emission sector definitions. The parameterization source code is available as a package of R scripts.')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button svg')
            .eq(1)
            .click();
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('egion that is highly exposed to gas flaring. Two 2-month datasets for June–July 2014 and 2015 were created. The parameterization delivers emissions of CO, CO2, NO, NO2 and SO2. A flaring climatology for both time periods has been derived. The uncertainties owing to cloud cover, parameter selection, natural gas composition and the interannual differences are assessed. The largest uncertainties in the emission estimation are linked to the parameter selection. It can be shown that the flaring emissions in Nigeria have significantly decreased by 25 % from 2014 to 2015. Existing emission inventories were used for validation. CO2 emissions with the estimated uncertainty in parentheses of 2.7 (3. 6∕0. 5) Tg yr−1 for 2014 and 2.0 (2. 7∕0. 4) Tg yr−1 for 2015 were derived. Regarding the uncertainty range, the emission estimate is in the same order of magnitude compared to existing emission inventories with a tendency for underestimation. The deviations might be attributed to a shortage in information about the combustion efficiency within southern West Africa, the decreasing trend in gas flaring or inconsistent emission sector definitions. The parameterization source code is available as a package of R scripts.')
            .should('not.be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button span')
            .contains('Substitute')
            .should('be.visible');
        cy.task('log', '☑️ \tSubstitution tab check successful.');

        //Change tabs
        cy.getIframeBody('[name="htmlFrame"]')
            .find('div.MuiTabs-scrollButtonsDesktop:last-child')
            .scrollIntoView()
            .should('be.visible')
            .click();
        
        //Metadata tabs
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#metadata')
            .click();
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#metadata')
            .invoke('attr', 'tabindex')
            .should('eq', '0');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('h2')
            .contains('Metadata of compendium:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span#title')
            .contains('Monitoring Deforestation In Landsat Data Cubes Using NDVI')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains(' Created on: ')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('p')
            .contains('2021-03-24 08:29')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('by:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('p')
            .contains('0000-0001-6286-8022')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('Deforestation of the rainforest, especially in Brazil, is a recurring topic in science and public. Illegal deforestation is often detected far too late to prevent it. With this work we present a reproducible approach to detect deforestation in near real time by NDVI computation of satellite imagery. Using appropriately cloud-adjusted and deseasonalized reference data, critical NDVI changes were calculated for past deforestation events. Taking these values and selecting an appropriate quantile for them above which an NDVI change is considered as critical, two satellite images can be examined for deforestation.')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('td')
            .contains('Nick Jakuschona – n_jaku01@uni-muenster.de')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('td')
            .contains('Tom Niers – tom.niers@uni-muenster.de')
            .scrollIntoView()
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('Publication Date:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('Display File:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('Main File:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('License:')
            .scrollIntoView()
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('DOI:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('Languages:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('Keywords:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('Spatial extend:')
            .scrollIntoView()
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span')
            .contains('Temporal extend:')
            .scrollIntoView()
            .should('be.visible');
        cy.task('log', '☑️ \tMetadata tab check successful.');

        //Shipment tab
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#shipment')
            .scrollIntoView()
            .should('be.visible')
            .click();
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button#shipment')
            .invoke('attr', 'tabindex')
            .should('eq', '0');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('p#description')
            .contains('Create new Shipment:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('fieldset')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('input')
            .eq(0)
            .should('be.visible')
            .should('have.value', 'zenodo');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('input')
            .eq(1)
            .should('be.visible')
            .should('have.value', 'zenodo_sandbox');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('input')
            .eq(2)
            .should('be.visible')
            .should('have.value', 'download');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('button')
            .contains('Shipment')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('span.MuiTypography-h5')
            .contains(/(\w|\d){8}-(\w|\d){4}-(\w|\d){4}-(\w|\d){4}-(\w|\d){12}/)
            .scrollIntoView()
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('p:contains("2021-06-25 12:45:26.685943") > span')
            .contains(' Last modified on: ')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('p:contains("2021-06-25 12:45:26.685943") > span')
            .contains('Created by:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('p:contains("2021-06-25 12:45:26.685943") > span')
            .contains('Recipient:')
            .should('be.visible');
        cy.getIframeBody('[name="htmlFrame"]')
            .find('p:contains("2021-06-25 12:45:26.685943") > span')
            .contains('Recipient:')
            .should('be.visible');
        cy.task('log', '☑️ \tShipment tab check successful.');
    });
});