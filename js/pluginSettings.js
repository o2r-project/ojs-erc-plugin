/**
 * Script for the plugin settings (URL, colour, release). 
 */

/**
 * Functions to enable a release switch.
 * In the following, all available releases of the o2r UI on github are queried to allow the user to set which release to use for the plugin. 
 * For this purpose, radio buttons with a corresponding label are created according to the available releases. 
 */
$.getJSON("https://api.github.com/repos/o2r-project/o2r-UI/releases", function(result){

    // array of tagNames of the currently available o2r-UI releases on github 
    var tagNames = []; 
    for (var i = 0; i < result.length; i++) {
        tagNames.push(result[i].tag_name); 
    }

    // position where to insert the radio buttons 
    var releaseDescription = document.getElementById("releaseDescription");

    var linebreak = document.createElement("br");
    document.body.appendChild(linebreak);
    releaseDescription.after(linebreak); 

    // for each entry received from github as active release, a radio button with corresponding label is created 
    for (var i = 0; i < tagNames.length; i++){
        var radio = document.createElement("INPUT");
        radio.setAttribute("type", "radio");
        radio.setAttribute("id", tagNames[i]);
        radio.setAttribute("name", "release");
        radio.setAttribute("onchange", "handleRadioCheckChange(this);");
        document.body.appendChild(radio); 
        linebreak.after(radio);

        var label = document.createElement("Label");
        label.setAttribute("for",tagNames[i]);
        label.innerHTML = tagNames[i];
        document.body.appendChild(label);
        radio.after(label); 
    }

    /*
    The version already selected by the user is read from a hidden input field and the corresponding radio button is checked. 
    This hidden input field in the template has received the information from the database. 
    */
    var releaseVersionFromDb = document.getElementsByName("releaseVersionFromDb")[0].value;
    document.getElementById(releaseVersionFromDb).checked = true;

});

/**
 * If a radio button is checked, the selection by the user is stored in a hidden input field 
 * and the corresponding adjustment of the release is made by the script ojsErcPluginSettingsForm.inc.php 
 * and the currently uses release version is stored in the database. 
 */ 
function handleRadioCheckChange(radio) {
    document.getElementById("releaseVersion").value = radio.id; 
}




/** 
 * Functions to enable a colour picker.
 * Initially the colour stored in the database is displayed (both in the text field, and in the colour picker), if none is stored the colour is black
 *  However, this case should already be caught by "plugins/generic/ojs-erc-plugin/ojsErcPlugin.inc.php". 
 */ 
var ERCGalleyColourFromDb = document.getElementsByName("ERCGalleyColourFromDb")[0].value;

if (ERCGalleyColourFromDb === '' || ERCGalleyColourFromDb === null) {
    ERCGalleyColourFromDb = '#000000';
}

document.getElementById("colorSelect").value = ERCGalleyColourFromDb;
document.getElementById("ERCGalleyColour").value = ERCGalleyColourFromDb;


// The colour is read from the colour picker when it is used and the corresponding variable and textfield are adjusted. 
document.getElementById("colorSelect").addEventListener("input", function () {

    document.getElementById("ERCGalleyColour").value = document.getElementById("colorSelect").value;

}, false);

/**
 * If a text entry is made in the text field, it is checked for HEX format. 
 * If the text corresponds to this format, the corresponding variable and the display in the colour picker are adjusted.
 */
document.getElementById("ERCGalleyColour").addEventListener("blur", function () {

    if (/^#[0-9A-F]{6}$/i.test(document.getElementById("ERCGalleyColour").value) !== true) {
        alert('The input in the text field is not a HEX colour code and is reset to the previously saved one. The HEX colour code must start with a "#" followed by 6 numbers or characters in the appropriate combination.');
        document.getElementById("ERCGalleyColour").value = ERCGalleyColourFromDb;
        document.getElementById("colorSelect").value = ERCGalleyColourFromDb; 
    }
    else {
        document.getElementById("colorSelect").value = document.getElementById("ERCGalleyColour").value;
    }
}, false); 