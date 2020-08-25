"use strict";

var chosenId = "";
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
        var info = {};
        $.ajax({
          type: "POST",
          url: "/anime/mal_info/".concat(mal_id),
          success: function success(response) {
            info = response;
            info["name"] = anime_name;
            var info_container = "\n                        <div class=\"slide_container\" id=\"anime_info_slide_container\" style=\"transform:translateX(-100%);\">\n                            <div id=\"anime_info_container\" >\n                                <div id=\"anime_image_container\" class=\"align_perfectly\">\n                                    <img src=".concat(info["image_link"], " onError=\"this.onerror=null;this.src='{{url_for('static', filename = 'onerror_avatar.png' )}}';\">\n\n                                </div>\n                                <div class=\"align_perfectly\" style=\"border-bottom: 1.5px solid hsl(210, 14%, 89%);\">\n                                    <p>Name: ").concat(info["name"], "</p>\n\n                                </div>\n                                <div class=\"align_perfectly\" style=\"border-bottom: 1.5px solid hsl(210, 14%, 89%);\">\n                                    <p>Episodes: ").concat(info["episodes"], "</p>\n                                </div>\n                                <div class=\"align_perfectly\" style=\"border-bottom: 1.5px solid hsl(210, 14%, 89%);\">\n                                    <p>Aired: ").concat(info["aired"], "</p>\n                                </div>\n                                <div class=\"align_perfectly\" style=\"border-bottom: 1.5px solid hsl(210, 14%, 89%);\">\n                                    <p>Studios: ").concat(info["studios"], "</p>\n                                </div>\n                                <div id='genres' class=\"align_perfectly\">\n                                    <p>Genres: ").concat(info["genres"], "</p>\n                                </div>\n\n                            </div>\n                        </div>\n                        ");
            $('main').append(info_container);
            setTimeout(function () {
              $('#anime_info_slide_container').css({
                "animation-name": "slide-in-from-left",
                "animation-duration": slide_animation_duration,
                "animation-fill-mode": "forwards",
                "animation-timing-function": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              });
            }, 80);
          }
        });
        var score_and_ranking = {};
        $.ajax({
          type: "POST",
          url: "/anime/mal_ranking/".concat(mal_id),
          success: function success(response) {
            score_and_ranking = response;
            var reviews = [];
            $.ajax({
              type: "POST",
              url: "/anime/mal_reviews/".concat(mal_id),
              success: function success(response) {
                reviews = JSON.parse(response);
                var mal_flexbox = "\n                                <div class=\"item_flexbox\" id=\"mal_slider\" style=\"transform:translateX(-100%)\">\n                                    <div class=\"stats_container\">\n                                        <div style=\"grid-column-start: 1; grid-column-end: 3; text-align: center;\">\n                                            <p style=\"font-size:calc(18px + 1.4vw)!important\">Myanimelist</p>\n                                        </div>\n                                        <div>\n                                            <p>Average rating:</p>\n                                            <p>".concat(score_and_ranking["score"], " / 10</p>\n                                        </div>\n                                        <div>\n                                            <p>Ranked:</p>\n                                            <p>#").concat(score_and_ranking["ranking"], "</p>\n                                        </div>\n                        \n                        \n                                    </div>\n                                \n                                \n                                ");

                for (var i = 0; i < reviews.length; i += 1) {
                  mal_flexbox += "\n                                    \n                                    <div class=\"review\">\n\n                                        <div class=\"pretext_info_grid\">\n                                            <div class=\"pretext_info_grid-item\">\n                                                <div class=\"avatar_picture_container\">\n                                                    <img src=".concat(reviews[i]["image_link"], " onError=\"this.onerror=null;this.src='{{url_for('static', filename = 'onerror_avatar.png' )}}';\">\n                                                </div>\n                                                <div style=\"margin-top: 10%;\">\n                                                    <p>Username: <span style=\"color:hsl(240, 100%, 45%)\"><strong>").concat(reviews[i]["username"], "</strong></span></p>\n                                                    <p>Helpful <strong>(").concat(reviews[i]["helpful_points"], ")</strong></p>\n                                                </div>\n\n\n                                            </div>\n\n                                            <div class=\"pretext_info_grid-item\">\n                                                <table class=\"table table-bordered score-table\">\n                                                    <thead>\n                                                        <tr>\n                                                            <th>Category</th>\n                                                            <th>Score</th>\n                                                        </tr>\n                                                    </thead>\n                                                    <tbody>\n                                                        <tr>\n                                                            <td>Overall</td>\n                                                            <td>").concat(reviews[i]["scores"][0], "</td>\n                                                        </tr>\n                                                        <tr>\n                                                            <td>Story</td>\n                                                            <td>").concat(reviews[i]["scores"][1], "</td>\n                                                        </tr>\n                                                        <tr>\n                                                            <td>Animation</td>\n                                                            <td>").concat(reviews[i]["scores"][2], "</td>\n                                                        </tr>\n                                                        <tr>\n                                                            <td>Sound</td>\n                                                            <td>").concat(reviews[i]["scores"][3], "</td>\n                                                        </tr>\n                                                        <tr>\n                                                            <td>Characters</td>\n                                                            <td>").concat(reviews[i]["scores"][4], "</td>\n                                                        </tr>\n                                                        <tr>\n                                                            <td>Enjoyment</td>\n                                                            <td>").concat(reviews[i]["scores"][5], "</td>\n                                                        </tr>\n\n\n                                                    </tbody>\n                                                </table>\n                                            </div>\n                                        </div>\n\n                                        <pre class=\"review-text\">\n                                        ").concat(reviews[i]["preview_text"], "<span onclick=\"expandText(this)\" class=\"spans\">Read more</span><span style=\"display:none\">").concat(reviews[i]["further_text"], "</span><span onclick=\"shrinkText(this)\" style=\"display:none\" class=\"spans\">Read less</span>\n                                        </pre>\n\n                                    </div>\n                                    \n                                    ");
                }

                mal_flexbox += "\n                                </div>";
                $('main').append("\n                                <div class=\"main_container\">\n            \n                                </div>\n                                ");
                $('.main_container').append(mal_flexbox);
                setTimeout(function () {
                  $('#mal_slider').css({
                    "animation-name": "slide-in-from-left",
                    "animation-duration": slide_animation_duration,
                    "animation-fill-mode": "forwards",
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