window.onpopstate = e =>{
    $('main').empty();
    let data = e.state;
    let page_content = data["content"];
    console.log(page_content);
    $('main').append(page_content);
    

};
var contentCopy = $('main').html();
var chosenId = "";
var media_name = "";
var media_category = "";
var slide_animation_duration = "0.8s";
function determine_if_skipped(){
    let path = location.pathname;
    if (path != "/"){
        let category, name;
        let temp = path.split("/");
        category = temp[1];
        name = temp[2];
        console.log(name, category);
        $("#media_name").val(name);
        if(category === "anime" || category === "manga" || category === "book"){
            
            activate(category);
            process_search_submit();
        }
        else{
            alert("Invalid category in the URL");
        }
    }
}

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

    if (chosenId === "") {
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
        text = text.replace(" ", "_");

        if (text === "") {
            alert("Please enter a name of anime/manga/book you want to search");
        } else {
            
            
            $('main').empty();
            var category = chosenId;
            
            
            if (category === "anime") {
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
                media_name = anime_name;
                media_category = category;
                history.pushState({"content":contentCopy}, anime_name, `/${category}/${anime_name.replace(/ /g,"_")}`)
                document.title = anime_name;
                anime_load_content(anime_name, mal_id);

            } else if (category === "manga") {
                let manga_name = "";
                let mal_id = "";
                $.ajax({
                    type: "POST",
                    url: `/get_name/${category}/${text}`,
                    async: false,
                    success: function (response) {

                        manga_name = response["manga_name"];

                        mal_id = response["mal_id"];
                    }
                });
                media_name = manga_name;
                media_category = category;
                history.pushState({"content":contentCopy}, manga_name, `/${category}/${manga_name.replace(/ /g,"_")}`)
                document.title = manga_name;
                manga_load_content(manga_name, mal_id);

            } else if (category === "book") {
                $('main').prepend(`
                <div class="main_container">
                    <div class="slide_container" style="transform:translateX(-100%)" id="goodreads_slider">
                    
                        <div class="item_flexbox">
                            <p style="font-size:calc(18px + 1.4vw)!important; text-align: center; width:100%">Goodreads</p>
                            <div class="review">

                                <div id="goodreads-widget">

                                    <iframe id="the_iframe" src="https://www.goodreads.com/api/reviews_widget_iframe?did=75589&format=html&header_text=q&isbn=${text}&links=660&review_back=fff&stars=000&text=000" frameborder="0"></iframe>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `);
                bind_left_slide_animation("#goodreads_slider");
            }


        }
    }
}

