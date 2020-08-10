from requests import get;

from re import sub, search;

from bs4 import BeautifulSoup;

timeout_amount = 5;


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

class anime:

    def get_info(link):
        try:

            html = get(link, timeouttimeout=timeout_amount).text;
            soup = BeautifulSoup(html, "lxml");
            soup = soup.find(class_="borderClass");
            temp = str(soup.find("img"));
            retemp = search("alt=\"(?P<name>[^\"]+)\" class=\"lazyload\" data-src=\"(?P<image_link>[^\"]+)\"", temp);
            image_link = retemp.group("image_link");

            soup = soup.text;
            aired = search("Aired:\n  (?P<aired>.+)", soup).group("aired");
            episodes = search("Episodes:\n  (?P<episode_number>\w*)", soup).group("episode_number");
            studios = search("Studios:\n(?P<studio_name>\w*)", soup).group("studio_name");
            genres = search("Genres:\n(?P<genres>.+)", soup).group("genres");
            genres = genres.split(",");
            for i in range(0, len(genres)):
                genres[i] = sub(" ", "", genres[i]);

            for i in range(0, len(genres)):
                string = genres[i];
                middle = int(len(string) / 2);
                genres[i] = string[0:middle];

            genres = ', '.join(genres);

            inf = info(image_link, "", episodes, aired, studios, genres);
        except:
            inf = info("NULL", "NULL", "NULL", "NULL","NULL", "NULL");
        return inf;



    '''
    def get_link(animeName, printing=False):#
        try:

            url = f"https://myanimelist.net/anime.php?q={animeName}&type=0&score=0&status=0&p=0&r=0&sm=0&sd=0&sy=0&em=0&ed=0&ey=0&c%5B%5D=a&c%5B%5D=b&c%5B%5D=c&c%5B%5D=f&gx=0"
            response = get(url, timeout=5 )
            soup = BeautifulSoup(response.text, 'lxml');
            soup = soup.find("div", {"class": "js-categories-seasonal js-block-list list"});
            trs = soup.find_all("tr");
            second = trs[1];
            link = second.find("a")["href"];
            return link;
            
        except:
            return "NULL";
    '''
    def get_link(idMal):
        url = f"https://myanimelist.net/anime/{idMal}/p";
        return url;

    def get_reviews(link):
        try:

            reviews = [];
            response = get(f"{link}/reviews", timeout=timeout_amount);


            soup = BeautifulSoup(response.text, "lxml");
            temp = soup.find_all(class_="spaceit textReadability word-break pt8 mt8");
            texts = [];
            counter = 0;
            review_limit = 3;

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
                        if search("^ *$", temp[j]) != None and search("^ *$", temp[j - 1]):
                            temp.pop(j);
                            change = True;
                            break;
                    if change == False:
                        break;
                temp_scores = temp[0:18];
                while True:
                    change = False;
                    for j in range(0, len(temp_scores)):
                        if search("^\d{1,2}$", temp_scores[j]) == None:
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
            review_limit = 3;
            for item in temp:
                item = str(item);
                item_soup = BeautifulSoup(item, "lxml");
                container = item_soup.find("table");
                links = container.find_all("a");
                temporal = str(links[0]);
                image_link = search(" src=\"(?P<link>[^\"]+)\"", temporal).group("link");
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

            response = get(link, timeout=timeout_amount);
            soup = BeautifulSoup(response.text, "lxml");
            stats_div = soup.find(class_="stats-block po-r clearfix");
            stats_div_text = stats_div.text;
            temp = search("^(?P<rating>[^A-Za-z]+)Ranked #(?P<ranking>[^A-Za-z]+)", stats_div_text);
            community_rating = temp.group("rating");
            ranking = temp.group("ranking");
            return community_rating, ranking;
        except:
            return "NULL", "NULL"

