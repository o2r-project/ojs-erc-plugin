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

Then you interact with the new instance of OJS via [`http://localhost:8000`](http://localhost:8000).
When you want to end this instance and clean up for the next run execute:
```
sudo bash ract_cleanup.sh
```
If you want to execute the entire test flow including the cleanup and do not want interact with the OJS instance run:
```
sudo bash ract_complete.sh
```

Please note that you view videos of the UI tests in [./cypress/cypress/videos](./cypress/cypress/videos) if enable them by setting `video` to `true` in the [cypress.json](./cypress/cypress.json).

You can also run into problems with memory usage when executing the test flow multiple times in succession. I have taken some measures to deal with it.
However please take at least a minute between runs to ensure smooth execution.  
This indicated by the following error messages:
```
1) Setup in general is tested Visit the journal site and find the ERC Plugin:
      CypressError: Timed out retrying: Expected to find element: 'div:contains('The plugin "ojs-erc-plugin" has been enabled.')', but never found it.

<...>

1) Test whether all ERC galley functionality is available. Test components of ERC Galley:
        CypressError: Timed out retrying: Expected to find element: 'div#footer', but never found it. Queried from element: <body>
```

or 

```
1) Test whether all ERC galley functionality is available. Test components of ERC Galley:
|       CypressError: Timed out retrying: expected '<body>' not to be 'empty'    
```

### Problem Solving

If you run into a problem which can not be solved with cypress alone you can write [node](http://nodejs.org) plugin code. This can be done in the [./cypress/cypress/plugins/index.js](./cypress/cypress/plugins/index.js).

For more infos check this [cypress guide](https://docs.cypress.io/api/commands/task).
