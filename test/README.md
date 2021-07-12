## Automatic Test Flow For The OJS-ERC-PLUGIN

In this subdirectory you can find all necessary tools for the automatic test flow we deploy for this project.
You can see all test flow runs [here](https://github.com/o2r-project/ojs-erc-plugin/actions).

### Used technologies and test directory structure 
The test flow is realized using [Cypress](https://docs.cypress.io/) as the test framework.
OJS and the needed database are run in two docker containers.
These are started by the [docker-compose file](./docker-compose.yml). 
Then a third container which houses Cypress starts and runs the tests contained in the `.spec.js` files of the [cypress/cypress subdirectory](./cypress/cypress).
Custom commands are stored in [cypress/cypress/support/commands.js](./cypress/cypress/support/commands.js).

### Test Order
The test flow does the following tasks:

1. Starts the docker-compose for OJS and database.
2. Loads in Cypress.
3. Finishes Installation of OJS.
4. Creates a new Journal named O2R News (O2RN).
5. Enables the OJS-ERC-PLUGIN for O2RN.
6. Creates a new submission for O2RN.
7. Links [this ERC](https://o2r.uni-muenster.de/erc/geQfc) to the submission.
8. Goes into the preview for the new submission.
9. Checks all contents of the ERC galley.

### Local Testing on Ubuntu
You can run the the test flow locally with [act](https://github.com/nektos/act). For this you need act and Docker installed. 

You need to run the [ract.sh](../ract.sh) like this:
```
sudo bash ract.sh
```
(The first run can last a bit since a few Docker containers need to be downloaded.)

