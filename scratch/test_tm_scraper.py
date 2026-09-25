import requests
import re
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

url = 'https://www.transfermarkt.de/bayer-04-leverkusen/kader/verein/15/saison_id/2026/plus/1'

resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.content, 'html.parser')
table = soup.find('table', {'class': 'items'})

players = []
rows = table.find_all('tr', {'class': ['odd', 'even']})

for r in rows:
    hauptlink = r.find('td', {'class': 'hauptlink'})
    if not hauptlink:
        continue
    name = hauptlink.text.strip()
    
    pos_tr = r.find_all('tr')
    position = pos_tr[1].text.strip() if len(pos_tr) > 1 else 'Unbekannt'
    
    tds = [td.text.strip() for td in r.find_all('td')]
    date_matches = [t for t in tds if re.match(r'^\d{2}\.\d{2}\.\d{4}$', t)]
    
    contract_until = "Unbekannt"
    if len(date_matches) >= 2:
        contract_until = date_matches[-1] # Exact contract end date!
    elif len(date_matches) == 1 and ("202" in date_matches[0] or "203" in date_matches[0]):
        contract_until = date_matches[0]
        
    players.append({
        'name': name,
        'position': position,
        'contract_until': contract_until
    })

print(f"=== Bayer 04 Leverkusen (Season 2026/2027 Expirations) ===")
expiring_2027_2028 = [p for p in players if any(yr in p['contract_until'] for yr in ['2027', '2028'])]

pos_exp_counts = {}
for p in expiring_2027_2028:
    pos = p['position']
    pos_exp_counts[pos] = pos_exp_counts.get(pos, 0) + 1
    print(f"  Expiring: {p['name']:<25} | Pos: {p['position']:<22} | Contract: {p['contract_until']}")

print(f"\nExact Expiring Contracts Count (2027/2028): {pos_exp_counts}")
