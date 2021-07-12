### Cypress test instructions

In the directory `cypress` you will find the Cypress ci tests for our plugin. 

You can run them locally by:
1. Go into your OJS installation directory and start the php development sever with `php -S localhost:8000`
2. Option A) In another terminal (but the same directory) run `npx cypress run` for a test run in the terminal
3. Option B) Or use `npx cypress open` for a Cypress GUI 

Further reading:
- [Cypress CLI](https://docs.cypress.io/guides/guides/command-line)
- [OJS Installation](https://docs.pkp.sfu.ca/dev/documentation/en/getting-started) (Can be replaced by our wiki in the future :] )