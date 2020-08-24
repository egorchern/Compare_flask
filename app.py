import myanimelist_methods;
import imbd_methods;
import manganelo_methods;
import anilist_methods;
from quart import Quart, render_template, request, redirect;

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

redirect_counter = 0;

@app.route("/")
def index():
    return render_template("index.html");


@app.route("/anime/<name>", methods=["POST", "GET"])
def anime(name):
    
    name = sub("%20", " ", name);
    anime_name, idMal = anilist_methods.anime.get_closest_english_name_and_mal_id(name);
    anime_name = sub("/", "-", anime_name);
    print(anime_name, idMal);
    global redirect_counter;
    if redirect_counter == 0:
        redirect_counter = 1;
        return redirect(f"/anime/{anime_name}");
    redirect_counter = 0;

    def mal():
        link = myanimelist_methods.anime.get_link(idMal);
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


    link = myanimelist_methods.anime.get_link(idMal);
    info = myanimelist_methods.anime.get_info(link);

    info.name = anime_name;
    mal = mal();
    pl = anime_planet();
    imb = imd();
    anl = anilis();

    return render_template("anime_query_results.html", mal=mal, anime_planet=pl, info=info, imbd=imb, anilist=anl);

@app.route("/manga/<name>", methods=["POST", "GET"])
def manga(name):

    name = sub("%20", " ", name);
    manga_name, idMal = anilist_methods.manga.get_closest_english_name_and_mal_id(name);
    manga_name = sub("/", "-", manga_name);
    global redirect_counter;
    if redirect_counter == 0:
        redirect_counter = 1;
        return redirect(f"/manga/{manga_name}");
    redirect_counter = 0;
    print(manga_name, idMal);
    def mal():
        link = myanimelist_methods.manga.get_link(idMal);
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
    link = myanimelist_methods.manga.get_link(idMal);
    info = myanimelist_methods.manga.get_info(link);
    info.name = manga_name;
    mal = mal();
    pl = anime_planet();
    mn = manganel();

    return render_template("manga_query_results.html", mal=mal, anime_planet=pl, manganelo=mn, info=info, anilist=anl);

@app.route("/book/<name>", methods=["POST", "GET"])
def book(name):
    isbn = name;

    return render_template("book_query_results.html", isbn=isbn);


