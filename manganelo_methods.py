import requests;

import re;

from bs4 import BeautifulSoup;
from selectorlib import Extractor;

class manga:
    def get_link(name):
        try:
            name = re.sub(" ", "_", name);

            url = f"https://mangakakalot.com/search/story/{name}";

            html = requests.get(url).text;
            e = Extractor.from_yaml_file("manganelo_link.yml");
            link = e.extract(html)["link"];
            return link;
        except:
            return "NULL";
    def get_score_and_ranking(link):
        try:
            e = Extractor.from_yaml_file("manganelo_score.yml");
            html = requests.get(link).text;
            score = e.extract(html)["score"];
            return score, "No ranking";

        except:

            return "NULL", "NULL"
if __name__ == "__main__":

    link = manga.get_link("solo leveling");
    score, rank = manga.get_score_and_ranking(link);
    print(score);