function anime_load_content(anime_name, mal_id) {
    let info = {};
    $.ajax({
        type: "POST",

        url: `/anime/mal_info/${mal_id}`,
        success: function (response) {

            info = response;
            info["name"] = anime_name;
            let info_container =
                `
            <div class="slide_container" id="anime_info_slide_container" style="transform:translateX(-100%);">
                <div id="anime_info_container" >
                    <div id="anime_image_container" class="align_perfectly">
                        <img src=${info["image_link"]} onError="this.onerror=null;this.src = '/static/onerror_avatar.png'">

                    </div>
                    <div class="align_perfectly" style="border-bottom: 2px solid hsl(210, 14%, 89%);">
                        <p>Name: ${info["name"]}</p>

                    </div>
                    <div class="align_perfectly" style="border-bottom: 2px solid hsl(210, 14%, 89%);">
                        <p>Episodes: ${info["episodes"]}</p>
                    </div>
                    <div class="align_perfectly" style="border-bottom: 2px solid hsl(210, 14%, 89%);">
                        <p>Aired: ${info["aired"]}</p>
                    </div>
                    <div class="align_perfectly" style="border-bottom: 2px solid hsl(210, 14%, 89%);">
                        <p>Studios: ${info["studios"]}</p>
                    </div>
                    <div id='genres' class="align_perfectly">
                        <p>Genres: ${info["genres"]}</p>
                    </div>

                </div>
            </div>
            `;
            $('main').prepend(info_container);
            bind_left_slide_animation('#anime_info_slide_container');
        }
    });
    $('main').append(`<div id="main_container">
            
    </div>`);
    let mal = {
        "score": 0,
        "ranking": 0,
        "reviews": []
    };
    $.ajax({
        type: "POST",
        url: `/anime/mal_ranking/${mal_id}`,

        success: function (response) {
            mal["score"] = response["score"];
            mal["ranking"] = response["ranking"];

            $.ajax({
                type: "POST",
                url: `/anime/mal_reviews/${mal_id}`,

                success: function (response) {
                    mal["reviews"] = JSON.parse(response);
                    let mal_flexbox =
                        `
                    <div class="item_flexbox" id="mal_slider" style="transform:translateX(-100%)">
                        <div class="stats_container">
                            <div style="grid-column-start: 1; grid-column-end: 3; text-align: center;">
                                <p style="font-size:calc(18px + 1.4vw)!important">Myanimelist</p>
                            </div>
                            <div>
                                <p>Average rating:</p>
                                <p>${mal["score"]} / 10</p>
                            </div>
                            <div>
                                <p>Ranked:</p>
                                <p>#${mal["ranking"]}</p>
                            </div>
            
            
                        </div>
                                
                                
                    `;
                    for (let i = 0; i < mal["reviews"].length; i += 1) {
                        mal_flexbox += `
                                    
                        <div class="review">

                            <div class="pretext_info_grid">
                                <div class="pretext_info_grid-item">
                                    <div class="avatar_picture_container">
                                        <img src=${mal["reviews"][i]["image_link"]} onError="this.onerror=null;this.src = '/static/onerror_avatar.png'">
                                    </div>
                                    <div style="margin-top: 10%;">
                                        <p>Username: <span style="color:hsl(240, 100%, 45%)"><strong>${mal["reviews"][i]["username"]}</strong></span></p>
                                        <p>Helpful <strong>(${mal["reviews"][i]["helpful_points"]})</strong></p>
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
                                                <td>${mal["reviews"][i]["scores"][0]}</td>
                                            </tr>
                                            <tr>
                                                <td>Story</td>
                                                <td>${mal["reviews"][i]["scores"][1]}</td>
                                            </tr>
                                            <tr>
                                                <td>Animation</td>
                                                <td>${mal["reviews"][i]["scores"][2]}</td>
                                            </tr>
                                            <tr>
                                                <td>Sound</td>
                                                <td>${mal["reviews"][i]["scores"][3]}</td>
                                            </tr>
                                            <tr>
                                                <td>Characters</td>
                                                <td>${mal["reviews"][i]["scores"][4]}</td>
                                            </tr>
                                            <tr>
                                                <td>Enjoyment</td>
                                                <td>${mal["reviews"][i]["scores"][5]}</td>
                                            </tr>


                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <pre class="review-text">
                            ${mal["reviews"][i]["preview_text"]}<span onclick="expandText(this)" class="spans">Read more</span><span style="display:none">${mal["reviews"][i]["further_text"]}</span><span onclick="shrinkText(this)" style="display:none" class="spans">Read less</span>
                            </pre>

                        </div>
                                    
                        `
                    }
                    mal_flexbox += `
                                </div>`;


                    $('#main_container').prepend(mal_flexbox);
                    bind_left_slide_animation('#mal_slider');
                    

                }
            });

        }
    });
    let anime_name_anime_planet = anime_name.replace("_", "-");
    let anime_planet = {
        "score": 0,
        "ranking": 0,
        "reviews": []
    };
    $.ajax({
        type: "POST",
        url: `/anime/anime_planet_ranking/${anime_name_anime_planet}`,

        success: function (response) {
            anime_planet["score"] = response["score"];
            anime_planet["ranking"] = response["ranking"];
            $.ajax({
                type: "POST",
                url: `/anime/anime_planet_reviews/${anime_name_anime_planet}`,

                success: function (response) {
                    anime_planet["reviews"] = JSON.parse(response);
                    let flexbox =
                        `
                    <div class="item_flexbox" id="anime_planet_slider" style="transform:translateX(100%)">
                        <div class="stats_container">
                            <div style="grid-column-start: 1; grid-column-end: 3; text-align: center;">
                                <p style="font-size:calc(18px + 1.4vw)!important">Anime Planet</p>
                            </div>
                            <div>
                                <p>Average rating:</p>
                                <p>${anime_planet["score"]} / 5</p>
                            </div>
                            <div>
                                <p>Ranked:</p>
                                <p>${anime_planet["ranking"]}</p>
                            </div>
            
            
                        </div>
                            
                            
                    `;
                    for (let i = 0; i < anime_planet["reviews"].length; i += 1) {
                        flexbox += `
                                                
                        <div class="review">

                            <div class="pretext_info_grid">
                                <div class="pretext_info_grid-item">
                                    <div class="avatar_picture_container">
                                        <img src=${anime_planet["reviews"][i]["image_link"]} onError="this.onerror=null;this.src = '/static/onerror_avatar.png'">
                                    </div>
                                    <div style="margin-top: 10%;">
                                        <p>Username: <span style="color:hsl(240, 100%, 45%)"><strong>${anime_planet["reviews"][i]["username"]}</strong></span></p>
                                        <p>Helpful <strong>(${anime_planet["reviews"][i]["helpful_points"]})</strong></p>
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
                                                <td>${anime_planet["reviews"][i]["scores"][4]}</td>
                                            </tr>
                                            <tr>
                                                <td>Story</td>
                                                <td>${anime_planet["reviews"][i]["scores"][0]}</td>
                                            </tr>
                                            <tr>
                                                <td>Animation</td>
                                                <td>${anime_planet["reviews"][i]["scores"][1]}</td>
                                            </tr>
                                            <tr>
                                                <td>Sound</td>
                                                <td>${anime_planet["reviews"][i]["scores"][2]}</td>
                                            </tr>
                                            <tr>
                                                <td>Characters</td>
                                                <td>${anime_planet["reviews"][i]["scores"][3]}</td>
                                            </tr>


                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <pre class="review-text">
                            ${anime_planet["reviews"][i]["preview_text"]}<span onclick="expandText(this)" class="spans">Read more</span><span style="display:none">${anime_planet["reviews"][i]["further_text"]}</span><span onclick="shrinkText(this)" style="display:none" class="spans">Read less</span>
                            </pre>

                        </div>
                                                
                        `
                    }
                    flexbox += `
                    </div>`;

                    $('#main_container').prepend(flexbox);

                    bind_left_slide_animation('#anime_planet_slider');
                    


                }
            });

        }
    });
    let anilist = {
        "score": 0,
        "ranking": 0
    };
    $.ajax({
        type: "POST",
        url: `/anime/anilist/${anime_name}`,

        success: function (response) {
            anilist["score"] = response["score"];
            anilist["ranking"] = response["ranking"];
            let flexbox = `
            <div class="item_flexbox" id="anilist_slider" style="transform:translateX(-100%)">
                        <div class="stats_container">
                            <div style="grid-column-start: 1; grid-column-end: 3; text-align: center;">
                                <p style="font-size:calc(18px + 1.4vw)!important">Anilist</p>
                            </div>
                            <div>
                                <p>Average rating:</p>
                                <p>${anilist["score"]} / 100</p>
                            </div>
                            <div>
                                <p>Ranked:</p>
                                <p>${anilist["ranking"]}</p>
                            </div>
            
            
                        </div>

            `
            flexbox += `
                    </div>`;
            $('#main_container').append(flexbox);

            bind_left_slide_animation('#anilist_slider');
            

        }
    });
    let imbd = {
        "score": 0,
        "ranking": 0,
        "reviews": []
    };
    let imbd_anime_name = anime_name.replace("_", "+");
    $.ajax({
        type: "POST",
        url: `/anime/imbd_ranking/${imbd_anime_name}`,

        success: function (response) {
            imbd["score"] = response["score"];
            imbd["ranking"] = response["ranking"];
            $.ajax({
                type: "POST",
                url: `/anime/imbd_reviews/${imbd_anime_name}`,

                success: function (response) {
                    imbd["reviews"] = JSON.parse(response);
                    let flexbox =
                        `
                    <div class="item_flexbox" id="imbd_slider" style="transform:translateX(-100%)">
                        <div class="stats_container">
                            <div style="grid-column-start: 1; grid-column-end: 3; text-align: center;">
                                <p style="font-size:calc(18px + 1.4vw)!important">IMBD</p>
                            </div>
                            <div>
                                <p>Average rating:</p>
                                <p>${imbd["score"]} / 10</p>
                            </div>
                            <div>
                                <p>Ranked:</p>
                                <p>${imbd["ranking"]}</p>
                            </div>
            
            
                        </div>
                            
                            
                    `;
                    for (let i = 0; i < imbd["reviews"].length; i += 1) {
                        flexbox += `
                                                
                        <div class="review">

                            <div class="pretext_info_grid">
                                <div class="pretext_info_grid-item">
                                    <div class="avatar_picture_container">
                                        <img src=${imbd["reviews"][i]["image_link"]} onError="this.onerror=null;this.src = '/static/onerror_avatar.png'">
                                    </div>
                                    <div style="margin-top: 10%;">
                                        <p>Username: <span style="color:hsl(240, 100%, 45%)"><strong>${imbd["reviews"][i]["username"]}</strong></span></p>
                                        <p>Helpful <strong>(${imbd["reviews"][i]["helpful_points"]})</strong></p>
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
                                                <td>${imbd["reviews"][i]["scores"][0]}</td>
                                            </tr>
                                            


                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <pre class="review-text">
                            ${imbd["reviews"][i]["preview_text"]}<span onclick="expandText(this)" class="spans">Read more</span><span style="display:none">${imbd["reviews"][i]["further_text"]}</span><span onclick="shrinkText(this)" style="display:none" class="spans">Read less</span>
                            </pre>

                        </div>
                                                
                        `
                    }
                    flexbox += `
                    </div>`;

                    $('#main_container').append(flexbox);

                    bind_left_slide_animation('#imbd_slider');
                    


                }
            });

        }
    });

}

