<?php
import('lib.pkp.classes.form.Form');

/**
 * Form for the plugin settings of the geoOJS plugin. 
 */
class ojsErcPluginSettingsForm extends Form 
{
    public $plugin;

    public function __construct($plugin)
    {

        // Define the settings template and store a copy of the plugin object
        parent::__construct($plugin->getTemplateResource('settings.tpl'));
        $this->plugin = $plugin;

        // Always add POST and CSRF validation to secure your form.
        $this->addCheck(new FormValidatorPost($this));
        $this->addCheck(new FormValidatorCSRF($this));
    }

    /**
     * Load settings already saved in the database
     *
     * Settings are stored by context, so that each journal or press
     * can have different settings.
     */
    public function initData()
    {        
        $contextId = Application::get()->getRequest()->getContext()->getId();
        $this->setData('serverURL', $this->plugin->getSetting($contextId, 'serverURL'));
        $this->setData('ERCGalleyColourFromDb', $this->plugin->getSetting($contextId, 'ERCGalleyColour'));
        $this->setData('releaseVersionFromDb', $this->plugin->getSetting($contextId, 'releaseVersion'));
        $this->setData('ERCo2ruiGalley', $this->plugin->getSetting($contextId, 'ERCo2ruiGalley'));
        $this->setData('ERCHTMLGalley', $this->plugin->getSetting($contextId, 'ERCHTMLGalley'));


        parent::initData();
    }

    /**
     * Load data that was submitted with the form
     */
    public function readInputData()
    {
        $this->readUserVars(['serverURL']);
        $this->readUserVars(['ERCGalleyColour']);
        $this->readUserVars(['releaseVersion']);
        $this->readUserVars(['ERCo2ruiGalley']);
        $this->readUserVars(['ERCHTMLGalley']);
        parent::readInputData();

        /*
		Update the config.js of the build in terms of the baseURL and colour specified in the plugin settings. 
		*/
		$pathConfigJs = $this->plugin->pluginPath . '/build/config.js'; 

		$rawConfigFile = fopen($pathConfigJs, "r+");
		$readConfigFile = fread($rawConfigFile, filesize($pathConfigJs)); 

		$baseUrlSpecifiedInSettings = $this->_data[serverURL]; 
		$ERCGalleyColourSpecifiedInSettings = $this->_data[ERCGalleyColour]; 

		preg_match('/"baseUrl":\s"[^,]*"/', $readConfigFile, $configOld);        
		$configNew = '"baseUrl": "' . $baseUrlSpecifiedInSettings . '"'; 
		$adaptedConfig = str_replace($configOld[0], $configNew, $readConfigFile);

        preg_match('/"ERCGalleyPrimaryColour":\s"[^,]*"/', $adaptedConfig, $configOld);        
		$configNew = '"ERCGalleyPrimaryColour": "' . $ERCGalleyColourSpecifiedInSettings . '"'; 
		$adaptedConfig = str_replace($configOld[0], $configNew, $adaptedConfig);

		file_put_contents($pathConfigJs, $adaptedConfig);
		fclose($rawConfigFile);


        /*
        If the new set release version by the user is different from the currently by the plugin used release version, 
        the currently used build is deleted and thus the download process for the build with the version specified by the user in the settings is started in the script "ojsErcPlugin.inc.php. 
        */
        $contextId = Application::get()->getRequest()->getContext()->getId();
        
        // currently used build version is stored in database and gets updated after each setting change by the user in the function execute() below. Here the setting is queried for the comparison. 
        $releaseVersionFromDb = $this->plugin->getSetting($contextId, 'releaseVersion');

        // build version specified by the user 
        $releaseVersion = $this->_data[releaseVersion];

        // path of the currently used build folder 
        $pathBuildFolder = $this->plugin->pluginPath . '/build'; 

        // Additionally the case must be considered, if no change is made by the user, then the hidden field remains empty, however no empty indication in the data base should be stored, but the old indication should remain. 
        if ($releaseVersionFromDb !== $releaseVersion && $releaseVersion !== "") {
            rrmdir($pathBuildFolder); 
        }
    }

    /**
     * Fetch any additional data needed for your form.
     *
     * Data assigned to the form using $this->setData() during the
     * initData() or readInputData() methods will be passed to the
     * template.
     */
    public function fetch($request, $template = null, $display = false)
    {

        // Pass the plugin name to the template so that it can be
        // used in the URL that the form is submitted to
        $templateMgr = TemplateManager::getManager($request);
        $templateMgr->assign('pluginName', $this->plugin->getName());

        return parent::fetch($request, $template, $display);
    }

    /**
     * Save the settings
     */
    public function execute()
    {
        $contextId = Application::get()->getRequest()->getContext()->getId();

        $this->plugin->updateSetting($contextId, 'serverURL', $this->getData('serverURL'));
        $this->plugin->updateSetting($contextId, 'ERCGalleyColour', $this->getData('ERCGalleyColour'));
        $this->plugin->updateSetting($contextId, 'ERCo2ruiGalley', $this->getData('ERCo2ruiGalley'));
        $this->plugin->updateSetting($contextId, 'ERCHTMLGalley', $this->getData('ERCHTMLGalley'));

        if ($this->getData('releaseVersion') !== ""){
            $this->plugin->updateSetting($contextId, 'releaseVersion', $this->getData('releaseVersion'));
        }

        // Tell the user that the save was successful.
        import('classes.notification.NotificationManager');
        $notificationMgr = new NotificationManager();
        $notificationMgr->createTrivialNotification(
            Application::get()->getRequest()->getUser()->getId(),
            NOTIFICATION_TYPE_SUCCESS,
            ['contents' => __('common.changesSaved')]
        );

        return parent::execute();
    }
}

/**
 * Function to delete a directory and all content (files, directories) in it. 
 */
function rrmdir($dir) {
    if (is_dir($dir)) {
      $objects = scandir($dir);
      foreach ($objects as $object) {
        if ($object != "." && $object != "..") {
          if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); else unlink($dir."/".$object);
        }
      }
      reset($objects);
      rmdir($dir);
    }
} 