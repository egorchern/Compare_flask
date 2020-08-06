from requests import get;
from selectorlib import Extractor;
from re import sub;


def get_isbn(name):
    name = sub(" ", "+", name);
    url = f"https://www.googleapis.com/books/v1/volumes?q={name}";
    data = get(url).json()["items"][0];
    isbn = data["volumeInfo"]["industryIdentifiers"][1]["identifier"];
    return isbn;



if __name__ == "__main__":
    print(get_isbn("To Kill a Mockingbird"));