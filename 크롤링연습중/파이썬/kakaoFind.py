from urllib.parse import quote_plus
from bs4 import BeautifulSoup
from selenium import webdriver

baseUrl = 'https://www.google.com/search?q='
plusUrl = input('무엇을 검색할까요? :')
url = baseUrl + quote_plus(plusUrl)

driver = webdriver.Chrome(executable_path=r'C:/Users/Hyun jun yong/Desktop/4학년 1학기/캡스톤/파이썬/chromedriver_win32/chromedriver.exe')
#크롬드라이버위치 절대경로
driver.get(url)

html = driver.page_source
soup = BeautifulSoup(html)

f = open("새파일.txt", 'w',encoding='UTF-8')
r = soup.select('.r')
for i in r:
    print(i.select_one('.ellip').text)
    print(i.select_one('.iUh30.bc').text)
    print(i.a.attrs['href'])
    print()
    i +=1
    f.write(data)
f.close()
driver.close()