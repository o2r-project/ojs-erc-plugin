# OJS-ERC-Plugin

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

*Plugin for making [ERC](https://doi.org/10.1045/january2017-nuest) uploadable, viewable, manipulateable in [OJS](https://pkp.sfu.ca/ojs/).*

This project is part of the project Opening Reproducible Research ([o2r](https://o2r.info/about)).

[![o2r logo](https://o2r.info/public/images/logo-transparent.png)](https://o2r.info/about)

# Contribute

All help is welcome: asking questions, providing documentation, testing, or even development.

Please note that this project is released with a [Contributor Code of Conduct](CONDUCT.md).
By participating in this project you agree to abide by its terms.

# Creation of a Release

These instructions describe the procedure for creating a new release.

1. In the file `version.xml` the version number must be adjusted according to the changes made (`major.minor.bugfix`) and the date must be updated. 
2. The changes made must be recorded in the file `CHANGELOG.md` file with `version number` and `date` sorted by `Added`, `Fixed`, `Changed` and identifiable as `Unreleased` or `Release`.
3. Via the link https://github.com/o2r-project/ojs-erc-plugin/releases/new a new release must be created in github with corresponding `tag`-version, `title` and `description`. 
4. ~~The release must be republished in the `OJS Plugin Gallery`. A description for this step can be found via this link https://docs.pkp.sfu.ca/dev/plugin-guide/en/release.~~  (This step should be carried out at a later stage, since the plugin is currently in WIP state)

# License

This project is published und the GPL-3.0 License (see file `LICENSE`).