function manga_load_content(manga_name, mal_id) {
    let info = {};
    $.ajax({
        type: "POST",

        url: `/manga/mal_info/${mal_id}`,
        success: function (response) {

            info = response;
            info["name"] = manga_name;
            let info_container =
                `
            <div class="slide_container" id="anime_info_slide_container" style="transform:translateX(-100%);">
                <div id="anime_info_container" >
                    <div id="anime_image_container" class="align_perfectly">
                        <img src=${info["image_link"]} onError="this.onerror=null;this.src = '/static/onerror_avatar.png'">

                    </div>
                    <div class="align_perfectly" style="border-bottom: 1.5px solid hsl(210, 14%, 89%);">
                        <p>Name: ${info["name"]}</p>

                    </div>
                    <div class="align_perfectly" style="border-bottom: 1.5px solid hsl(210, 14%, 89%);">
                        <p>Chapters: ${info["episodes"]}</p>
                    </div>
                    <div class="align_perfectly" style="border-bottom: 1.5px solid hsl(210, 14%, 89%);">
                        <p>Released: ${info["aired"]}</p>
                    </div>
                    <div class="align_perfectly" style="border-bottom: 1.5px solid hsl(210, 14%, 89%);">
                        <p>Mangakas: ${info["studios"]}</p>
                    </div>
                    <div id='genres' class="align_perfectly">
                        <p>Genres: ${info["genres"]}</p>
                    </div>

                </div>
            </div>
            `;
            $('main').prepend(info_container);
            bind_left_slide_animation('#anime_info_slide_container');
        }
    });
    $('main').append(`<div id="main_container">
            
    </div>`);
    let mal = {
        "score": 0,
        "ranking": 0,
        "reviews": []
    };
    $.ajax({
        type: "POST",
        url: `/manga/mal_ranking/${mal_id}`,

        success: function (response) {
            mal["score"] = response["score"];
            mal["ranking"] = response["ranking"];

            $.ajax({
                type: "POST",
                url: `/manga/mal_reviews/${mal_id}`,

                success: function (response) {
                    mal["reviews"] = JSON.parse(response);
                    let mal_flexbox =
                        `
                    <div class="item_flexbox" id="mal_slider" style="transform:translateX(-100%)">
                        <div class="stats_container">
                            <div style="grid-column-start: 1; grid-column-end: 3; text-align: center;">
                                <p style="font-size:calc(18px + 1.4vw)!important">Myanimelist</p>
                            </div>
                            <div>
                                <p>Average rating:</p>
                                <p>${mal["score"]} / 10</p>
                            </div>
                            <div>
                                <p>Ranked:</p>
                                <p>#${mal["ranking"]}</p>
                            </div>
            
            
                        </div>
                                
                                
                    `;
                    for (let i = 0; i < mal["reviews"].length; i += 1) {
                        mal_flexbox += `
                                    
                        <div class="review">

                            <div class="pretext_info_grid">
                                <div class="pretext_info_grid-item">
                                    <div class="avatar_picture_container">
                                        <img src=${mal["reviews"][i]["image_link"]} onError="this.onerror=null;this.src = '/static/onerror_avatar.png'">
                                    </div>
                                    <div style="margin-top: 10%;">
                                        <p>Username: <span style="color:hsl(240, 100%, 45%)"><strong>${mal["reviews"][i]["username"]}</strong></span></p>
                                        <p>Helpful <strong>(${mal["reviews"][i]["helpful_points"]})</strong></p>
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
                                                <td>${mal["reviews"][i]["scores"][0]}</td>
                                            </tr>
                                            <tr>
                                                <td>Story</td>
                                                <td>${mal["reviews"][i]["scores"][1]}</td>
                                            </tr>
                                            <tr>
                                                <td>Art</td>
                                                <td>${mal["reviews"][i]["scores"][2]}</td>
                                            </tr>
                                            
                                            <tr>
                                                <td>Characters</td>
                                                <td>${mal["reviews"][i]["scores"][3]}</td>
                                            </tr>
                                            <tr>
                                                <td>Enjoyment</td>
                                                <td>${mal["reviews"][i]["scores"][4]}</td>
                                            </tr>


                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <pre class="review-text">
                            ${mal["reviews"][i]["preview_text"]}<span onclick="expandText(this)" class="spans">Read more</span><span style="display:none">${mal["reviews"][i]["further_text"]}</span><span onclick="shrinkText(this)" style="display:none" class="spans">Read less</span>
                            </pre>

                        </div>
                                    
                        `
                    }
                    mal_flexbox += `
                                </div>`;


                    $('#main_container').prepend(mal_flexbox);
                    bind_left_slide_animation('#mal_slider');
                    

                }
            });

        }
    });
    let manga_name_anime_planet = manga_name.replace("_", "-");
    let anime_planet = {
        "score": 0,
        "ranking": 0,
        "reviews": []
    };
    $.ajax({
        type: "POST",
        url: `/manga/anime_planet_ranking/${manga_name_anime_planet}`,

        success: function (response) {
            anime_planet["score"] = response["score"];
            anime_planet["ranking"] = response["ranking"];
            $.ajax({
                type: "POST",
                url: `/manga/anime_planet_reviews/${manga_name_anime_planet}`,

                success: function (response) {
                    anime_planet["reviews"] = JSON.parse(response);
                    let flexbox =
                        `
                    <div class="item_flexbox" id="anime_planet_slider" style="transform:translateX(100%)">
                        <div class="stats_container">
                            <div style="grid-column-start: 1; grid-column-end: 3; text-align: center;">
                                <p style="font-size:calc(18px + 1.4vw)!important">Anime Planet</p>
                            </div>
                            <div>
                                <p>Average rating:</p>
                                <p>${anime_planet["score"]} / 5</p>
                            </div>
                            <div>
                                <p>Ranked:</p>
                                <p>${anime_planet["ranking"]}</p>
                            </div>
            
            
                        </div>
                            
                            
                    `;
                    for (let i = 0; i < anime_planet["reviews"].length; i += 1) {
                        flexbox += `
                                                
                        <div class="review">

                            <div class="pretext_info_grid">
                                <div class="pretext_info_grid-item">
                                    <div class="avatar_picture_container">
                                        <img src=${anime_planet["reviews"][i]["image_link"]} onError="this.onerror=null;this.src = '/static/onerror_avatar.png'">
                                    </div>
                                    <div style="margin-top: 10%;">
                                        <p>Username: <span style="color:hsl(240, 100%, 45%)"><strong>${anime_planet["reviews"][i]["username"]}</strong></span></p>
                                        <p>Helpful <strong>(${anime_planet["reviews"][i]["helpful_points"]})</strong></p>
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
                                                <td>${anime_planet["reviews"][i]["scores"][3]}</td>
                                            </tr>
                                            <tr>
                                                <td>Story</td>
                                                <td>${anime_planet["reviews"][i]["scores"][0]}</td>
                                            </tr>
                                            <tr>
                                                <td>Art</td>
                                                <td>${anime_planet["reviews"][i]["scores"][1]}</td>
                                            </tr>
                                            
                                            <tr>
                                                <td>Characters</td>
                                                <td>${anime_planet["reviews"][i]["scores"][2]}</td>
                                            </tr>


                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <pre class="review-text">
                            ${anime_planet["reviews"][i]["preview_text"]}<span onclick="expandText(this)" class="spans">Read more</span><span style="display:none">${anime_planet["reviews"][i]["further_text"]}</span><span onclick="shrinkText(this)" style="display:none" class="spans">Read less</span>
                            </pre>

                        </div>
                                                
                        `
                    }
                    flexbox += `
                    </div>`;

                    $('#main_container').prepend(flexbox);

                    bind_left_slide_animation('#anime_planet_slider');
                    


                }
            });

        }
    });
    let anilist = {
        "score": 0,
        "ranking": 0
    };
    $.ajax({
        type: "POST",
        url: `/manga/anilist/${manga_name}`,

        success: function (response) {
            anilist["score"] = response["score"];
            anilist["ranking"] = response["ranking"];
            let flexbox = `
            <div class="item_flexbox" id="anilist_slider" style="transform:translateX(-100%)">
                        <div class="stats_container">
                            <div style="grid-column-start: 1; grid-column-end: 3; text-align: center;">
                                <p style="font-size:calc(18px + 1.4vw)!important">Anilist</p>
                            </div>
                            <div>
                                <p>Average rating:</p>
                                <p>${anilist["score"]} / 100</p>
                            </div>
                            <div>
                                <p>Ranked:</p>
                                <p>${anilist["ranking"]}</p>
                            </div>
            
            
                        </div>

            `
            flexbox += `
                    </div>`;
            $('#main_container').append(flexbox);

            bind_left_slide_animation('#anilist_slider');
            

        }
    });
    let manganelo = {
        "score": 0,
        "ranking": 0
    };
    $.ajax({
        type: "POST",
        url: `/manga/manganelo/${manga_name}`,

        success: function (response) {
            manganelo["score"] = response["score"];
            manganelo["ranking"] = response["ranking"];
            let flexbox = `
            <div class="item_flexbox" id="manganelo_slider" style="transform:translateX(-100%)">
                        <div class="stats_container">
                            <div style="grid-column-start: 1; grid-column-end: 3; text-align: center;">
                                <p style="font-size:calc(18px + 1.4vw)!important">Manganelo</p>
                            </div>
                            <div>
                                <p>Average rating:</p>
                                <p>${manganelo["score"]} / 5</p>
                            </div>
                            <div>
                                <p>Ranked:</p>
                                <p>${manganelo["ranking"]}</p>
                            </div>
            
            
                        </div>

            `
            flexbox += `
                    </div>`;
            $('#main_container').append(flexbox);
            
            bind_left_slide_animation('#manganelo_slider');
            
        }
    });


}

function bind_left_slide_animation(selector) {
    setTimeout(function () {
        $(selector).css({
            "animation-name": "slide-in-from-left",
            "animation-duration": slide_animation_duration,
            "animation-fill-mode": "forwards",
            "animation-timing-function": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"

        });
        contentCopy = $('main').html();
        history.replaceState({"content":contentCopy}, media_name, `/${media_category}/${media_name.replace(/ /g,"_")}`)
    }, 50);
    
}

document.addEventListener("DOMContentLoaded", function(ev){
    determine_if_skipped();
})
