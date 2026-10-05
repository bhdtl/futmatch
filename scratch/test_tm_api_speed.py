import asyncio
import httpx
import time

headers = {
    'Accept': 'application/json',
    'User-Agent': 'transfermarkt-api'
}

async def test_speed():
    async with httpx.AsyncClient(base_url='https://tmapi.transfermarkt.technology', headers=headers, timeout=20.0) as client:
        start_time = time.time()
        
        # 1. Fetch 3. Liga competition clubs
        r_comp = await client.get('/competition/L3/club?season_id=2025')
        club_ids = r_comp.json()['data']['clubIds']
        print(f"Discovered {len(club_ids)} clubs in 3. Liga!")
        
        # 2. Fetch club squad for first 3 clubs concurrently
        tasks = [client.get(f'/club/{cid}/squad?season_id=2025') for cid in club_ids[:3]]
        squad_resps = await asyncio.gather(*tasks)
        
        total_pids = []
        for s_r in squad_resps:
            pids = s_r.json()['data']['playerIds']
            total_pids.extend(pids[:10]) # first 10 players each
            
        print(f"Fetching details for {len(total_pids)} players concurrently...")
        
        # 3. Fetch player details concurrently
        p_tasks = [client.get(f'/player/{pid}') for pid in total_pids]
        p_resps = await asyncio.gather(*p_tasks)
        
        elapsed = time.time() - start_time
        print(f"Successfully fetched {len(p_resps)} players in {elapsed:.2f} seconds!")
        
        p0 = p_resps[0].json()['data']
        print("Sample player profile:")
        print(f"  Name: {p0.get('name')}")
        print(f"  Age: {p0.get('lifeDates', {}).get('age')}")
        print(f"  Position: {p0.get('attributes', {}).get('position', {}).get('name')}")
        print(f"  Contract Until: {p0.get('attributes', {}).get('contractUntil')}")
        print(f"  Foot: {p0.get('attributes', {}).get('preferredFoot', {}).get('name')}")
        print(f"  Market Value: {p0.get('marketValueDetails', {}).get('current', {}).get('value')} EUR")
        print(f"  Agency: {p0.get('attributes', {}).get('consultantAgency', {}).get('name')}")
        print(f"  Photo: {p0.get('portraitUrl')}")

if __name__ == "__main__":
    asyncio.run(test_speed())
