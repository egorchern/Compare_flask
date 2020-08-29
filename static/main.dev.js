"use strict";

window.onpopstate = function (e) {
  $('main').empty();
  var data = e.state;
  var page_content = data["content"];
  console.log(page_content);
  $('main').append(page_content);
};

var contentCopy = $('main').html();
var chosenId = "";
var media_name = "";
var media_category = "";
var slide_animation_duration = "0.8s";

function activate(id) {
  var obj = $("#".concat(id));
  var objs = $(".media_containers");

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
      toggle_hover(id);
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
    $("#".concat(id)).addClass('hovers');
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
        var anime_name = "";
        var mal_id = "";
        $.ajax({
          type: "POST",
          url: "/get_name/".concat(category, "/").concat(text),
          async: false,
          success: function success(response) {
            anime_name = response["anime_name"];
            mal_id = response["mal_id"];
          }
        });
        media_name = anime_name;
        media_category = category;
        history.pushState({
          "content": contentCopy
        }, anime_name, "/".concat(category, "/").concat(anime_name.replace(/ /g, "_")));
        document.title = anime_name;
        anime_load_content(anime_name, mal_id);
      } else if (category === "manga") {
        var manga_name = "";
        var _mal_id = "";
        $.ajax({
          type: "POST",
          url: "/get_name/".concat(category, "/").concat(text),
          async: false,
          success: function success(response) {
            manga_name = response["manga_name"];
            _mal_id = response["mal_id"];
          }
        });
        media_name = manga_name;
        media_category = category;
        history.pushState({
          "content": contentCopy
        }, manga_name, "/".concat(category, "/").concat(manga_name.replace(/ /g, "_")));
        document.title = manga_name;
        manga_load_content(manga_name, _mal_id);
      } else if (category === "book") {
        $('main').prepend("\n                <div class=\"main_container\">\n                    <div class=\"slide_container\" style=\"transform:translateX(-100%)\" id=\"goodreads_slider\">\n                    \n                        <div class=\"item_flexbox\">\n                            <p style=\"font-size:calc(18px + 1.4vw)!important; text-align: center; width:100%\">Goodreads</p>\n                            <div class=\"review\">\n\n                                <div id=\"goodreads-widget\">\n\n                                    <iframe id=\"the_iframe\" src=\"https://www.goodreads.com/api/reviews_widget_iframe?did=75589&format=html&header_text=q&isbn=".concat(text, "&links=660&review_back=fff&stars=000&text=000\" frameborder=\"0\"></iframe>\n                                    \n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                "));
        bind_left_slide_animation("#goodreads_slider");
      }
    }
  }
}

