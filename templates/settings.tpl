{*template which creates settings for the ojsErcPlugin.'*}
<script>
    $(function() {ldelim}
    $('#ojsErcPluginSettings').pkpHandler('$.pkp.controllers.form.AjaxFormHandler');
    {rdelim});
</script>

<form class="pkp_form" id="ojsErcPluginSettings" method="POST"
    action="{url router=$smarty.const.ROUTE_COMPONENT op="manage" category="generic" plugin=$pluginName verb="settings" save=true}">
    <!-- Always add the csrf token to secure your form -->
    {csrf}

    {*serverURL*} 
    {fbvFormArea}
    {fbvFormSection list=true}
    <p align="justify" class="description" style="color: rgba(0,0,0,0.54)">{translate
        key="plugins.generic.ojsErcPlugin.settings.serverURL.description"}
        {fbvElement
        type="text"
        id="serverURL"
        value=$serverURL
        label="plugins.generic.ojsErcPlugin.settings.serverURL"
        }
        {/fbvFormSection}
        {/fbvFormArea}

    {*colorPicker*}
    {fbvFormArea}
    {fbvFormSection list=true}
    <p align="justify" class="description" style="color: rgba(0,0,0,0.54)">{translate
        key="plugins.generic.ojsErcPlugin.settings.ERCGalleyColour.description"}
    <br>
    <br>
    <table>
        <tbody>
            <tr>
                <td> 
                    <input type="color"id="colorSelect">
                </td>
                <td>
                    <input type="text" id="ERCGalleyColour" name="ERCGalleyColour" style="height: 10; width: 10; z-index: 0;"/>
                </td>
            </tr>
        </tbody>
    </table>
    {fbvElement
        type="text"
        id="ERCGalleyColourFromDb"
        value=$ERCGalleyColourFromDb
        style="height: 0px; width: 0px; z-index: 0; visibility: hidden;"
        }
    {/fbvFormSection}
    {/fbvFormArea}

    {*Release*}
    {fbvFormArea}
    {fbvFormSection list=true}
    <p align="justify" class="description" id="releaseDescription" style="color: rgba(0,0,0,0.54)">{translate
        key="plugins.generic.ojsErcPlugin.settings.Release.description"}
    {fbvElement
        type="text"
        id="releaseVersionFromDb"
        value=$releaseVersionFromDb
        style="height: 0px; width: 0px; z-index: 0; visibility: hidden;"
        }
    <input type="text" id="releaseVersion" name="releaseVersion" style="height: 0px; width: 0px; z-index: 0; visibility: hidden;"/>
    {/fbvFormSection}
    {/fbvFormArea}

    {*GalleySettings*}
    {fbvFormArea}
    {fbvFormSection list=true}
    <p align="justify" class="description" id="GalleySettings" style="color: rgba(0,0,0,0.54)">{translate
        key="plugins.generic.ojsErcPlugin.settings.GalleySettings.description"}
    {fbvElement type="checkbox" name="ERCo2ruiGalley" id="ERCo2ruiGalley" checked=$ERCo2ruiGalley label="plugins.generic.ojsErcPlugin.settings.GalleySettings.o2rui" translate="true"}
    {fbvElement type="checkbox" name="ERCHTMLGalley" id="ERCHTMLGalley" checked=$ERCHTMLGalley label="plugins.generic.ojsErcPlugin.settings.GalleySettings.html" translate="true"}
    {/fbvFormSection}
    {/fbvFormArea}


    {fbvFormButtons submitText="common.save"}
</form>

{*main js script, needs to be loaded last*}
<script src="{$pluginSettingsJS}" type="text/javascript" defer></script>