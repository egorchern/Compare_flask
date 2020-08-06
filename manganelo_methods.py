from requests import get;

from re import search, sub;

from bs4 import BeautifulSoup;
from selectorlib import Extractor;

class manga:
    def get_link(name):
        try:
            name = sub(" ", "_", name);

            url = f"https://mangakakalot.com/search/story/{name}";

            html = get(url, timeout=5).text;
            e = Extractor.from_yaml_file("yml/manganelo_link.yml");
            link = e.extract(html)["link"];
            return link;
        except:
            return "NULL";
    def get_score_and_ranking(link):
        try:
            e = Extractor.from_yaml_file("yml/manganelo_score.yml");
            html = get(link, timeout=5).text;
            score = e.extract(html)["score"];
            return score, "No ranking";

        except:

            return "NULL", "NULL"
if __name__ == "__main__":

    link = manga.get_link("solo leveling");
    score, rank = manga.get_score_and_ranking(link);
    print(score);