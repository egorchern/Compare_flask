import myanimelist_methods;
import imbd_methods;
import manganelo_methods;
import anilist_methods;
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
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


@app.route("/")
def index():
    return render_template("index.html");


@app.route("/anime", methods=["POST"])
def anime():



    anime_name = request.form["media_name"];

    def mal():
        link = myanimelist_methods.anime.get_link(anime_name);
        reviews_list = myanimelist_methods.anime.get_reviews(link);
        average_rating, ranking = myanimelist_methods.anime.get_score_and_ranking(link);
        mal = myanimelist(reviews_list, average_rating, ranking);
        return mal;

    def anime_planet():
        link = anime_planet_methods.anime.get_link(anime_name);
        reviews_list = anime_planet_methods.anime.get_reviews(link);
        average_rating, ranking = anime_planet_methods.anime.get_score_and_ranking(link);
        pl = animePlanet(reviews_list, average_rating, ranking);
        return pl;

    def imd():
        link = imbd_methods.anime.get_link(anime_name);
        reviews_list = imbd_methods.anime.get_reviews(link);
        average_rating, ranking = imbd_methods.anime.get_score_and_ranking(link);
        imb = imbd(reviews_list, average_rating, ranking);
        return imb;
    def anilis():
        average_rating, ranking = anilist_methods.anime.get_score_and_ranking(anime_name);
        anl = anilist(average_rating, ranking);
        return anl;

    info = myanimelist_methods.anime.get_info(myanimelist_methods.anime.get_link(anime_name))
    info.name = anime_planet_methods.anime.get_name(anime_planet_methods.anime.get_link(anime_name));
    mal = mal();
    pl = anime_planet();
    imb = imd();
    anl = anilis();

    return render_template("anime_query_results.html", mal=mal, anime_planet=pl, info=info, imbd=imb, anilist=anl);


@app.route("/manga", methods=["POST"])
def manga():
    manga_name = request.form["media_name"];

    def mal():
        link = myanimelist_methods.manga.get_link(manga_name);
        reviews_list = myanimelist_methods.manga.get_reviews(link);
        average_rating, ranking = myanimelist_methods.manga.get_score_and_ranking(link);
        mal = myanimelist(reviews_list, average_rating, ranking);
        return mal;

    def anime_planet():
        link = anime_planet_methods.manga.get_link(manga_name);
        reviews_list = anime_planet_methods.manga.get_reviews(link);
        average_rating, ranking = anime_planet_methods.manga.get_score_and_ranking(link);
        pl = animePlanet(reviews_list, average_rating, ranking);
        return pl;

    def manganel():
        link = manganelo_methods.manga.get_link(manga_name);
        average_rating, ranking = manganelo_methods.manga.get_score_and_ranking(link);
        mn = manganelo(average_rating, ranking);
        return mn;

    def anilis():
        average_rating, ranking = anilist_methods.manga.get_score_and_ranking(manga_name);
        anl = anilist(average_rating, ranking);
        return anl;

    anl = anilis();
    info = myanimelist_methods.manga.get_info(myanimelist_methods.manga.get_link(manga_name))
    info.name = anime_planet_methods.manga.get_name(anime_planet_methods.manga.get_link(manga_name));
    mal = mal();
    pl = anime_planet();
    mn = manganel();

    return render_template("manga_query_results.html", mal=mal, anime_planet=pl, manganelo=mn, info=info, anilist=anl);

@app.route("/book", methods=["POST"])
def book():
    return "not done";