function anime_load_content(anime_name, mal_id) {
  var info = {};
  $.ajax({
    type: "POST",
    url: "/anime/mal_info/".concat(mal_id),
    success: function success(response) {
      info = response;
      info["name"] = anime_name;
      var info_container = "\n            <div class=\"slide_container\" id=\"anime_info_slide_container\" style=\"transform:translateX(-100%);\">\n                <div id=\"anime_info_container\" >\n                    <div id=\"anime_image_container\" class=\"align_perfectly\">\n                        <img src=".concat(info["image_link"], " onError=\"this.onerror=null;this.src = '/static/onerror_avatar.png'\">\n\n                    </div>\n                    <div class=\"align_perfectly\" style=\"border-bottom: 2px solid hsl(210, 14%, 89%);\">\n                        <p>Name: ").concat(info["name"], "</p>\n\n                    </div>\n                    <div class=\"align_perfectly\" style=\"border-bottom: 2px solid hsl(210, 14%, 89%);\">\n                        <p>Episodes: ").concat(info["episodes"], "</p>\n                    </div>\n                    <div class=\"align_perfectly\" style=\"border-bottom: 2px solid hsl(210, 14%, 89%);\">\n                        <p>Aired: ").concat(info["aired"], "</p>\n                    </div>\n                    <div class=\"align_perfectly\" style=\"border-bottom: 2px solid hsl(210, 14%, 89%);\">\n                        <p>Studios: ").concat(info["studios"], "</p>\n                    </div>\n                    <div id='genres' class=\"align_perfectly\">\n                        <p>Genres: ").concat(info["genres"], "</p>\n                    </div>\n\n                </div>\n            </div>\n            ");
      $('main').prepend(info_container);
      bind_left_slide_animation('#anime_info_slide_container');
    }
  });
  $('main').append("<div id=\"main_container\">\n            \n    </div>");
  var mal = {
    "score": 0,
    "ranking": 0,
    "reviews": []
  };
  $.ajax({
    type: "POST",
    url: "/anime/mal_ranking/".concat(mal_id),
    success: function success(response) {
      mal["score"] = response["score"];
      mal["ranking"] = response["ranking"];
      $.ajax({
        type: "POST",
        url: "/anime/mal_reviews/".concat(mal_id),
        success: function success(response) {
          mal["reviews"] = JSON.parse(response);
          var mal_flexbox = "\n                    <div class=\"item_flexbox\" id=\"mal_slider\" style=\"transform:translateX(-100%)\">\n                        <div class=\"stats_container\">\n                            <div style=\"grid-column-start: 1; grid-column-end: 3; text-align: center;\">\n                                <p style=\"font-size:calc(18px + 1.4vw)!important\">Myanimelist</p>\n                            </div>\n                            <div>\n                                <p>Average rating:</p>\n                                <p>".concat(mal["score"], " / 10</p>\n                            </div>\n                            <div>\n                                <p>Ranked:</p>\n                                <p>#").concat(mal["ranking"], "</p>\n                            </div>\n            \n            \n                        </div>\n                                \n                                \n                    ");

          for (var i = 0; i < mal["reviews"].length; i += 1) {
            mal_flexbox += "\n                                    \n                        <div class=\"review\">\n\n                            <div class=\"pretext_info_grid\">\n                                <div class=\"pretext_info_grid-item\">\n                                    <div class=\"avatar_picture_container\">\n                                        <img src=".concat(mal["reviews"][i]["image_link"], " onError=\"this.onerror=null;this.src = '/static/onerror_avatar.png'\">\n                                    </div>\n                                    <div style=\"margin-top: 10%;\">\n                                        <p>Username: <span style=\"color:hsl(240, 100%, 45%)\"><strong>").concat(mal["reviews"][i]["username"], "</strong></span></p>\n                                        <p>Helpful <strong>(").concat(mal["reviews"][i]["helpful_points"], ")</strong></p>\n                                    </div>\n\n\n                                </div>\n\n                                <div class=\"pretext_info_grid-item\">\n                                    <table class=\"table table-bordered score-table\">\n                                        <thead>\n                                            <tr>\n                                                <th>Category</th>\n                                                <th>Score</th>\n                                            </tr>\n                                        </thead>\n                                        <tbody>\n                                            <tr>\n                                                <td>Overall</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][0], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Story</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][1], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Animation</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][2], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Sound</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][3], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Characters</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][4], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Enjoyment</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][5], "</td>\n                                            </tr>\n\n\n                                        </tbody>\n                                    </table>\n                                </div>\n                            </div>\n\n                            <pre class=\"review-text\">\n                            ").concat(mal["reviews"][i]["preview_text"], "<span onclick=\"expandText(this)\" class=\"spans\">Read more</span><span style=\"display:none\">").concat(mal["reviews"][i]["further_text"], "</span><span onclick=\"shrinkText(this)\" style=\"display:none\" class=\"spans\">Read less</span>\n                            </pre>\n\n                        </div>\n                                    \n                        ");
          }

          mal_flexbox += "\n                                </div>";
          $('#main_container').prepend(mal_flexbox);
          bind_left_slide_animation('#mal_slider');
        }
      });
    }
  });
  var anime_name_anime_planet = anime_name.replace("_", "-");
  var anime_planet = {
    "score": 0,
    "ranking": 0,
    "reviews": []
  };
  $.ajax({
    type: "POST",
    url: "/anime/anime_planet_ranking/".concat(anime_name_anime_planet),
    success: function success(response) {
      anime_planet["score"] = response["score"];
      anime_planet["ranking"] = response["ranking"];
      $.ajax({
        type: "POST",
        url: "/anime/anime_planet_reviews/".concat(anime_name_anime_planet),
        success: function success(response) {
          anime_planet["reviews"] = JSON.parse(response);
          var flexbox = "\n                    <div class=\"item_flexbox\" id=\"anime_planet_slider\" style=\"transform:translateX(100%)\">\n                        <div class=\"stats_container\">\n                            <div style=\"grid-column-start: 1; grid-column-end: 3; text-align: center;\">\n                                <p style=\"font-size:calc(18px + 1.4vw)!important\">Anime Planet</p>\n                            </div>\n                            <div>\n                                <p>Average rating:</p>\n                                <p>".concat(anime_planet["score"], " / 5</p>\n                            </div>\n                            <div>\n                                <p>Ranked:</p>\n                                <p>").concat(anime_planet["ranking"], "</p>\n                            </div>\n            \n            \n                        </div>\n                            \n                            \n                    ");

          for (var i = 0; i < anime_planet["reviews"].length; i += 1) {
            flexbox += "\n                                                \n                        <div class=\"review\">\n\n                            <div class=\"pretext_info_grid\">\n                                <div class=\"pretext_info_grid-item\">\n                                    <div class=\"avatar_picture_container\">\n                                        <img src=".concat(anime_planet["reviews"][i]["image_link"], " onError=\"this.onerror=null;this.src = '/static/onerror_avatar.png'\">\n                                    </div>\n                                    <div style=\"margin-top: 10%;\">\n                                        <p>Username: <span style=\"color:hsl(240, 100%, 45%)\"><strong>").concat(anime_planet["reviews"][i]["username"], "</strong></span></p>\n                                        <p>Helpful <strong>(").concat(anime_planet["reviews"][i]["helpful_points"], ")</strong></p>\n                                    </div>\n\n\n                                </div>\n\n                                <div class=\"pretext_info_grid-item\">\n                                    <table class=\"table table-bordered score-table\">\n                                        <thead>\n                                            <tr>\n                                                <th>Category</th>\n                                                <th>Score</th>\n                                            </tr>\n                                        </thead>\n                                        <tbody>\n                                            <tr>\n                                                <td>Overall</td>\n                                                <td>").concat(anime_planet["reviews"][i]["scores"][4], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Story</td>\n                                                <td>").concat(anime_planet["reviews"][i]["scores"][0], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Animation</td>\n                                                <td>").concat(anime_planet["reviews"][i]["scores"][1], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Sound</td>\n                                                <td>").concat(anime_planet["reviews"][i]["scores"][2], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Characters</td>\n                                                <td>").concat(anime_planet["reviews"][i]["scores"][3], "</td>\n                                            </tr>\n\n\n                                        </tbody>\n                                    </table>\n                                </div>\n                            </div>\n\n                            <pre class=\"review-text\">\n                            ").concat(anime_planet["reviews"][i]["preview_text"], "<span onclick=\"expandText(this)\" class=\"spans\">Read more</span><span style=\"display:none\">").concat(anime_planet["reviews"][i]["further_text"], "</span><span onclick=\"shrinkText(this)\" style=\"display:none\" class=\"spans\">Read less</span>\n                            </pre>\n\n                        </div>\n                                                \n                        ");
          }

          flexbox += "\n                    </div>";
          $('#main_container').prepend(flexbox);
          bind_left_slide_animation('#anime_planet_slider');
        }
      });
    }
  });
  var anilist = {
    "score": 0,
    "ranking": 0
  };
  $.ajax({
    type: "POST",
    url: "/anime/anilist/".concat(anime_name),
    success: function success(response) {
      anilist["score"] = response["score"];
      anilist["ranking"] = response["ranking"];
      var flexbox = "\n            <div class=\"item_flexbox\" id=\"anilist_slider\" style=\"transform:translateX(-100%)\">\n                        <div class=\"stats_container\">\n                            <div style=\"grid-column-start: 1; grid-column-end: 3; text-align: center;\">\n                                <p style=\"font-size:calc(18px + 1.4vw)!important\">Anilist</p>\n                            </div>\n                            <div>\n                                <p>Average rating:</p>\n                                <p>".concat(anilist["score"], " / 100</p>\n                            </div>\n                            <div>\n                                <p>Ranked:</p>\n                                <p>").concat(anilist["ranking"], "</p>\n                            </div>\n            \n            \n                        </div>\n\n            ");
      flexbox += "\n                    </div>";
      $('#main_container').append(flexbox);
      bind_left_slide_animation('#anilist_slider');
    }
  });
  var imbd = {
    "score": 0,
    "ranking": 0,
    "reviews": []
  };
  var imbd_anime_name = anime_name.replace("_", "+");
  $.ajax({
    type: "POST",
    url: "/anime/imbd_ranking/".concat(imbd_anime_name),
    success: function success(response) {
      imbd["score"] = response["score"];
      imbd["ranking"] = response["ranking"];
      $.ajax({
        type: "POST",
        url: "/anime/imbd_reviews/".concat(imbd_anime_name),
        success: function success(response) {
          imbd["reviews"] = JSON.parse(response);
          var flexbox = "\n                    <div class=\"item_flexbox\" id=\"imbd_slider\" style=\"transform:translateX(-100%)\">\n                        <div class=\"stats_container\">\n                            <div style=\"grid-column-start: 1; grid-column-end: 3; text-align: center;\">\n                                <p style=\"font-size:calc(18px + 1.4vw)!important\">IMBD</p>\n                            </div>\n                            <div>\n                                <p>Average rating:</p>\n                                <p>".concat(imbd["score"], " / 10</p>\n                            </div>\n                            <div>\n                                <p>Ranked:</p>\n                                <p>").concat(imbd["ranking"], "</p>\n                            </div>\n            \n            \n                        </div>\n                            \n                            \n                    ");

          for (var i = 0; i < imbd["reviews"].length; i += 1) {
            flexbox += "\n                                                \n                        <div class=\"review\">\n\n                            <div class=\"pretext_info_grid\">\n                                <div class=\"pretext_info_grid-item\">\n                                    <div class=\"avatar_picture_container\">\n                                        <img src=".concat(imbd["reviews"][i]["image_link"], " onError=\"this.onerror=null;this.src = '/static/onerror_avatar.png'\">\n                                    </div>\n                                    <div style=\"margin-top: 10%;\">\n                                        <p>Username: <span style=\"color:hsl(240, 100%, 45%)\"><strong>").concat(imbd["reviews"][i]["username"], "</strong></span></p>\n                                        <p>Helpful <strong>(").concat(imbd["reviews"][i]["helpful_points"], ")</strong></p>\n                                    </div>\n\n\n                                </div>\n\n                                <div class=\"pretext_info_grid-item\">\n                                    <table class=\"table table-bordered score-table\">\n                                        <thead>\n                                            <tr>\n                                                <th>Category</th>\n                                                <th>Score</th>\n                                            </tr>\n                                        </thead>\n                                        <tbody>\n                                            <tr>\n                                                <td>Overall</td>\n                                                <td>").concat(imbd["reviews"][i]["scores"][0], "</td>\n                                            </tr>\n                                            \n\n\n                                        </tbody>\n                                    </table>\n                                </div>\n                            </div>\n\n                            <pre class=\"review-text\">\n                            ").concat(imbd["reviews"][i]["preview_text"], "<span onclick=\"expandText(this)\" class=\"spans\">Read more</span><span style=\"display:none\">").concat(imbd["reviews"][i]["further_text"], "</span><span onclick=\"shrinkText(this)\" style=\"display:none\" class=\"spans\">Read less</span>\n                            </pre>\n\n                        </div>\n                                                \n                        ");
          }

          flexbox += "\n                    </div>";
          $('#main_container').append(flexbox);
          bind_left_slide_animation('#imbd_slider');
        }
      });
    }
  });
}

