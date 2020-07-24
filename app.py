import myanimelist_methods;
from flask import Flask, render_template;
import re;


class myanimelist:
    def __init__(self, reviews_list, average_rating, ranking):
        self.reviews_list = reviews_list;
        self.average_rating = average_rating;
        self.ranking = ranking;


app = Flask(__name__);

@app.route("/")
def index():
    myanimelist_url = myanimelist_methods.myanimelistNameSearch("railgun");
    reviews_list = myanimelist_methods.myanimelistReviewDownload(myanimelist_url);
    average_rating, ranking = myanimelist_methods.myanimelistGetRatings(myanimelist_url);

    mal = myanimelist(reviews_list, average_rating, ranking);


    return render_template("index.html", mal=mal);

app.run();