var chosenId = "";

function activate(id) {
    var obj = $(`#${id}`);
    var objs = $(`.media_containers`);
    if (chosenId === id) {

        obj.removeClass("chosen");
        chosenId = "";
        for (var i = 0; i < objs.length; i++) {
            var current = $(objs[i]);
            if (current.attr("id") != id) {
                current.addClass("hovers");

            }
        }
        setTimeout(function () {
            toggle_hover(id)
        }, 400);
    } else {
        
        var others = false;
        for (var i = 0; i < objs.length; i++) {
            var current = $(objs[i]);

            if (current.hasClass("chosen") === true) {

                others = true;
                break;
            }
        }

        if (others === false) {
            chosenId = id;
            obj.addClass("chosen");
            objs.removeClass("hovers");
        }
    }


}

function toggle_hover(id) {
    
    if(chosenId === ""){
        $(`#${id}`).addClass('hovers');
    }
    
}

function handle(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        process_search_submit();
    }
}



function expandText(obj) {
    spans = $(obj).parent().children();
    $(spans[0]).hide();
    $(spans[1]).show();
    $(spans[2]).show();

}

function shrinkText(obj) {
    spans = $(obj).parent().children();
    $(spans[0]).show();
    $(spans[1]).hide();
    $(spans[2]).hide();
}

function process_search_submit() {
    if (chosenId === "") {
        alert("Please choose a category");
    } else {
        var text = $("#media_name").val();
        text = text.replace(" ","_");
        
        if (text === "") {
            alert("Please enter a name of anime/manga/book you want to search");
        } else {
            $('main').empty();
            var category = chosenId;
            if(category === "anime"){
                let anime_name = "";
                let mal_id = "";
                $.ajax({
                    type: "POST",
                    url: `/get_name/${category}/${text}`,
                    async: false,
                    success: function (response) {
                        
                        anime_name = response["anime_name"];
                        
                        mal_id = response["mal_id"];
                    }
                });
                let info = {};
                $.ajax({
                    type: "POST",
                    url: `/anime/mal_info/${mal_id}`,
                    success: function (response) {
                        
                        info = response;
                        info["name"] = anime_name;
                        let info_container = `
                        <div id="anime_info_container">
                            <div id="anime_image_container" class="align_perfectly">
                                <img src=${info["image_link"]} onError="this.onerror=null;this.src='{{url_for('static', filename = 'onerror_avatar.png' )}}';">

                            </div>
                            <div class="align_perfectly" style="border-bottom: 1.5px solid hsl(210, 14%, 89%);">
                                <p>Name: ${info["name"]}</p>

                            </div>
                            <div class="align_perfectly" style="border-bottom: 1.5px solid hsl(210, 14%, 89%);">
                                <p>Episodes: ${info["episodes"]}</p>
                            </div>
                            <div class="align_perfectly" style="border-bottom: 1.5px solid hsl(210, 14%, 89%);">
                                <p>Aired: ${info["aired"]}</p>
                            </div>
                            <div class="align_perfectly" style="border-bottom: 1.5px solid hsl(210, 14%, 89%);">
                                <p>Studios: ${info["studios"]}</p>
                            </div>
                            <div id='genres' class="align_perfectly">
                                <p>Genres: ${info["genres"]}</p>
                            </div>

                        </div>
                        `;
                        $('main').append(info_container);
                    }
                });
                

                
            }

        }
    }
}