function manga_load_content(manga_name, mal_id) {
  var info = {};
  $.ajax({
    type: "POST",
    url: "/manga/mal_info/".concat(mal_id),
    success: function success(response) {
      info = response;
      info["name"] = manga_name;
      var info_container = "\n            <div class=\"slide_container\" id=\"anime_info_slide_container\" style=\"transform:translateX(-100%);\">\n                <div id=\"anime_info_container\" >\n                    <div id=\"anime_image_container\" class=\"align_perfectly\">\n                        <img src=".concat(info["image_link"], " onError=\"this.onerror=null;this.src = '/static/onerror_avatar.png'\">\n\n                    </div>\n                    <div class=\"align_perfectly\" style=\"border-bottom: 1.5px solid hsl(210, 14%, 89%);\">\n                        <p>Name: ").concat(info["name"], "</p>\n\n                    </div>\n                    <div class=\"align_perfectly\" style=\"border-bottom: 1.5px solid hsl(210, 14%, 89%);\">\n                        <p>Episodes: ").concat(info["episodes"], "</p>\n                    </div>\n                    <div class=\"align_perfectly\" style=\"border-bottom: 1.5px solid hsl(210, 14%, 89%);\">\n                        <p>Aired: ").concat(info["aired"], "</p>\n                    </div>\n                    <div class=\"align_perfectly\" style=\"border-bottom: 1.5px solid hsl(210, 14%, 89%);\">\n                        <p>Studios: ").concat(info["studios"], "</p>\n                    </div>\n                    <div id='genres' class=\"align_perfectly\">\n                        <p>Genres: ").concat(info["genres"], "</p>\n                    </div>\n\n                </div>\n            </div>\n            ");
      $('main').prepend(info_container);
      bind_left_slide_animation('#anime_info_slide_container');
    }
  });
  $('main').append("<div id=\"main_container\">\n            \n    </div>");
  var mal = {
    "score": 0,
    "ranking": 0,
    "reviews": []
  };
  $.ajax({
    type: "POST",
    url: "/manga/mal_ranking/".concat(mal_id),
    success: function success(response) {
      mal["score"] = response["score"];
      mal["ranking"] = response["ranking"];
      $.ajax({
        type: "POST",
        url: "/manga/mal_reviews/".concat(mal_id),
        success: function success(response) {
          mal["reviews"] = JSON.parse(response);
          var mal_flexbox = "\n                    <div class=\"item_flexbox\" id=\"mal_slider\" style=\"transform:translateX(-100%)\">\n                        <div class=\"stats_container\">\n                            <div style=\"grid-column-start: 1; grid-column-end: 3; text-align: center;\">\n                                <p style=\"font-size:calc(18px + 1.4vw)!important\">Myanimelist</p>\n                            </div>\n                            <div>\n                                <p>Average rating:</p>\n                                <p>".concat(mal["score"], " / 10</p>\n                            </div>\n                            <div>\n                                <p>Ranked:</p>\n                                <p>#").concat(mal["ranking"], "</p>\n                            </div>\n            \n            \n                        </div>\n                                \n                                \n                    ");

          for (var i = 0; i < mal["reviews"].length; i += 1) {
            mal_flexbox += "\n                                    \n                        <div class=\"review\">\n\n                            <div class=\"pretext_info_grid\">\n                                <div class=\"pretext_info_grid-item\">\n                                    <div class=\"avatar_picture_container\">\n                                        <img src=".concat(mal["reviews"][i]["image_link"], " onError=\"this.onerror=null;this.src = '/static/onerror_avatar.png'\">\n                                    </div>\n                                    <div style=\"margin-top: 10%;\">\n                                        <p>Username: <span style=\"color:hsl(240, 100%, 45%)\"><strong>").concat(mal["reviews"][i]["username"], "</strong></span></p>\n                                        <p>Helpful <strong>(").concat(mal["reviews"][i]["helpful_points"], ")</strong></p>\n                                    </div>\n\n\n                                </div>\n\n                                <div class=\"pretext_info_grid-item\">\n                                    <table class=\"table table-bordered score-table\">\n                                        <thead>\n                                            <tr>\n                                                <th>Category</th>\n                                                <th>Score</th>\n                                            </tr>\n                                        </thead>\n                                        <tbody>\n                                            <tr>\n                                                <td>Overall</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][0], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Story</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][1], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Art</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][2], "</td>\n                                            </tr>\n                                            \n                                            <tr>\n                                                <td>Characters</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][3], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Enjoyment</td>\n                                                <td>").concat(mal["reviews"][i]["scores"][4], "</td>\n                                            </tr>\n\n\n                                        </tbody>\n                                    </table>\n                                </div>\n                            </div>\n\n                            <pre class=\"review-text\">\n                            ").concat(mal["reviews"][i]["preview_text"], "<span onclick=\"expandText(this)\" class=\"spans\">Read more</span><span style=\"display:none\">").concat(mal["reviews"][i]["further_text"], "</span><span onclick=\"shrinkText(this)\" style=\"display:none\" class=\"spans\">Read less</span>\n                            </pre>\n\n                        </div>\n                                    \n                        ");
          }

          mal_flexbox += "\n                                </div>";
          $('#main_container').prepend(mal_flexbox);
          bind_left_slide_animation('#mal_slider');
        }
      });
    }
  });
  var manga_name_anime_planet = manga_name.replace("_", "-");
  var anime_planet = {
    "score": 0,
    "ranking": 0,
    "reviews": []
  };
  $.ajax({
    type: "POST",
    url: "/manga/anime_planet_ranking/".concat(manga_name_anime_planet),
    success: function success(response) {
      anime_planet["score"] = response["score"];
      anime_planet["ranking"] = response["ranking"];
      $.ajax({
        type: "POST",
        url: "/manga/anime_planet_reviews/".concat(manga_name_anime_planet),
        success: function success(response) {
          anime_planet["reviews"] = JSON.parse(response);
          var flexbox = "\n                    <div class=\"item_flexbox\" id=\"anime_planet_slider\" style=\"transform:translateX(100%)\">\n                        <div class=\"stats_container\">\n                            <div style=\"grid-column-start: 1; grid-column-end: 3; text-align: center;\">\n                                <p style=\"font-size:calc(18px + 1.4vw)!important\">Anime Planet</p>\n                            </div>\n                            <div>\n                                <p>Average rating:</p>\n                                <p>".concat(anime_planet["score"], " / 5</p>\n                            </div>\n                            <div>\n                                <p>Ranked:</p>\n                                <p>").concat(anime_planet["ranking"], "</p>\n                            </div>\n            \n            \n                        </div>\n                            \n                            \n                    ");

          for (var i = 0; i < anime_planet["reviews"].length; i += 1) {
            flexbox += "\n                                                \n                        <div class=\"review\">\n\n                            <div class=\"pretext_info_grid\">\n                                <div class=\"pretext_info_grid-item\">\n                                    <div class=\"avatar_picture_container\">\n                                        <img src=".concat(anime_planet["reviews"][i]["image_link"], " onError=\"this.onerror=null;this.src = '/static/onerror_avatar.png'\">\n                                    </div>\n                                    <div style=\"margin-top: 10%;\">\n                                        <p>Username: <span style=\"color:hsl(240, 100%, 45%)\"><strong>").concat(anime_planet["reviews"][i]["username"], "</strong></span></p>\n                                        <p>Helpful <strong>(").concat(anime_planet["reviews"][i]["helpful_points"], ")</strong></p>\n                                    </div>\n\n\n                                </div>\n\n                                <div class=\"pretext_info_grid-item\">\n                                    <table class=\"table table-bordered score-table\">\n                                        <thead>\n                                            <tr>\n                                                <th>Category</th>\n                                                <th>Score</th>\n                                            </tr>\n                                        </thead>\n                                        <tbody>\n                                            <tr>\n                                                <td>Overall</td>\n                                                <td>").concat(anime_planet["reviews"][i]["scores"][3], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Story</td>\n                                                <td>").concat(anime_planet["reviews"][i]["scores"][0], "</td>\n                                            </tr>\n                                            <tr>\n                                                <td>Art</td>\n                                                <td>").concat(anime_planet["reviews"][i]["scores"][1], "</td>\n                                            </tr>\n                                            \n                                            <tr>\n                                                <td>Characters</td>\n                                                <td>").concat(anime_planet["reviews"][i]["scores"][2], "</td>\n                                            </tr>\n\n\n                                        </tbody>\n                                    </table>\n                                </div>\n                            </div>\n\n                            <pre class=\"review-text\">\n                            ").concat(anime_planet["reviews"][i]["preview_text"], "<span onclick=\"expandText(this)\" class=\"spans\">Read more</span><span style=\"display:none\">").concat(anime_planet["reviews"][i]["further_text"], "</span><span onclick=\"shrinkText(this)\" style=\"display:none\" class=\"spans\">Read less</span>\n                            </pre>\n\n                        </div>\n                                                \n                        ");
          }

          flexbox += "\n                    </div>";
          $('#main_container').prepend(flexbox);
          bind_left_slide_animation('#anime_planet_slider');
        }
      });
    }
  });
  var anilist = {
    "score": 0,
    "ranking": 0
  };
  $.ajax({
    type: "POST",
    url: "/manga/anilist/".concat(manga_name),
    success: function success(response) {
      anilist["score"] = response["score"];
      anilist["ranking"] = response["ranking"];
      var flexbox = "\n            <div class=\"item_flexbox\" id=\"anilist_slider\" style=\"transform:translateX(-100%)\">\n                        <div class=\"stats_container\">\n                            <div style=\"grid-column-start: 1; grid-column-end: 3; text-align: center;\">\n                                <p style=\"font-size:calc(18px + 1.4vw)!important\">Anilist</p>\n                            </div>\n                            <div>\n                                <p>Average rating:</p>\n                                <p>".concat(anilist["score"], " / 100</p>\n                            </div>\n                            <div>\n                                <p>Ranked:</p>\n                                <p>").concat(anilist["ranking"], "</p>\n                            </div>\n            \n            \n                        </div>\n\n            ");
      flexbox += "\n                    </div>";
      $('#main_container').append(flexbox);
      bind_left_slide_animation('#anilist_slider');
    }
  });
  var manganelo = {
    "score": 0,
    "ranking": 0
  };
  $.ajax({
    type: "POST",
    url: "/manga/manganelo/".concat(manga_name),
    success: function success(response) {
      manganelo["score"] = response["score"];
      manganelo["ranking"] = response["ranking"];
      var flexbox = "\n            <div class=\"item_flexbox\" id=\"manganelo_slider\" style=\"transform:translateX(-100%)\">\n                        <div class=\"stats_container\">\n                            <div style=\"grid-column-start: 1; grid-column-end: 3; text-align: center;\">\n                                <p style=\"font-size:calc(18px + 1.4vw)!important\">Manganelo</p>\n                            </div>\n                            <div>\n                                <p>Average rating:</p>\n                                <p>".concat(manganelo["score"], " / 5</p>\n                            </div>\n                            <div>\n                                <p>Ranked:</p>\n                                <p>").concat(manganelo["ranking"], "</p>\n                            </div>\n            \n            \n                        </div>\n\n            ");
      flexbox += "\n                    </div>";
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
    history.replaceState({
      "content": contentCopy
    }, media_name, "/".concat(media_category, "/").concat(media_name.replace(/ /g, "_")));
  }, 50);
}