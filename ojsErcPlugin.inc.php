<?php
// import of genericPlugin
import('lib.pkp.classes.plugins.GenericPlugin');
import('lib.pkp.classes.submission.SubmissionFile');

use phpDocumentor\Reflection\Types\Null_;
use \PKP\components\forms\FormComponent;
use \PKP\components\forms\FieldHTML; // needed for function extendScheduleForPublication
use PKP\submission\SubmissionFile;

/**
 * ojsErcPlugin, a generic Plugin for enabling geospatial properties in OJS 
 */
class ojsErcPlugin extends GenericPlugin
{
	public function register($category, $path, $mainContextId = NULL)
	{
		// Register the plugin even when it is not enabled
		$success = parent::register($category, $path, $mainContextId);
		// important to check if plugin is enabled before registering the hook, cause otherwise plugin will always run no matter enabled or disabled! 
		if ($success && $this->getEnabled()) {			
			/*
			Load the current build of the o2r api, if it is not already there 
			*/
			$o2rBuildAlreadyThere = is_dir($this->getPluginPath() . '/' . 'build');

			if ($o2rBuildAlreadyThere === false) {
				$url = 'https://github.com/o2r-project/o2r-UI/releases/download/0.5.4/build.zip'; // url to the build 
				#$url = 'https://github.com/NJaku01/o2r-UI/releases/download/0.5.1/build.zip'; // url to the build 
				$file_name = basename($url);

				$temporaryDirectory = sys_get_temp_dir(); // directory to store the zip-file 

				$pathZip = $temporaryDirectory . '/' . $file_name; // path in the temporary directory
				$pathNoZip = $this->getPluginPath() . '/' . 'build'; // final path in the plugin structure 

				// store unzipped build at final destination 
				if(file_put_contents($pathZip, file_get_contents($url))) {

					$zip = new ZipArchive;
					if ($zip->open($pathZip) === TRUE) {
  					  	$zip->extractTo($pathNoZip);
  					  	$zip->close();

						unlink($pathZip); // delete temporary file 

					} else {
 			 	  	//echo 'error';
					}
				}
				else {
		   	 	//echo "File downloading failed.";
				}
				
				/*
				Update the config.js of the build in terms of the baseURL specified in the plugin settings and set the ojsView to true. 
				It is here important to differ between two baseUrl the "baseUrl" which is the URL of the OJS server and 
				"baseUrlErc" which is the BaseUrl of the Erc server. 
				*/
				$pathConfigJs = $this->getPluginPath() . '/build/config.js'; 

				$rawConfigFile = fopen($pathConfigJs, "r+");
				$readConfigFile = fread($rawConfigFile, filesize($pathConfigJs)); 

				$contextId = Application::get()->getRequest()->getContext()->getId();
				$baseUrlErcFromSettings = $this->getSetting($contextId, 'serverURL'); 

				$baseUrlErcStandard= "https://o2r.uni-muenster.de/api/v1/"; 

				
				// if there is no url available from the plugin settings the standard url is used and correspondingly set in the database (ojs-erc-plugin settings) 
				if ($baseUrlErcFromSettings === null || $baseUrlErcFromSettings === '') {
					$baseUrlErc = $baseUrlErcStandard;

					$pluginSettingsDAO = DAORegistry::getDAO('PluginSettingsDAO');
					$pluginSettingsDAO->updateSetting($contextId, "ojsercplugin", "serverURL", $baseUrlErc);
				}
				else {
					$baseUrlErc = $baseUrlErcFromSettings;
				}

				/**
				 * The url is adjusted accordingly in config.js as well. 
				 * Additionally the ERCGalleyPrimaryColour is written in the config.js
				 * It is checked if the user has set an ERCGalleyColour in the ojs-erc-plugin settings, 
				 * if this is the case it is written into the config.js. If this is not the case, 
				 * the baseColour of the default theme plugin is written to the config.js, and to the variable ERCGalleyColour of the ojs-erc-plugin in the OJS database (ojs-erc-plugin settings).
				 * If no colour is set via the ojs-erc-plugin and default theme plugin, for example because another theme plugin is used, the OJS default colour is used, written to the config.js, 
				 * and to the variable ERCGalleyColour of the ojs-erc-plugin in the OJS database (ojs-erc-plugin settings).				 
				 * */
				// baseUrl
				preg_match('/"baseUrl":\s"[^,]*"/', $readConfigFile, $configOld);        
				$configNew = '"baseUrl": "' . $baseUrlErc . '"'; 
				$adaptedConfig = str_replace($configOld[0], $configNew, $readConfigFile);
				$adaptedOjsView = str_replace("false", "true", $adaptedConfig);

				// colour 
				$pluginSettingsDAO = DAORegistry::getDAO('PluginSettingsDAO');
				$context = PKPApplication::getRequest()->getContext();
				$contextId = $context ? $context->getId() : 0;
				$defaultThemePluginSettings = $pluginSettingsDAO->getPluginSettings($contextId, 'DefaultThemePlugin');
				$OJSERCPluginSettings = $pluginSettingsDAO->getPluginSettings($contextId, 'ojsercplugin');

				if ($OJSERCPluginSettings[ERCGalleyColour] === '' || $OJSERCPluginSettings[ERCGalleyColour] === null || isset($OJSERCPluginSettings[ERCGalleyColour]) === false ) {
					
					if ($defaultThemePluginSettings[baseColour] !== '' && $defaultThemePluginSettings[baseColour] !== null && isset($defaultThemePluginSettings[baseColour])) {
						$colour = $defaultThemePluginSettings[baseColour]; 
					}
					else {
					$colour = "#1E6292"; // OJS default colour 
					}

					$pluginSettingsDAO->updateSetting($contextId, "ojsercplugin", "ERCGalleyColour", $colour);

				}
				else {
					$colour = $OJSERCPluginSettings[ERCGalleyColour]; 
				}

				$positionColour = strpos($adaptedOjsView, 'ojsView') + 16; 
				$colourOption = '"ERCGalleyPrimaryColour": "' . $colour . '"'; 
				$insertColourOption = substr_replace($adaptedOjsView, $colourOption, $positionColour, 0);

				file_put_contents($pathConfigJs, $insertColourOption);
				fclose($rawConfigFile);

				/*
				Update the index.html of the build in terms of the users path for the css-, js-, logo-, and manifest-file(s). 
				*/
				$request = Application::get()->getRequest();
				$baseUrl = $request->getBaseUrl();

				$pluginPath = $this->getPluginPath(); 
				$pathHtml = $this->getPluginPath() . '/build/index.html'; 

				$rawHtmlFile = fopen($pathHtml, "r+");
				$readHtmlFile = fread($rawHtmlFile, filesize($pathHtml)); 

				/**
				 * Function that updates for a html file for all given regular expressions all paths concerning basUrl and pluginPath. 
				 */
				function updatePath($regularExpressions, $readHtmlFile, $baseUrl, $pluginPath)
  				{
					$adaptedHtml = $readHtmlFile;

					foreach ($regularExpressions as $key => $value) {

						$oldHtmlFile = $adaptedHtml; 

						$test = $regularExpressions[$i]; 

						preg_match($value, $oldHtmlFile, $oldPath);
					   	$newPath = $baseUrl . '/' . $pluginPath . '/build/' . substr($oldPath[0], 1); 
					   	$adaptedHtml = str_replace($oldPath[0], $newPath, $oldHtmlFile);
					}

					return $adaptedHtml; 
				}

				$regularExpressions = array(
					'staticCss' => '"\/static\/css\/[^=]*\.chunk\.css"',
					'staticCssMain' => '"\/static\/css\/main[^=]*\.chunk\.css"',
					'staticJs' => '"\/static\/js\/[^=]*\.chunk\.js"',
					'staticJsMain' => '"\/static\/js\/main[^=]*\.chunk\.js"', 
					'logo' => '"\/logo\.png"', 
					'manifest' => '"\/manifest\.json"', 
					'configJs' => '"\/config\.js"', 
				);

				file_put_contents($pathHtml, updatePath($regularExpressions, $readHtmlFile, $baseUrl, $pluginPath));
				fclose($rawHtmlFile);
			}

			/* 
			Hooks are the possibility to intervene the application. By the corresponding function which is named in the HookRegistery, the application
			can be changed. 
			Further information here: https://docs.pkp.sfu.ca/dev/plugin-guide/en/categories#generic 
			*/

			// Hooks for changing the frontent Submit an Article 3. Enter Metadata 
			HookRegistry::register('Templates::Submission::SubmissionMetadataForm::AdditionalMetadata', array($this, 'extendSubmissionMetadataFormTemplate'));
		
			// Hook for creating and setting a new field in the database 
			HookRegistry::register('Schema::get::publication', array($this, 'addToSchema'));
			HookRegistry::register('Publication::edit', array($this, 'editPublication')); // Take care, hook is called twice, first during Submission Workflow and also before Schedule for Publication in the Review Workflow!!!

			$request = Application::get()->getRequest();
			$templateMgr = TemplateManager::getManager($request);

			// main js scripts
			$templateMgr->assign('pluginSettingsJS', $request->getBaseUrl() . '/' . $this->getPluginPath() . '/js/pluginSettings.js');
		}
		return $success;
	}

