# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 27.03.22 

### Added 

### Fixed

### Changed 

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
