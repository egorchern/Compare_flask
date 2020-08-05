import requests;

import re;

from bs4 import BeautifulSoup;
from selectorlib import Extractor;

class anime:
    def get_score_and_ranking(name):
        try:

            query = '''
                query($search: String){
                Media(search: $search){
                    id
                    
                    }
                }
                '''
            variables = {
                "search": name
            };
            url = 'https://graphql.anilist.co';
            response = requests.post(url, json={'query': query, "variables":variables} ).json();
            media = response["data"]["Media"];
            id_ = media["id"];
            url = f"https://anilist.co/anime/{id_}";
            html = requests.get(url).text;
            e = Extractor.from_yaml_file("anilist_score_and_ranking.yml");
            data = e.extract(html);
            score = re.sub("%", "", data["score"]);
            rank = data["rank"];
            return score, rank;
        except:
            return "NULL","NULL";




if __name__ == "__main__":
    score, ranking = anime.get_score_and_ranking("nisekoi");
    print("fa");

