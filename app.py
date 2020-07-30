import myanimelist_methods;
from flask import Flask, render_template;
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
    anime_name = "One piece";
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



    return render_template("index.html", mal=mal, anime_planet=pl, info=info);




