import os
from time import sleep
import requests
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotInteractableException
from selenium.common.exceptions import StaleElementReferenceException
from bs4 import BeautifulSoup

##############################################################  ############
##################### variable related selenium ##########################
##########################################################################
options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('lang=ko_KR')
chromedriver_path = "chromedriver"
#driver = webdriver.Chrome(os.path.join(os.getcwd(), chromedriver_path), options=options)  # chromedriver 열기

driver = webdriver.Chrome(executable_path=r'C:/Users/user/Documents/GitHub/middle-location-pg/crawling/chromedriver_win32/chromedriver.exe')

driver.get("https://map.kakao.com/")
sleep(5)

search_area = driver.find_element_by_xpath('//*[@id="search.keyword.query"]') # 검색 창
search_area.send_keys('제주 시청 맛집')  # 검색어 입력
driver.find_element_by_xpath('//*[@id="search.keyword.submit"]').send_keys(Keys.ENTER)  # Enter로 검색

html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')

place_lists = soup.select('.placelist > .PlaceItem')
star = soup.select('em.num')
for place in place_lists:
    place_name = place.select('.head_item > .tit_name > .link_name')[0].text  # placeName
    print(place_name.get_text())

# title = soup.find_all(class_ ='api_txt_lines')
# i=1
# f = open("새파일.txt", 'w',encoding='UTF-8')
# for anchor in title:
#     data = str(i) + "위" + anchor.get_text() + "\n"
#     i +=1
#     f.write(data)