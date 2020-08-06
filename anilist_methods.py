from requests import post, get;

from re import sub;

from bs4 import BeautifulSoup;
from selectorlib import Extractor;

class anime:
    def get_score_and_ranking(name):
        try:

            query = '''
                query($search: String){
                    Media(search: $search, format_not:MANGA){
                        id
                        
                        }
                }
                '''
            variables = {
                "search": name
            };
            url = 'https://graphql.anilist.co';
            response = post(url, json={'query': query, "variables":variables} ).json();
            media = response["data"]["Media"];
            id_ = media["id"];
            url = f"https://anilist.co/anime/{id_}";
            html = get(url).text;
            e = Extractor.from_yaml_file("yml/anilist_score_and_ranking.yml");
            data = e.extract(html);
            score = sub("%", "", data["score"]);
            rank = data["rank"];
            return score, rank;
        except:
            return "NULL","NULL";


class manga:
    def get_score_and_ranking(name):
        try:

            query = '''
                query($search: String){
                    Media(search: $search, format_in:[MANGA]){
                        id

                        }
                }
                '''
            variables = {
                "search": name
            };
            url = 'https://graphql.anilist.co';
            response = post(url, json={'query': query, "variables": variables}).json();
            media = response["data"]["Media"];
            id_ = media["id"];
            url = f"https://anilist.co/manga/{id_}";
            html = get(url).text;
            e = Extractor.from_yaml_file("yml/anilist_score_and_ranking.yml");
            data = e.extract(html);
            score = sub("%", "", data["score"]);
            rank = data["rank"];
            return score, rank;
        except:
            return "NULL", "NULL";



if __name__ == "__main__":
    score, ranking = manga.get_score_and_ranking("grand blue");
    print("fa");

