# Changelog

All notable changes to this project will be documented in this file.

## [0.1.1] - 28.03.22 

### Added 
- implemented possibility to add an ErcId to the submission in submission step 3. which enables to add an existing ERC to a submission (currently commented out)
- the genre "Executable Research Compendium" is added by the plugin, by selecting this genre in submission step 2., the uploaded zip is uploaded to the o2r service and becomes a candidate 
- request to the o2r service at the end of submission step 2. to upload the inserted workspace.zip to the o2r service so that it becomes a candidate 
- request to the o2r service at the end of submission step 2. to receive automatically extracted metadata of the just created candidate and insert them in the OJS submission step 3. (currently title and abstract)
- request to the o2r service at the end of submission step 3. to publish the in submission step 2. created candidate. The in OJS adapted metadata are also adpated correspondingly in the o2r service 
- option to add the o2r server cookie in the OJS plugin settings, so that an connection from OJS to the o2r service can be built  

### Fixed

### Changed 
- way to use the FormValidator in the plugin settings and the way to receive publication information (Repo) to fit the current OJS version 

## [Unreleased] - 21.11.21 

### Added 
- Enabled defining the ERCGalleyColor in the plugin settings 
- Enabled adjusting the o2r-ui release/ build version in the plugin settings 
- Enabled viewing the ERC display-html in an own galley in the OJS article view 
- Created selection in the plugin settings where the users can decide if they want ERC galleys to be created or not 
- An ERC is downloadable through the given function of the o2r-ui provided in the ERCGalley 
- An preview of the galleys and with it the ERC is enabled due to the preview option in the review section of OJS

### Fixed
- Fixed that after changing the build ERCGalleys built with former builds can no longer be opened. Now ERCGalleys built with former builds can be also opened with newer builds. Starting from build number 0.5.6 and higher 

### Changed 
- Deleted build directory (added it to the .gitignore-file), as it should be loaded locally 


## [Unreleased] - 09.07.21

### Added 
- Defining the o2r reproducibility service URL is enabled in the plugin settings 
- An ERC ID can be added to an submission in the OJS submission process and is stored in the OJS database
- The ERC can be viewed in a manipulable view as a galley in the OJS article view 
- In the ERC galley the classic o2r services Inspect, Check, Manipulate, Substitution, Metadata, Shipment are available 

### Fixed

### Changed 
