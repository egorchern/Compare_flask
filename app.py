import myanimelist_methods;
from flask import Flask, render_template;
import re;




app = Flask(__name__);

@app.route("/")
def index():
    reviews_list = myanimelist_methods.myanimelistReviewDownload("https://myanimelist.net/anime/21/One_Piece");


    return render_template("index.html", reviews_list=reviews_list);

app.run();