class manga:
    def get_info(link):
        try:

            html = get(link, timeout=timeout_amount).text;
            soup = BeautifulSoup(html, "lxml");
            soup = soup.find(class_="borderClass");
            temp = str(soup.find("img"));
            retemp = search("alt=\"(?P<name>[^\"]+)\" class=\"lazyload\" data-src=\"(?P<image_link>[^\"]+)\"", temp);
            image_link = retemp.group("image_link");

            soup = soup.text;

            published = search("Published: (?P<published>[^G]+)", soup).group("published");
            chapters = search("Chapters: (?P<chapters>\w*)", soup).group("chapters");
            authors = search("Authors:\n(?P<authors>.+)Serialization", soup).group("authors");
            genres = search("Genres:\n(?P<genres>.+)Authors", soup).group("genres");
            genres = genres.split(",");
            for i in range(0, len(genres)):
                genres[i] = sub(" ", "", genres[i]);

            for i in range(0, len(genres)):
                string = genres[i];
                middle = int(len(string) / 2);
                genres[i] = string[0:middle];

            genres = ', '.join(genres);

            inf = info(image_link, "", chapters, published, authors, genres);
        except:
            inf = info("NULL", "NULL", "NULL", "NULL", "NULL", "NULL");
        return inf;
    '''
    def get_link(animeName, printing=False):#
        try:

            url = f"https://myanimelist.net/manga.php?q={animeName}&type=0&score=0&status=0&p=0&r=0&sm=0&sd=0&sy=0&em=0&ed=0&ey=0&c%5B%5D=a&c%5B%5D=b&c%5B%5D=c&c%5B%5D=f&gx=0"
            response = get(url, timeout=5)
            soup = BeautifulSoup(response.text, 'lxml');
            soup = soup.find("div", {"class": "js-categories-seasonal js-block-list list"});
            trs = soup.find_all("tr");
            second = trs[1];
            link = second.find("a")["href"];
            return link;
            
        except:
            return "NULL";
    '''
    def get_link(idMal):
        url = f"https://myanimelist.net/manga/{idMal}/p";
        return url;


    def get_reviews(link):
        try:
            reviews = [];
            response = get(f"{link}/reviews", timeout=timeout_amount);

            soup = BeautifulSoup(response.text, "lxml");
            temp = soup.find_all(class_="spaceit textReadability word-break pt8 mt8");
            texts = [];
            counter = 0;
            review_limit = 3;

            for reviewDiv in temp:
                # reviewDiv = str(reviewDiv)
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
                        if search("^ *$", temp[j]) != None and search("^ *$", temp[j - 1]):
                            temp.pop(j);
                            change = True;
                            break;
                    if change == False:
                        break;

                temp_scores = temp[0:16];

                while True:
                    change = False;
                    for j in range(0, len(temp_scores)):
                        if search("^\d{1,2}$", temp_scores[j]) == None:
                            temp_scores.pop(j);
                            change = True;
                            break;
                    if change == False:
                        break;
                scores.append(temp_scores);

                texts[i] = '\n'.join(temp[16:len(temp) - 4]);
            temp = soup.find_all(class_="borderDark");
            image_links = [];
            usernames = [];
            helpful_points_list = [];
            counter = 0;
            review_limit = 3;
            for item in temp:
                item = str(item);
                item_soup = BeautifulSoup(item, "lxml");
                container = item_soup.find("table");
                links = container.find_all("a");
                temporal = str(links[0]);
                image_link = search(" src=\"(?P<link>[^\"]+)\"", temporal).group("link");
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
                if (len(text) > 400):
                    preview_text = text[0:400];
                    further_text = text[400:len(text)];
                else:
                    preview_text = text;
                preview_texts.append(preview_text);
                further_texts.append(further_text);

            for i in range(0, len(image_links)):
                this_review = review(preview_texts[i], further_texts[i], scores[i], usernames[i], image_links[i],
                                     helpful_points_list[i]);
                reviews.append(this_review);
            return reviews;
        except:
            return [review("NULL", "NULL", ["NULL", "NULL", "NULL", "NULL", "NULL", "NULL"], "NULL", "NULL", "NULL")];

    def get_score_and_ranking(link):
        try:

            response = get(link, timeout=timeout_amount);
            soup = BeautifulSoup(response.text, "lxml");
            stats_div = soup.find(class_="stats-block po-r clearfix");
            stats_div_text = stats_div.text;
            temp = search("^(?P<rating>[^A-Za-z]+)Ranked #(?P<ranking>[^A-Za-z]+)", stats_div_text);
            community_rating = temp.group("rating");
            ranking = temp.group("ranking");
            return community_rating, ranking;
        except:
            return "NULL", "NULL"



if __name__ == "__main__":

    link = manga.get_link("13/m");
    reviews = manga.get_reviews(link);

