var db_isAuthed = false;
var db_token = null;

// template for new oauth2 service
function oauth2_login() {
    $.oauth2({
        auth_url: 'https://www.dropbox.com/1/oauth2/authorize',           // required
        response_type: 'token',      // required - "code"/"token"
        token_url: '',          // required if response_type = 'code'
        logout_url: '',         // recommended if available
        client_id: 'w0hbx5qrpzx64na',          // required
        client_secret: '',      // required if response_type = 'code'
        redirect_uri: 'https://www.dropbox.com/1/oauth2/redirect_receiver',       // required - some dummy url
        other_params: {}        // optional params object for scope, state, display...
    }, function(token, response){

        // clean up token
        token = token.split('&')[0];

        // do something with token or response
        $("#logs").append("<p class='success'><b>access_token: </b>"+token+"</p>");

        db_token = token;
        db_isAuthed = true;

    }, function(error, response){
        // do something with error object
        $("#logs").append("<p class='error'><b>error: </b>"+JSON.stringify(error)+"</p>");
        $("#logs").append("<p class='error'><b>response: </b>"+JSON.stringify(response)+"</p>");

        db_isAuthed = false;
        db_token = null;
    });
}


function get_files(path) {
    if (!db_isAuthed) { return; }

    path = path || "";

    $.ajax({
        url: "https://api.dropboxapi.com/2/files/list_folder",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            path: path,
            include_media_info: true,
        }),
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader('Authorization','Bearer ' + db_token);
        },
        success: function(data) {
            var files = $('#files');
            files.find('li').remove();

            // console.log(data);

            for (var i=0; i < data.entries.length; i++) {
                var entry = data.entries[i];
                var node = document.createElement('li');
                var imgSrc = "";

                // .tag: "file"
                // .tag: "folder"
                // path_lower: "/pd_sample.zip"

                if (entry[".tag"] === "file") {
                    node.textContent = entry.path_lower + " (" + entry.size + " kb)";
                    imgSrc = "./dropbox-api-icons/16x16/page_white.gif";
                } else {
                    node.textContent = entry.path_lower;
                    imgSrc = "./dropbox-api-icons/16x16/folder.gif";
                }

                node.setAttribute("data-id", encodeURI(entry.path_lower));

                var img = document.createElement('img');
                img.setAttribute('src', imgSrc);

                node.appendChild(img);

                files.append(node);
            }

        },
        error: function(error){
            alert('error');
            console.log(error);
        }
    });
}
