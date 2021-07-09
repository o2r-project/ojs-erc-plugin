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
    <input type="text" name="ErcId" style="width: 100%; height: 32px; z-index: 0;" value='{$ErcIdFromDb}'/>
    <input type="text" id="ErcIdFromDb" name="ErcIdFromDb"
        style="height: 0px; width: 0px; visibility: hidden;" value='{$ErcIdFromDb}' />
    {/fbvFormSection}

    {/fbvFormArea}
</div>


