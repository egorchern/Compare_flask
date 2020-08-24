import myanimelist_methods;
import imbd_methods;
import manganelo_methods;
import anilist_methods;
from flask import Flask, render_template, request, redirect;

import anime_planet_methods;
from re import sub;



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


class imbd:
    def __init__(self, reviews_list, average_rating, ranking):
        self.reviews_list = reviews_list;
        self.average_rating = average_rating;
        self.ranking = ranking;


class manganelo:
    def __init__(self, average_rating, ranking):
        self.average_rating = average_rating;
        self.ranking = ranking;


class anilist:
    def __init__(self, average_rating, ranking):
        self.average_rating = average_rating;
        self.ranking = ranking;


app = Flask(__name__);

@app.route("/")
def index():
    return render_template("index.html");

@app.route("/get_name/anime/<name>", methods=["POST", "GET"])
def get_name(name):
    anime_name, mal_id = anilist_methods.anime.get_closest_english_name_and_mal_id(name);
    return {"anime_name":anime_name, "mal_id":mal_id};



@app.route("/book/<name>", methods=["POST", "GET"])
def book(name):
    isbn = name;

    return render_template("book_query_results.html", isbn=isbn);


if __name__ == "__main__":
    app.run(threaded=True);