import urllib.request
from bs4 import BeautifulSoup

url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%ED%8C%8C%EC%9D%B4%EC%8D%AC'
html = urllib.request.urlopen(url).read()
soup = BeautifulSoup(html, 'html.parser')


title = soup.find_all(class_ ='api_txt_lines')
i=1
f = open("새파일.txt", 'w',encoding='UTF-8')
for anchor in title:
    data = str(i) + "위" + anchor.get_text() + "\n"
    i +=1
    f.write(data)
f.close()
