/**
 * Script for the submmission metadata form files. 
 */

/**
 * function to request metadata for a certain ERC from the o2r server. 
 * WIP: For a by an user given ERC-ID the user can request by pressing a button the transfer from the ERC metadata stored by o2r to the metadata input of OJS. 
 *      Then the metadata input field is automatically filled. Here it is shown exemplary for the title. 
 */
function handleRequestErcData() {

    var ErcId = document.getElementById("ErcId").value; 
    
    $.getJSON( "https://o2r.uni-muenster.de/api/v1/compendium/" + ErcId + "/metadata", function(result) {
        //console.log(result);
        //console.log(result.metadata.o2r.title);

        $( "input[id^='title']" ).val(result.metadata.o2r.title); // https://api.jquery.com/category/selectors/attribute-selectors/ 
       });

}