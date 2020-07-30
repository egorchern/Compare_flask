import requests;

import re;

from bs4 import BeautifulSoup;


class info:
    def __init__(self, image_link, name, episodes, aired, studios, genres):
        self.image_link = image_link;
        self.name = name;
        self.episodes = episodes;
        self.aired = aired;
        self.studios = studios;
        self.genres = genres;


class review:
    def __init__(self, preview_text, further_text, scores, username, image_link, helpful_points):
        self.preview_text = preview_text;
        self.further_text = further_text
        self.scores = scores;
        self.username = username;
        self.image_link = image_link;
        self.helpful_points = helpful_points;


def get_info(link):
    try:

        html = requests.get(link).text;
        soup = BeautifulSoup(html, "lxml");
        soup = soup.find(class_="borderClass");
        temp = str(soup.find("img"));
        retemp = re.search("alt=\"(?P<name>[^\"]+)\" class=\"lazyload\" data-src=\"(?P<image_link>[^\"]+)\"", temp);
        image_link = retemp.group("image_link");

        soup = soup.text;
        aired = re.search("Aired:\n  (?P<aired>.+)", soup).group("aired");
        episodes = re.search("Episodes:\n  (?P<episode_number>\w*)", soup).group("episode_number");
        studios = re.search("Studios:\n(?P<studio_name>\w*)", soup).group("studio_name");
        genres = re.search("Genres:\n(?P<genres>.+)", soup).group("genres");
        genres = genres.split(",");
        for i in range(0, len(genres)):
            genres[i] = re.sub(" ", "", genres[i]);

        for i in range(0, len(genres)):
            string = genres[i];
            middle = int(len(string) / 2);
            genres[i] = string[0:middle];

        genres = ', '.join(genres);

        inf = info(image_link, "", episodes, aired, studios, genres);
    except:
        inf = info("NULL", "NULL", "NULL", "NULL","NULL", "NULL");
    return inf;




def get_link(animeName, printing=False):#
    try:

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
    except:
        return "NULL";


def get_reviews(link):
    try:

        reviews = [];
        response = requests.get(f"{link}/reviews");


        soup = BeautifulSoup(response.text, "lxml");
        temp = soup.find_all(class_="spaceit textReadability word-break pt8 mt8");
        texts = [];
        counter = 0;
        review_limit = 5;

        for reviewDiv in temp:
            #reviewDiv = str(reviewDiv)
            """
            whole_review = BeautifulSoup(reviewDiv);
            continuation = whole_review.find_all("span");
            print(continuation)
            """
            text = str(reviewDiv.text);
            texts.append(text);
            counter += 1;
            if counter >= review_limit:
                break;
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
        counter = 0;
        review_limit = 5;
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
            counter += 1;
            if counter >= review_limit:
                break;

        preview_texts = [];
        further_texts = [];
        for text in texts:
            preview_text = "";
            further_text = "";
            if(len(text) > 400):
                preview_text = text[0:400];
                further_text = text[400:len(text)];
            else:
                preview_text = text;
            preview_texts.append(preview_text);
            further_texts.append(further_text);


        for i in range(0, len(image_links)):
            this_review = review(preview_texts[i], further_texts[i], scores[i], usernames[i], image_links[i], helpful_points_list[i]);
            reviews.append(this_review);
        return reviews;
    except:
        return [review("NULL", "NULL", ["NULL", "NULL", "NULL", "NULL", "NULL", "NULL"], "NULL", "NULL", "NULL" )];


def get_score_and_ranking(link):
    try:

        response = requests.get(link);
        soup = BeautifulSoup(response.text, "lxml");
        stats_div = soup.find(class_="stats-block po-r clearfix");
        stats_div_text = stats_div.text;
        temp = re.search("^(?P<rating>[^A-Za-z]+)Ranked #(?P<ranking>[^A-Za-z]+)", stats_div_text);
        community_rating = temp.group("rating");
        ranking = temp.group("ranking");
        return community_rating, ranking;
    except:
        return "NULL", "NULL"



if __name__ == "__main__":
    get_reviews(get_link("one piece"))
