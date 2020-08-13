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
        ranking = jsn["popularity"];
        score = sub("\(|\)", "", jsn["score"]);
        return score, ranking;
    except:
        return "NULL", "NULL";

def get_reviews(link):
    html = get(link, timeout=timeout_amount).text;
    soup = BeautifulSoup(html, "lxml");
    review_divs = soup.find("div", {"id":"wp_reviews"}).find_all("div", {"class":"bookReview"});
    print("fa");


if __name__ == "__main__":
    html = get("https://www.librarything.com/search.php?search=0743273567&searchtype=newwork_titles&searchtype=newwork_titles&sortchoice=0").text;
    link = "https://www.librarything.com/work/1977";
    #link = get_link("0060850523");
    score, ranking = get_score_and_ranking(link);
