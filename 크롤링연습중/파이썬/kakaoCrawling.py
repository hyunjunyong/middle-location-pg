import urllib.request
from bs4 import BeautifulSoup

url = 'https://map.kakao.com/'
html = urllib.request.urlopen(url).read()
soup = BeautifulSoup(html, 'html.parser')


title_list = soup.find_all(class_ ='link_name') #장소이름
score_list = soup.find_all(class_ = 'num num0') #평점
# star = soup.find_all(class_ = 'star')

review = []
f = open("kakaoCrawling.txt", 'w',encoding='UTF-8')
def review():
    for title, score in zip[title_list, score_list]:
        data = [title.get_text(),score.get_text]
        review.append(data)
        f.write(review)
f.close()
