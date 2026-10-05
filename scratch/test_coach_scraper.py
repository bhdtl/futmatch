import requests
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

clubs = [
    (15, 'bayer-04-leverkusen'),
    (27, 'bayern-munchen'),
    (16, 'borussia-dortmund'),
    (35, 'fc-st-pauli'),
    (38, 'fortuna-dusseldorf'),
    (269, 'holstein-kiel'),
    (65, 'spvgg-greuther-furth')
]

for c_id, slug in clubs:
    url = f"https://www.transfermarkt.de/{slug}/mitarbeiter/verein/{c_id}/saison_id/2026"
    resp = requests.get(url, headers=headers)
    coach_name = "Unbekannt"
    if resp.status_code == 200:
        soup = BeautifulSoup(resp.content, 'html.parser')
        first_trainer_a = soup.find('a', href=lambda h: h and '/profil/trainer/' in h)
        if first_trainer_a:
            coach_name = first_trainer_a.text.strip()
    print(f"Club [{c_id}] {slug:<25} -> LIVE HEAD COACH: {coach_name}")
