import myanimelist_methods;
import imbd_methods;
import manganelo_methods;
import anilist_methods;
from flask import Flask, render_template, request, redirect;
import json;
import anime_planet_methods;
from re import sub;






app = Flask(__name__);

@app.route("/")
def index():
    return render_template("index.html");

@app.route("/get_name/anime/<name>", methods=["POST", "GET"])
def get_anime_name(name):
    anime_name, mal_id = anilist_methods.anime.get_closest_english_name_and_mal_id(name);
    return {"anime_name":anime_name, "mal_id":mal_id};

@app.route("/get_name/manga/<name>", methods=["POST", "GET"])
def get_manga_name(name):
    manga_name, mal_id = anilist_methods.manga.get_closest_english_name_and_mal_id(name);
    return {"manga_name":manga_name, "mal_id":mal_id};

@app.route("/anime/mal_info/<mal_id>", methods=["POST","GET"])
def get_anime_info(mal_id):
    
    mal_link = myanimelist_methods.anime.get_link(mal_id);
    info = myanimelist_methods.anime.get_info(mal_link);
    info_as_dict = vars(info);
    return info_as_dict;

@app.route("/manga/mal_info/<mal_id>", methods=["POST","GET"])
def get_manga_info(mal_id):
    
    mal_link = myanimelist_methods.manga.get_link(mal_id);
    info = myanimelist_methods.manga.get_info(mal_link);
    info_as_dict = vars(info);
    return info_as_dict;
    
@app.route("/anime/mal_reviews/<mal_id>", methods=["POST","GET"])
def get_anime_mal_reviews(mal_id):
    mal_link = myanimelist_methods.anime.get_link(mal_id);
    reviews = myanimelist_methods.anime.get_reviews(mal_link);
    
    for i in range(0, len(reviews)):
        reviews[i] = vars(reviews[i]);
    
    return json.dumps(reviews);

@app.route("/manga/mal_reviews/<mal_id>", methods=["POST","GET"])
def get_manga_mal_reviews(mal_id):
    mal_link = myanimelist_methods.manga.get_link(mal_id);
    reviews = myanimelist_methods.manga.get_reviews(mal_link);
    
    for i in range(0, len(reviews)):
        reviews[i] = vars(reviews[i]);
    
    return json.dumps(reviews);

@app.route("/anime/mal_ranking/<mal_id>", methods=["POST", "GET"])
def get_anime_mal_ranking(mal_id):
    mal_link = myanimelist_methods.anime.get_link(mal_id);
    score, ranking = myanimelist_methods.anime.get_score_and_ranking(mal_link);
    return {"score":score, "ranking": ranking};

@app.route("/manga/mal_ranking/<mal_id>", methods=["POST", "GET"])
def get_manga_mal_ranking(mal_id):
    mal_link = myanimelist_methods.manga.get_link(mal_id);
    score, ranking = myanimelist_methods.manga.get_score_and_ranking(mal_link);
    return {"score":score, "ranking": ranking};

@app.route("/anime/anime_planet_ranking/<anime_name>", methods=["POST", "GET"])
def get_anime_planet_ranking(anime_name):
    link = anime_planet_methods.anime.get_link(anime_name);
    score, ranking = anime_planet_methods.anime.get_score_and_ranking(link);
    return  {"score":score, "ranking": ranking};

@app.route("/manga/anime_planet_ranking/<manga_name>", methods=["POST", "GET"])
def get_manga_planet_ranking(manga_name):
    link = anime_planet_methods.manga.get_link(manga_name);
    score, ranking = anime_planet_methods.manga.get_score_and_ranking(link);
    return  {"score":score, "ranking": ranking}; 

@app.route("/anime/anime_planet_reviews/<anime_name>", methods=["POST", "GET"])
def get_anime_planet_reviews(anime_name):
    link = anime_planet_methods.anime.get_link(anime_name);
    reviews = anime_planet_methods.anime.get_reviews(link);
    for i in range(0, len(reviews)):
        reviews[i] = vars(reviews[i]);
    return json.dumps(reviews);

@app.route("/manga/anime_planet_reviews/<manga_name>", methods=["POST", "GET"])
def get_manga_planet_reviews(manga_name):
    link = anime_planet_methods.manga.get_link(manga_name);
    reviews = anime_planet_methods.manga.get_reviews(link);
    for i in range(0, len(reviews)):
        reviews[i] = vars(reviews[i]);
    return json.dumps(reviews);

@app.route("/anime/anilist/<anime_name>", methods=["POST", "GET"])
def get_anime_anilist_ranking(anime_name):
    score, ranking = anilist_methods.anime.get_score_and_ranking(anime_name);
    return  {"score":score, "ranking": ranking};

@app.route("/manga/anilist/<manga_name>", methods=["POST", "GET"])
def get_manga_anilist_ranking(manga_name):
    score, ranking = anilist_methods.manga.get_score_and_ranking(manga_name);
    return  {"score":score, "ranking": ranking}; 

@app.route("/manga/manganelo/<manga_name>", methods=["POST", "GET"])
def get_manga_manganelo_ranking(manga_name):
    link = manganelo_methods.manga.get_link(manga_name);
    score, ranking = manganelo_methods.manga.get_score_and_ranking(link);
    return  {"score":score, "ranking": ranking}; 

@app.route("/anime/imbd_ranking/<anime_name>", methods=["POST", "GET"])
def get_imbd_ranking(anime_name):
    link = imbd_methods.anime.get_link(anime_name);
    score, ranking = imbd_methods.anime.get_score_and_ranking(link);
    return  {"score":score, "ranking": ranking}; 

@app.route("/anime/imbd_reviews/<anime_name>", methods=["POST", "GET"])
def get_imbd_reviews(anime_name):
    link = imbd_methods.anime.get_link(anime_name);
    reviews = imbd_methods.anime.get_reviews(link);
    for i in range(0, len(reviews)):
        reviews[i] = vars(reviews[i]);
    return json.dumps(reviews);




if __name__ == "__main__":
    app.run(threaded=True);