	/**
	 * Function which extends the submissionMetadataFormFields template and adds template variables concerning temporal- and spatial properties 
	 * and the administrative unit if there is already a storage in the database. 
	 * @param hook Templates::Submission::SubmissionMetadataForm::AdditionalMetadata
	 */
	public function extendSubmissionMetadataFormTemplate($hookName, $params)
	{
		/*
		This way templates are loaded. 
		Its important that the corresponding hook is activated. 
		If you want to override a template you need to create a .tpl-file which is in the plug-ins template path which the same 
		path it got in the regular ojs structure. E.g. if you want to override/ add something to this template 
		'/ojs/lib/pkp/templates/submission/submissionMetadataFormTitleFields.tpl'
		you have to store in in the plug-ins template path under this path 'submission/form/submissionMetadataFormFields.tpl'. 
		Further details can be found here: https://docs.pkp.sfu.ca/dev/plugin-guide/en/templates
		Where are templates located: https://docs.pkp.sfu.ca/pkp-theming-guide/en/html-smarty
		*/

		$templateMgr = &$params[1];
		$output = &$params[2];

		// example: the arrow is used to access the attribute smarty of the variable smarty 
		// $templateMgr = $smarty->smarty; 

		$request = Application::get()->getRequest();
		$context = $request->getContext();
		
		/*
		In case the user repeats the step "3. Enter Metadata" in the process 'Submit an Article' and comes back to this step to make changes again, 
		the already entered data is read from the database, added to the template and displayed for the user.
		Data is loaded from the database, passed as template variable to the 'submissionMetadataFormFiels.tpl' 
	 	and requested from there in the 'submissionMetadataFormFields.js' to display coordinates in a map, the date and coverage information if available.
		*/

		$publicationDao = DAORegistry::getDAO('PublicationDAO');

		$submissionId = $request->getUserVar('submissionId');
		$publication = $publicationDao->getById($submissionId);

		$ErcId = $publication->getData('ojsErcPlugin::ErcId');
		
		//assign data as variables to the template 
		$templateMgr->assign('ErcIdFromDb', $ErcId);

		// echo "TestTesTest123"; // by echo a direct output is created on the page

		// here the original template is extended by the additional template modified by geoOJS  
		$output .= $templateMgr->fetch($this->getTemplateResource('submission/form/submissionMetadataFormFields.tpl'));

		return false;
	}

