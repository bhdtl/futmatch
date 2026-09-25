import requests
import re
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

url = "https://www.transfermarkt.de/piero-hincapie/profil/spieler/659813"
resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.content, 'html.parser')

print(f"Status: {resp.status_code}")
items = soup.find_all('span', {'class': 'info-table__content'})
for item in items:
    print("ITEM:", item.text.strip())
