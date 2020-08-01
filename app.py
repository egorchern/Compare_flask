import myanimelist_methods;
from flask import Flask, render_template, request;
import anime_planet_methods;
import re;
import os;


class myanimelist:
    def __init__(self, reviews_list, average_rating, ranking):
        self.reviews_list = reviews_list;
        self.average_rating = average_rating;
        self.ranking = ranking;


class animePlanet:
    def __init__(self, reviews_list, average_rating, ranking):
        self.reviews_list = reviews_list;
        self.average_rating = average_rating;
        self.ranking = ranking;




app = Flask(__name__);
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


@app.route("/")
def index():
    return render_template("index.html");


@app.route("/anime", methods=["POST"])
def anime():
    #name = request.args["name"];
    #print(name);

    anime_name = request.form["media_name"];
    #anime_name = name;
    def mal():
        link = myanimelist_methods.get_link(anime_name);
        reviews_list = myanimelist_methods.get_reviews(link);
        average_rating, ranking = myanimelist_methods.get_score_and_ranking(link);
        mal = myanimelist(reviews_list, average_rating, ranking);
        return mal;

    def anime_planet():
        link = anime_planet_methods.get_link(anime_name);
        reviews_list = anime_planet_methods.get_reviews(link);
        average_rating, ranking = anime_planet_methods.get_score_and_ranking(link);
        pl = animePlanet(reviews_list, average_rating, ranking);
        return pl;

    info = myanimelist_methods.get_info(myanimelist_methods.get_link(anime_name))
    info.name = anime_planet_methods.get_name(anime_planet_methods.get_link(anime_name));
    mal = mal();
    pl = anime_planet();

    return render_template("query_results.html", mal=mal, anime_planet=pl, info=info);

@app.route("/manga", methods=["POST"])
def manga():
    pass;
