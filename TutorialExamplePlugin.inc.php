<?php
// import of genericPlugin
import('lib.pkp.classes.plugins.GenericPlugin');
/**
 * Each plugin must extend one of the plugin category classes that exist in OJS and OMP. 
 * In our case its the genericPlugin class. 
 */
class TutorialExamplePlugin extends GenericPlugin {
	public function register($category, $path, $mainContextId = NULL) {

		// Register the plugin even when it is not enabled
		$success = parent::register($category, $path);

		// important to check if plugin is enabled before registering the hook, cause otherwise plugin will always run no matter enabled or disabled! 
		if ($success && $this->getEnabled()) {
			HookRegistry::register('Example::hookName', array($this, 'doSomething'));
		}

		return $success;
	}

	public function doSomething($hookName, $args) {
		// Do something...
	  }

	public function getDatabase($request) {

		$context = $request->getContext();
		$genreDao = DAORegistry::getDAO('GenreDAO'); /* @var $genreDao GenreDAO */
		$dependentFilesOnly = $request->getUserVar('dependentFilesOnly') ? true : false;
		$genres = $genreDao->getByDependenceAndContextId($dependentFilesOnly, $context->getId());

		// Transform the genres into an array and
		// assign them to the form.
		$genreList = array();
		while ($genre = $genres->next()) {
			$genreList[$genre->getId()] = $genre->getLocalizedName();
		}
		echo $genreList; 
		return $genreList;
	}

	
	/**
	 * Provide a name for this plugin (plugin gallery)
	 *
	 * The name will appear in the Plugin Gallery where editors can
	 * install, enable and disable plugins.
	 */
	public function getDisplayName() {
		return 'o2r plug-in new';
	}

	/**
	 * Provide a description for this plugin (plugin gallery) 
	 *
	 * The description will appear in the Plugin Gallery where editors can
	 * install, enable and disable plugins.
	 */
	public function getDescription() {
		return 'Plug-in for making (E)RC uploadable, viewable, manipulateable in the article view.';
	}
}