	/**
	 * Function which extends the schema of the publication_settings table in the database. 
	 * There are two further rows in the table one for the spatial properties, and one for the timestamp. 
	 * @param hook Schema::get::publication
	 */
	public function addToSchema($hookName, $params)
	{
		// possible types: integer, string, text 
		$schema = $params[0];

		$ErcId = '{
			"type": "string",
			"multilingual": false,
			"apiSummary": true,
			"validation": [
				"nullable"
			]
		}';
		$ErcIdDecoded = json_decode($ErcId);
		$schema->properties->{'ojsErcPlugin::ErcId'} = $ErcIdDecoded;
	}

	/**
	 * Function which fills the new fields (created by the function addToSchema) in the schema. 
	 * The data is collected using the 'submissionMetadataFormFields.js', then passed as input to the 'submissionMetadataFormFields.tpl'
	 * and requested from it in this php script by a POST-method. 
	 * @param hook Publication::edit
	 */
	
	function editPublication(string $hookname, array $params)
	{
		$newPublication = $params[0];
		$params = $params[2];

		$ErcId = $_POST['ErcId'];

		$testErcId = 'geQfc'; 

		/*
		If the user entered an ErcId, an html with the id in it is created, this html is uploaded as file and submission file and attachted to an galley. 
		Take care, function is called twice, first during Submission Workflow and also before Schedule for Publication in the Review Workflow!!!
		*/
		if ($ErcId !== null) {
			$newPublication->setData('ojsErcPlugin::ErcId', $ErcId);
		
			// get path were the initial html file for the galley is stored
			$pathHtmlFile = $this->getPluginPath() . '/ERCGalleyInitial.html'; 
			
			$ErcHtmlFileName = 'ERCGalley-' . $ErcId . '.html'; 
			
			/*
			Update the index.html of the build in terms of the ErcId and store it at a temporary location  
			*/
			$pathIndexHtml = $this->getPluginPath() . '/build/index.html'; 

			$temporaryDirectory = sys_get_temp_dir(); // directory to store the zip-file 
			$temporaryIndexHtmlPath = $temporaryDirectory . '/' . $ErcHtmlFileName; // path in the temporary directory

			copy($pathIndexHtml, $temporaryIndexHtmlPath);  

			$rawHtmlFile = fopen($temporaryIndexHtmlPath, "r+");
			$readHtmlFile = fread($rawHtmlFile, filesize($temporaryIndexHtmlPath)); 

			$positionConfigJs = strrpos($readHtmlFile, 'config.js"></script>'); // The ErcId must be inserted after the config.js, to overwrite the Id set in the config.js
			$positionConfigErcID = $positionConfigJs + 20; 

			$scriptErcId = '<script>config.ercID =  "' . $ErcId . '"; </script>'; 

			$adaptedErcId = substr_replace($readHtmlFile, $scriptErcId, $positionConfigErcID, 0);

			file_put_contents($temporaryIndexHtmlPath, $adaptedErcId);
			fclose($rawHtmlFile);

			/*
			Create new submission file.
			Therefore first a file is uploaded an than this file is used to create a submission file.  
			*/
			$request = Application::get()->getRequest();
			$context = $request->getContext();
			$contextId = $context->getId(); 
		
			// id of the new created publication 
			$submissionId = $newPublication->_data['id']; 

			// get path were the submission files are stored for this new submission 
			$pathSubmissionFiles = Services::get('submissionFile')->getSubmissionDir($contextId, $submissionId);

			// store/ create new file 
			$fileId = Services::get('file')->add($temporaryIndexHtmlPath, $pathSubmissionFiles . '/ERCGalley-' . $ErcId . '.html');
			
			$test = sys_get_temp_dir() . '/' . $ErcHtmlFileName; 
			unlink(sys_get_temp_dir() . '/' . $ErcHtmlFileName); 

			// get userId 
			$userId = Application::get()->getRequest()->getUser()->getId(); 

			// get language properties 
			$primaryLocale = $request->getContext()->getPrimaryLocale();
			$allowedLocales = $request->getContext()->getData('supportedSubmissionLocales');
	
	
			// set properties for the new submission file 
			$params = [
				'fileStage' => 2, // better use the constant PKP\submission\SubmissionFile::SUBMISSION_FILE_SUBMISSION, but dont know how 
				'fileId' => $fileId,
				'name' => [
					$primaryLocale => 'ERCGalley-' . $ErcId . '.html',
				],
				'submissionId' => $submissionId,
				'uploaderUserId' => $userId,
				'genreId' => 1
			];

			// proof properties on errors 
			$errors = Services::get('submissionFile')->validate(VALIDATE_ACTION_ADD, $params, $allowedLocales, $primaryLocale);

			// create the new submission file 
			if (empty($errors)) {
				$submissionFile = DAORegistry::getDao('SubmissionFileDAO')->newDataObject();
				$submissionFile->setAllData($params);
				$submissionFile = Services::get('submissionFile')->add($submissionFile, $request);
			}
		
			/*
			Create galley with the before uploaded submission file 
			*/ 
			$submissionFileId = $submissionFile->_data['id']; 
			$articleGalleyDAO = DAORegistry::getDAO('ArticleGalleyDAO');
			$galley = $articleGalleyDAO->newDataObject();

			$galley->setData('submissionFileId', $submissionFileId); 
			$galley->setLocale('en_US');
			$galley->setData('publicationId', $submissionId);
			$galley->setLabel('ERC');
			$galley->setSequence(1);
			$galley->setData('urlPath', 'erc-' . $ErcId);
			$articleGalleyDAO->insertObject($galley);
		}
	}

	/**
	 * @copydoc Plugin::getActions() - https://docs.pkp.sfu.ca/dev/plugin-guide/en/settings
	 * Function needed for Plugin Settings.
	 */
	public function getActions($request, $actionArgs)
	{

		// Get the existing actions
		$actions = parent::getActions($request, $actionArgs);
		if (!$this->getEnabled()) {
			return $actions;
		}

		// Create a LinkAction that will call the plugin's
		// `manage` method with the `settings` verb.
		$router = $request->getRouter();
		import('lib.pkp.classes.linkAction.request.AjaxModal');
		$linkAction = new LinkAction(
			'settings',
			new AjaxModal(
				$router->url(
					$request,
					null,
					null,
					'manage',
					null,
					array(
						'verb' => 'settings',
						'plugin' => $this->getName(),
						'category' => 'generic'
					)
				),
				$this->getDisplayName()
			),
			__('manager.plugins.settings'),
			null
		);

		// Add the LinkAction to the existing actions.
		// Make it the first action to be consistent with
		// other plugins.
		array_unshift($actions, $linkAction);

		return $actions;
	}

	/**
	 * @copydoc Plugin::manage() - https://docs.pkp.sfu.ca/dev/plugin-guide/en/settings#the-form-class 
	 * Function needed for Plugin Settings. 
	 */
	public function manage($args, $request)
	{
		switch ($request->getUserVar('verb')) {
			case 'settings':

				// Load the custom form
				$this->import('ojsErcPluginSettingsForm');
				$form = new ojsErcPluginSettingsForm($this);

				// Fetch the form the first time it loads, before
				// the user has tried to save it
				if (!$request->getUserVar('save')) {
					$form->initData();
					return new JSONMessage(true, $form->fetch($request));
				}

				// Validate and execute the form
				$form->readInputData();
				if ($form->validate()) {
					$form->execute();
					return new JSONMessage(true);
				}
		}
		return parent::manage($args, $request);
	}

	/**
	 * Provide a name for this plugin (plugin gallery)
	 *
	 * The name will appear in the Plugin Gallery where editors can
	 * install, enable and disable plugins.
	 */
	public function getDisplayName()
	{
		return __('plugins.generic.ojsErcPlugin.name');
	}

	/**
	 * Provide a description for this plugin (plugin gallery) 
	 *
	 * The description will appear in the Plugin Gallery where editors can
	 * install, enable and disable plugins.
	 */
	public function getDescription()
	{
		return __('plugins.generic.ojsErcPlugin.description');
	}
}