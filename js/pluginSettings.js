/**
 * Script for the plugin settings to enable a colour picker.  
 */


/** Initially the colour stored in the database is displayed (both in the text field, and in the colour picker), if none is stored the colour is black
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