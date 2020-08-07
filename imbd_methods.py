from requests import get;

from re import search, sub;

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

            name = sub(" ", "+", name).lower();
            name = sub("[^0-9a-zA-Z\+]", "", name);

            url = f"https://www.imdb.com/find?q={name}&ref_=nv_sr_sm";
            html = get(url, timeout=8).text;
            search_container = BeautifulSoup(html, "lxml").find("div", {"id": "main"});
            search_container = search_container.find("table", {"class": "findList"});
            trs = search_container.find_all("tr");
            first = trs[0].find("a");
            link = "https://www.imdb.com/" + first["href"];
            return link
        except:
            return "NULL";

    def get_score_and_ranking(link):
        try:

            html = get(link, timeout=8).text;
            e = Extractor.from_yaml_file("yml/imbd_score.yml");
            score = e.extract(html)["imbd_score"];
            ranking = "No ranking";
            return score, ranking;
        except:
            return "NULL", "NULL"


    def get_reviews(link):
        try:
            url = f"{link}reviews?ref_=tt_ql_3";
            html = get(url, timeout=8).text;
            soup = BeautifulSoup(html, "lxml").find("div", {"id": "main"});
            soup = soup.find("div", {"class": "lister-list"});
            review_divs = soup.find_all("div", {"class": "review-container"});
            counter = 0;
            review_limit = 4;
            reviews = [];
            preview_texts = [];
            further_texts = [];
            image_links = [];
            names = [];
            scores_list = [];
            helpful_points = [];
            for review_div in review_divs:
                try:
                    rating_bar = review_div.find("span", {"class": "rating-other-user-rating"}).find("span");
                    score = rating_bar.text;
                    scores_list.append([score]);
                except:
                    scores_list.append(["No score"]);
                username_container = review_div.find("span", {"class": "display-name-link"});
                username = username_container.text;
                names.append(username);
                text_container = review_div.find("div", {"class": "content"});
                text = text_container.find("div").text;
                preview_text = "";
                further_text = "";
                if (len(text) > 400):
                    preview_text = text[0:400];
                    further_text = text[400:len(text)];
                else:
                    preview_text = text;
                preview_texts.append(preview_text);
                further_texts.append(further_text);
                helpful_container = text_container.find("div", {"class": "actions text-muted"});
                helpful_text = helpful_container.text;
                helpful_point = search("(?P<helpful_point>\d+) out", helpful_text).group("helpful_point");
                helpful_points.append(helpful_point);
                image_links.append("https://i.pinimg.com/236x/8b/4a/df/8b4adf13b888cf02c2ef8fa8ff2e8a1f--tower-of-god-androssi-chicas-anime.jpg");
                counter += 1;
                if counter >= review_limit:
                    break;
            for i in range(0, len(names)):
                current_review = review(preview_texts[i], further_texts[i], scores_list[i], names[i], image_links[i],
                                        helpful_points[i]);
                reviews.append(current_review);
            return reviews;
        except:
            return [review("NULL", "NULL", ["NULL"], "NULL", "NULL", "NULL")];



if __name__ == "__main__":
    link = anime.get_link("nisekoi")
    reviews = anime.get_reviews(link);
    print(reviews[3].scores, reviews[3].preview_text);
