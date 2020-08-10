from requests import post, get;

from re import sub;

from bs4 import BeautifulSoup;
from selectorlib import Extractor;



timeout_amount = 5;

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
            html = get(url, timeout=timeout_amount).text;
            e = Extractor.from_yaml_file("yml/anilist_score_and_ranking.yml");
            data = e.extract(html);
            score = sub("%", "", data["score"]);
            rank = data["rank"];
            return score, rank;
        except:
            return "NULL","NULL";


    def get_closest_english_name_and_mal_id(name):
        try:
            query = '''
                query($search: String){
                    Media(search: $search, format_not:MANGA){
                        idMal
                        title{
                            romaji
                            english
                        }
                    }
                }
            '''
            variables = {
                "search": name
            };
            url = 'https://graphql.anilist.co';
            response = post(url, json={'query': query, "variables": variables}).json();
            media = response["data"]["Media"];
            english_name = media["title"]["english"];
            romaji_name = media["title"]["romaji"];
            idMal = str(media["idMal"]);
            if english_name != None:

                return english_name, idMal;
            else:
                return romaji_name, idMal;
        except:
            return name, "NULL";

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
            html = get(url, timeout=timeout_amount).text;
            e = Extractor.from_yaml_file("yml/anilist_score_and_ranking.yml");
            data = e.extract(html);
            score = sub("%", "", data["score"]);
            rank = data["rank"];
            return score, rank;
        except:
            return "NULL", "NULL";


    def get_closest_english_name_and_mal_id(name):
        try:
            query = '''
                query($search: String){
                    Media(search: $search, format_in:[MANGA]){
                        idMal
                        title{
                            romaji
                            english
                        }
                    }
                }
            '''
            variables = {
                "search": name
            };
            url = 'https://graphql.anilist.co';
            response = post(url, json={'query': query, "variables": variables}).json();
            media = response["data"]["Media"];
            english_name = media["title"]["english"];
            romaji_name = media["title"]["romaji"];
            idMal = str(media["idMal"]);
            if english_name != None:

                return english_name, idMal;
            else:
                return romaji_name, idMal;
        except:
            return name, "NULL";


if __name__ == "__main__":
   print(anime.get_closest_english_name_and_mal_id("one piece"));

