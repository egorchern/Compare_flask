import requests;
import json;
from threading import Timer;
import datetime;
from time import sleep;
import re;

from bs4 import BeautifulSoup;

class review:
    def __init__(self, text, scores, username, image_link, helpful_points):
        self.text = text;
        self.scores = scores;
        self.username = username;
        self.image_link = image_link;
        self.helpful_points = helpful_points;


def myanimelistNameSearch(animeName, printing=False):
    url = f"https://myanimelist.net/search/all?q={animeName}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'lxml');
    temp = soup.find(class_ = "js-scrollfix-bottom-rel");

    vat = temp.find_all("a", class_="hoverinfo_trigger fw-b fl-l");
    if(printing == True):
        possible_animes = [];
        for item in vat:
            item = str(item);

            name = re.search(">(?P<name>.+)<", item).group("name");
            link = re.search("href=\"(?P<link>[^\"]+)", item).group("link")

            possible_animes.append(f"{name}   {link}");

        print(f"Possible animes for query ({animeName}):");
        print('\n'.join(possible_animes));
    else:
        candidate = str(vat[0]);
        link = re.search("href=\"(?P<link>[^\"]+)", candidate).group("link");
        return link


def myanimelistReviewDownload(link):
    reviews = [];
    response = requests.get(f"{link}/reviews");


    soup = BeautifulSoup(response.text, "lxml");
    temp = soup.find_all(class_="spaceit textReadability word-break pt8 mt8");
    texts = [];
    for reviewDiv in temp:
        #reviewDiv = str(reviewDiv)
        """
        whole_review = BeautifulSoup(reviewDiv);
        continuation = whole_review.find_all("span");
        print(continuation)
        """
        text = str(reviewDiv.text);
        texts.append(text);

    scores = [];
    for i in range(0, len(texts)):
        temp = texts[i].splitlines();
        while True:
            change = False;
            for j in range(1, len(temp)):
                if re.search("^ *$", temp[j]) != None and re.search("^ *$", temp[j - 1]):
                    temp.pop(j);
                    change = True;
                    break;
            if change == False:
                break;
        temp_scores = temp[0:18];
        while True:
            change = False;
            for j in range(0, len(temp_scores)):
                if re.search("^\d{1,2}$", temp_scores[j]) == None:
                    temp_scores.pop(j);
                    change = True;
                    break;
            if change == False:
                break;
        scores.append(temp_scores);

        texts[i] = '\n'.join(temp[18:len(temp) - 4]);
    temp = soup.find_all(class_="borderDark");
    image_links = [];
    usernames = [];
    helpful_points_list = [];
    for item in temp:
        item = str(item);
        item_soup = BeautifulSoup(item, "lxml");
        container = item_soup.find("table");
        links = container.find_all("a");
        temporal = str(links[0]);
        image_link = re.search(" src=\"(?P<link>[^\"]+)\"", temporal).group("link");
        image_links.append(image_link);
        temporal = links[1];
        username = temporal.text;
        usernames.append(username);
        helpful_points = container.find("span").text;
        helpful_points_list.append(helpful_points);



    for i in range(0, len(texts)):
        this_review = review(texts[i], scores[i], usernames[i], image_links[i], helpful_points_list[i]);
        reviews.append(this_review);
    return reviews;





if __name__ == "__main__":
    this_reviews = myanimelistReviewDownload("https://myanimelist.net/anime/37403/Ahiru_no_Sora")
    for rev in this_reviews:
        print(rev.username);
        print(rev.image_link);
        print(rev.helpful_points);
    #main();

