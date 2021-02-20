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
        {fbvFormButtons submitText="common.save"}
</form>