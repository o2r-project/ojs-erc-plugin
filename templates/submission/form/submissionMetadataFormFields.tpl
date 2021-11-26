{*the main template is here extended using the hook
'Templates::Submission::SubmissionMetadataForm::AdditionalMetadata'*}

<div style="clear:both;">
    {fbvFormArea id="tagitFields" title="plugins.generic.ojsErcPlugin.createErc"}
    <p align="justify" class="description">{translate
        key="plugins.generic.ojsErcPlugin.createErc.description"}</p>

    {*ErcId*}
    {fbvFormSection title="plugins.generic.ojsErcPlugin.createErc.ErcId" for="period" inline=true}
    <p align="justify" class="description">{translate
        key="plugins.generic.ojsErcPlugin.createErc.ErcId.description"}
    </p>
    <input type="text" name="ErcId" id ="ErcId" style="width: 100%; height: 32px; z-index: 0;" value='{$ErcIdFromDb}'/>
    <input type="text" id="ErcIdFromDb" name="ErcIdFromDb"
        style="height: 0px; width: 0px; visibility: hidden;" value='{$ErcIdFromDb}' />
    {/fbvFormSection}

    {*RequestMetadata*}
    {fbvFormSection title="plugins.generic.ojsErcPlugin.createErc.requestData" for="period" inline=true}
    <button type="button" onclick="handleRequestErcData()">Request ErcData</button>
    {/fbvFormSection}

    {/fbvFormArea}
</div>

{*main js script, needs to be loaded last*}
<script src="{$submissionMetadataFormFieldsJS}" type="text/javascript" defer></script>
