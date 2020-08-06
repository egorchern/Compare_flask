from requests import get;

from re import sub, search;

from bs4 import BeautifulSoup;
from selectorlib import Extractor;

class review:
    def __init__(self, preview_text, further_text, scores, username, image_link, helpful_points):
        self.preview_text = preview_text;
        self.further_text = further_text
        self.scores = scores;
        self.username = username;
        self.image_link = image_link;
        self.helpful_points = helpful_points;

class anime:
    def get_link(name):
        try:

            name = sub(" ", "-", name).lower();
            name = sub("[^0-9a-zA-Z\-]", "", name);

            link = f"https://www.anime-planet.com/anime/{name}";
            return link;
        except:
            return "NULL";
        """
        url = f"https://www.anime-planet.com/anime/all?name={name}&sort=title&order=asc";
        response = requests.get(url);
        soup = BeautifulSoup(response.text, "lxml");
        soup = soup.find("div", {"id": "siteContainer"});
        soup = soup.find("ul", {"class": "cardDeck cardGrid"});
        soup  = soup.find_all("li");
        links = [];
        for item_li in soup:
            link = item_li.find("a")['href'];
            link = f"https://www.anime-planet.com{link}";
            links.append(link);
        return links[0];
        """

    def get_score_and_ranking(link):
        try:
            html = get(link, timeout=5).text;
            soup = BeautifulSoup(html, "lxml");
            soup = soup.find("div", {"id": "siteContainer"});
            soup = soup.find("section", {"class" : "pure-g entryBar"});
            soup = soup.find_all("div", {"class": "pure-1 md-1-5"});
            score_temp = soup[-2].text;
            rank_temp = soup[-1].text;
            score = search("(?P<score>[0-9.]+) out", score_temp).group("score");
            rank = search("(?P<rank>#[^ ]+)", rank_temp).group("rank");
            return score, rank;
        except:
            return "NULL","NULL"

    def get_reviews(link):
        try:

            reviews = [];
            url = f"{link}/reviews?sort=helpful";
            html = get(url, timeout=5).text;
            soup = BeautifulSoup(html, "lxml");
            soup = soup.find("div", {"id": "siteContainer"});
            soup = soup.find(class_="pure-1 md-4-5 controlBar");
            review_containers = soup.find_all("section", {"class" : "pure-g"});

            preview_texts = [];
            further_texts = [];
            image_links = [];
            names = [];
            scores_list = [];
            helpful_points = [];
            counter = 0;
            review_limit = 3;
            for review_container in review_containers:
                avatar_container = review_container.find("div", {"class": "pure-3-5 avatarHeader"});
                image_link = avatar_container.find("a").find("img")["src"];
                image_link = f"https://www.anime-planet.com{image_link}";
                image_links.append(image_link);
                name_container = avatar_container.find("div", {"class": "authorDate"});
                name = name_container.find("a").text;
                names.append(name);
                text_container = review_container.find("div", {"itemprop": "reviewBody"});
                text = text_container.text;

                preview_text = "";
                further_text = "";
                if (len(text) > 400):
                    preview_text = text[0:400];
                    further_text = text[400:len(text)];
                else:
                    preview_text = text;
                preview_texts.append(preview_text);
                further_texts.append(further_text);

                score_container = review_container.find("div", {"itemprop": "reviewRating"});
                sub_scores = score_container.find_all("div", {"reviewScores pure-1-5"});
                scores = [];
                for sub_score in sub_scores:
                    score_text = sub_score.text;
                    score = search("(?P<score>.*)/10", score_text).group("score");

                    scores.append(score);

                scores_list.append(scores);
                counter += 1;
                if counter >= review_limit:
                    break;
            counter = 0;
            review_limit = 3;
            soup = soup.find_all("div", {"class": "cta horizontal-cta recoCta"});
            for panel_container in soup:
                helpful_container = panel_container.find_all("a", {"class": "rated off"})[1];
                points = search("\((?P<points>\d*)\)", helpful_container.text)
                if points != None:
                    points = points.group("points");
                else:
                    points = "0";
                helpful_points.append(points);
                counter += 1;
                if counter >= review_limit:
                    break;
            for i in range(0, len(names)):
                current_review = review(preview_texts[i], further_texts[i], scores_list[i], names[i], image_links[i], helpful_points[i]);
                reviews.append(current_review);
            return reviews;
        except:
            return [review("NULL", "NULL", ["NULL", "NULL", "NULL", "NULL", "NULL"], "NULL", "NULL", "NULL")];

    def get_name(link):
        try:

            html = get(link, timeout=5).text;
            e = Extractor.from_yaml_file("yml/anime_name.yml");
            name = e.extract(html)["english_name"];
            return name;
        except:
            return "NULL";

