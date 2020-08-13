from requests import get;

from re import search, sub;

from bs4 import BeautifulSoup;
from selectorlib import Extractor;


timeout_amount = 5;



def get_link(isbn):
    return f"https://www.librarything.com/isbn/{isbn}";

def get_score_and_ranking(link):
    try:
        html = get(link, timeout=timeout_amount).text;

        e = Extractor.from_yaml_file("yml/library_thing_score_and_ranking.yml");
        jsn = e.extract(html);
        print("fa");
    except:
        return "NULL", "NULL";



if __name__ == "__main__":
    link = get_link("0060850523");
    score, ranking = get_score_and_ranking(link);
