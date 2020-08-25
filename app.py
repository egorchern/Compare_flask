import myanimelist_methods;
import imbd_methods;
import manganelo_methods;
import anilist_methods;
from flask import Flask, render_template, request, redirect;
import json;
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

@app.route("/anime/mal_info/<mal_id>", methods=["POST","GET"])
def get_info(mal_id):
    
    mal_link = myanimelist_methods.anime.get_link(mal_id);
    info = myanimelist_methods.anime.get_info(mal_link);
    info_as_dict = vars(info);
    return info_as_dict;
    
@app.route("/anime/mal_reviews/<mal_id>", methods=["POST","GET"])
def get_mal_reviews(mal_id):
    mal_link = myanimelist_methods.anime.get_link(mal_id);
    reviews = myanimelist_methods.anime.get_reviews(mal_link);
    
    for i in range(0, len(reviews)):
        reviews[i] = vars(reviews[i]);
    
    return json.dumps(reviews);

@app.route("/anime/mal_ranking/<mal_id>", methods=["POST", "GET"])
def get_mal_ranking(mal_id):
    mal_link = myanimelist_methods.anime.get_link(mal_id);
    score, ranking = myanimelist_methods.anime.get_score_and_ranking(mal_link);
    return {"score":score, "ranking": ranking};
    
    

@app.route("/book/<name>", methods=["POST", "GET"])
def book(name):
    isbn = name;

    return render_template("book_query_results.html", isbn=isbn);


if __name__ == "__main__":
    app.run(threaded=True);