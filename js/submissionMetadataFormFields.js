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

/*
function not used anymore, initial tries to connect with o2r server 
function sendZIP() {

    document.cookie = "Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly"
    document.cookie = "name=oeschger; SameSite=None; Secure";
    document.cookie = "favorite_food=tripe; SameSite=None; Secure";
    
    
    //const cookieValue = document.cookie
    //    .split('; ')
    //    .find(row => row.startsWith('name='))
    //    .split('=')[1];
    
    //console.log("name value = " + cookieValue); 

    

	// Setzen der Cookies
	//setcookie("cookie[vier]", "ffffd");
	//setcookie("HereWeGo", "wewewe", NULL, NULL, NULL, NULL, true);

	//$w = "test"; 
    
		
		
    let allCookies = document.cookie;
    console.log(allCookies);



    // requests 
    // o2r API doku: https://o2r.info/api/#operation/compendium_list_job 
    // Who I am Request 
    $.ajax({
        type: 'GET',
        url: 'http://localhost/api/v1/auth/whoami',
        xhrFields: {
            withCredentials: true
    }}).done(function(res) {
        console.log(res);
    });

    // request to start check 
    // Attention this request basically works but crashes the UI at the moment 
    // it the server is not working anymore just "control + c" and restart with "sudo docker-compose -f "docker-compose-dev.yml" up --build" without "docker-compose down"
    var data = new FormData(); 
    data.append("compendium_id", "NrdKu"); // adapt ERC ID 
    
    $.ajax({
        type: 'POST',
        data: data,
        processData: false, 
        contentType: false, 
        url: 'http://localhost/api/v1/job',
        xhrFields: {
            withCredentials: true
    }}).done(function(res) {
        console.log(res);
    });

}*/