class manga:
    def get_link(name):
        try:

            name = sub(" ", "-", name).lower();
            name = sub("[^0-9a-zA-Z\-]", "", name);

            link = f"https://www.anime-planet.com/manga/{name}";
            return link;
        except:
            return "NULL";
        """
        url = f"https://www.anime-planet.com/anime/all?name={name}&sort=title&order=asc";
        response = requests.get(url);
        soup = BeautifulSoup(response.text, "lxml");
        soup = soup.find("div", {"id": "siteContainer"});
        soup = soup.find("ul", {"class": "cardDeck cardGrid"});
        soup  = soup.find_all("li");
        links = [];
        for item_li in soup:
            link = item_li.find("a")['href'];
            link = f"https://www.anime-planet.com{link}";
            links.append(link);
        return links[0];
        """

    def get_score_and_ranking(link):
        try:
            html = get(link, timeout=5).text;
            soup = BeautifulSoup(html, "lxml");
            soup = soup.find("div", {"id": "siteContainer"});
            soup = soup.find("section", {"class" : "pure-g entryBar"});
            soup = soup.find_all("div", {"class": "pure-1 md-1-5"});
            score_temp = soup[-2].text;
            rank_temp = soup[-1].text;
            score = search("(?P<score>[0-9.]+) out", score_temp).group("score");
            rank = search("(?P<rank>#[^ ]+)", rank_temp).group("rank");
            return score, rank;
        except:
            return "NULL","NULL"

    def get_reviews(link):
        try:

            reviews = [];
            url = f"{link}/reviews?sort=helpful";
            html = get(url, timeout=5).text;
            soup = BeautifulSoup(html, "lxml");
            soup = soup.find("div", {"id": "siteContainer"});
            soup = soup.find(class_="pure-1 md-4-5 controlBar");
            review_containers = soup.find_all("section", {"class" : "pure-g"});

            preview_texts = [];
            further_texts = [];
            image_links = [];
            names = [];
            scores_list = [];
            helpful_points = [];
            counter = 0;
            review_limit = 3;
            for review_container in review_containers:
                avatar_container = review_container.find("div", {"class": "pure-3-5 avatarHeader"});
                image_link = avatar_container.find("a").find("img")["src"];
                image_link = f"https://www.anime-planet.com{image_link}";
                image_links.append(image_link);
                name_container = avatar_container.find("div", {"class": "authorDate"});
                name = name_container.find("a").text;
                names.append(name);
                text_container = review_container.find("div", {"itemprop": "reviewBody"});
                text = text_container.text;

                preview_text = "";
                further_text = "";
                if (len(text) > 400):
                    preview_text = text[0:400];
                    further_text = text[400:len(text)];
                else:
                    preview_text = text;
                preview_texts.append(preview_text);
                further_texts.append(further_text);

                score_container = review_container.find("div", {"itemprop": "reviewRating"});
                sub_scores = score_container.find_all("div", {"reviewScores pure-1-4"});
                scores = [];
                for sub_score in sub_scores:
                    score_text = sub_score.text;

                    score = search("(?P<score>.*)/10", score_text).group("score");

                    scores.append(score);

                scores_list.append(scores);
                counter += 1;
                if counter >= review_limit:
                    break;
            soup = soup.find_all("div", {"class": "cta horizontal-cta recoCta"});
            counter = 0;
            review_limit = 3;
            for panel_container in soup:
                helpful_container = panel_container.find_all("a", {"class": "rated off"})[1];
                points = search("\((?P<points>\d*)\)", helpful_container.text)
                if points != None:
                    points = points.group("points");
                else:
                    points = "0";
                helpful_points.append(points);
                counter += 1;
                if counter >= review_limit:
                    break;
            for i in range(0, len(names)):
                current_review = review(preview_texts[i], further_texts[i], scores_list[i], names[i], image_links[i], helpful_points[i]);
                reviews.append(current_review);
            return reviews;
        except:
            return [review("NULL", "NULL", ["NULL", "NULL", "NULL", "NULL", "NULL"], "NULL", "NULL", "NULL")];

    def get_name(link):
        try:

            html = get(link, timeout=5).text;
            e = Extractor.from_yaml_file("yml/anime_name.yml");
            name = e.extract(html)["english_name"];
            return name;
        except:
            return "NULL";



if __name__ == "__main__":
    pass;
