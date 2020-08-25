var chosenId = "";
var slide_animation_duration = "0.8s";

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
                        <div class="slide_container" id="anime_info_slide_container" style="transform:translateX(-100%);">
                            <div id="anime_info_container" >
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
                        </div>
                        `;
                        $('main').append(info_container);
                        setTimeout(function(){
                            $('#anime_info_slide_container').css({
                                "animation-name":"slide-in-from-left",
                                "animation-duration":slide_animation_duration,
                                "animation-fill-mode":"forwards",
                                "animation-timing-function": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                            
                            });
                        }, 80);
                    }
                });
                
                let score_and_ranking = {};
                $.ajax({
                    type: "POST",
                    url: `/anime/mal_ranking/${mal_id}`,
                    
                    success: function (response) {
                        score_and_ranking = response;
                        let reviews = [];
                        $.ajax({
                            type: "POST",
                            url: `/anime/mal_reviews/${mal_id}`,
                           
                            success: function (response) {
                                reviews = JSON.parse(response);
                                let mal_flexbox =
                                `
                                <div class="item_flexbox" id="mal_slider" style="transform:translateX(-100%)">
                                    <div class="stats_container">
                                        <div style="grid-column-start: 1; grid-column-end: 3; text-align: center;">
                                            <p style="font-size:calc(18px + 1.4vw)!important">Myanimelist</p>
                                        </div>
                                        <div>
                                            <p>Average rating:</p>
                                            <p>${score_and_ranking["score"]} / 10</p>
                                        </div>
                                        <div>
                                            <p>Ranked:</p>
                                            <p>#${score_and_ranking["ranking"]}</p>
                                        </div>
                        
                        
                                    </div>
                                
                                
                                `;
                                for(let i = 0; i < reviews.length; i+= 1){
                                    mal_flexbox += `
                                    
                                    <div class="review">

                                        <div class="pretext_info_grid">
                                            <div class="pretext_info_grid-item">
                                                <div class="avatar_picture_container">
                                                    <img src=${reviews[i]["image_link"]} onError="this.onerror=null;this.src='{{url_for('static', filename = 'onerror_avatar.png' )}}';">
                                                </div>
                                                <div style="margin-top: 10%;">
                                                    <p>Username: <span style="color:hsl(240, 100%, 45%)"><strong>${reviews[i]["username"]}</strong></span></p>
                                                    <p>Helpful <strong>(${reviews[i]["helpful_points"]})</strong></p>
                                                </div>


                                            </div>

                                            <div class="pretext_info_grid-item">
                                                <table class="table table-bordered score-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Category</th>
                                                            <th>Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Overall</td>
                                                            <td>${reviews[i]["scores"][0]}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Story</td>
                                                            <td>${reviews[i]["scores"][1]}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Animation</td>
                                                            <td>${reviews[i]["scores"][2]}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Sound</td>
                                                            <td>${reviews[i]["scores"][3]}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Characters</td>
                                                            <td>${reviews[i]["scores"][4]}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Enjoyment</td>
                                                            <td>${reviews[i]["scores"][5]}</td>
                                                        </tr>


                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <pre class="review-text">
                                        ${reviews[i]["preview_text"]}<span onclick="expandText(this)" class="spans">Read more</span><span style="display:none">${reviews[i]["further_text"]}</span><span onclick="shrinkText(this)" style="display:none" class="spans">Read less</span>
                                        </pre>

                                    </div>
                                    
                                    `
                                }
                                mal_flexbox += `
                                </div>`;
                                $('main').append(`
                                <div class="main_container">
            
                                </div>
                                `);
                                $('.main_container').append(mal_flexbox);
                                setTimeout(function(){
                                    $('#mal_slider').css({
                                        "animation-name":"slide-in-from-left",
                                        "animation-duration":slide_animation_duration,
                                        "animation-fill-mode":"forwards",
                                        "animation-timing-function": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                    
                                    });
                                }, 80);
                            }
                        });
                    }
                });
                
                

                
            }

        }
    }
}