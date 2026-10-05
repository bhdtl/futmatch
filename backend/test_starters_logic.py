import sys
import re
from pathlib import Path

sys.path.append(str(Path(__file__).parent))
from app.db.supabase_client import get_supabase_client

def parse_market_value(mv_str):
    if not mv_str or mv_str == "-":
        return 0
    s = str(mv_str).replace(".", "").replace(",", ".").strip()
    match_mio = re.search(r'([\d\.]+)\s*Mio', s, re.IGNORECASE)
    if match_mio:
        return float(match_mio.group(1)) * 1_000_000
    match_tsd = re.search(r'([\d\.]+)\s*Tsd', s, re.IGNORECASE)
    if match_tsd:
        return float(match_tsd.group(1)) * 1_000
    return 0

def get_position_category(pos_str):
    pos = str(pos_str).lower()
    if "torwart" in pos:
        return "TW"
    elif "linker verteidiger" in pos or "linksverteidiger" in pos:
        return "LV"
    elif "rechter verteidiger" in pos or "rechtsverteidiger" in pos:
        return "RV"
    elif "innenverteidiger" in pos:
        return "IV"
    elif "defensives mittelfeld" in pos:
        return "DM"
    elif "offensives mittelfeld" in pos:
        return "OM"
    elif "zentrales mittelfeld" in pos:
        return "ZM"
    elif "linkes mittelfeld" in pos or "linksaußen" in pos:
        return "LF"
    elif "rechtes mittelfeld" in pos or "rechtsaußen" in pos:
        return "RF"
    elif "mittelstürmer" in pos or "hängende spitze" in pos or "stürmer" in pos:
        return "MS"
    elif "verteidiger" in pos or "abwehr" in pos:
        return "IV"
    elif "mittelfeld" in pos:
        return "ZM"
    return "ZM"

FORMATION_SLOTS = {
    "4-2-3-1": ["TW", "LV", "IV-L", "IV-R", "RV", "ZM-L", "ZM-R", "LF", "OM", "RF", "MS"],
    "3-4-2-1": ["TW", "IV-L", "IV-C", "IV-R", "LM", "ZM-L", "ZM-R", "RM", "OM-L", "OM-R", "MS"],
    "4-1-4-1": ["TW", "LV", "IV-L", "IV-R", "RV", "DM", "LM", "ZM-L", "ZM-R", "RM", "MS"],
    "3-4-1-2": ["TW", "IV-L", "IV-C", "IV-R", "LM", "ZM-L", "ZM-R", "RM", "OM", "MS-L", "MS-R"],
    "4-4-2":   ["TW", "LV", "IV-L", "IV-R", "RV", "LM", "ZM-L", "ZM-R", "RM", "MS-L", "MS-R"],
    "4-3-3":   ["TW", "LV", "IV-L", "IV-R", "RV", "DM", "ZM-L", "ZM-R", "LF", "RF", "MS"]
}

SLOT_CATEGORY_MAPPING = {
    "TW":   ("TW", []),
    "LV":   ("LV", ["IV", "RV", "ZM"]),
    "IV-L": ("IV", ["LV", "RV"]),
    "IV-C": ("IV", ["LV", "RV"]),
    "IV-R": ("IV", ["RV", "LV"]),
    "RV":   ("RV", ["IV", "LV", "ZM"]),
    "DM":   ("DM", ["ZM", "IV", "OM"]),
    "LM":   ("LV", ["LF", "OM", "ZM"]),
    "RM":   ("RV", ["RF", "OM", "ZM"]),
    "ZM-L": ("ZM", ["DM", "OM"]),
    "ZM-R": ("ZM", ["DM", "OM"]),
    "OM":   ("OM", ["ZM", "LF", "RF"]),
    "OM-L": ("OM", ["LF", "ZM", "RF"]),
    "OM-R": ("OM", ["RF", "ZM", "LF"]),
    "LF":   ("LF", ["OM", "RF", "MS"]),
    "RF":   ("RF", ["OM", "LF", "MS"]),
    "MS":   ("MS", ["LF", "RF", "OM"]),
    "MS-L": ("MS", ["LF", "RF", "OM"]),
    "MS-R": ("MS", ["RF", "LF", "OM"])
}

client = get_supabase_client()
res = client.table("clubs").select("*").execute()

for club in res.data:
    sp = club.get("squad_profile", {})
    formation = sp.get("last_match_formation") or sp.get("most_used_formation_2027") or "4-2-3-1"
    if formation not in FORMATION_SLOTS:
        formation = "4-2-3-1"
        
    squad = sp.get("full_squad_2027", [])
    if not squad:
        continue
        
    # Sort squad by parsed market value descending
    sorted_squad = sorted(squad, key=lambda p: parse_market_value(p.get("market_value")), reverse=True)
    
    # Filter out goalkeepers for outfield selection
    gks = [p for p in sorted_squad if get_position_category(p.get("position")) == "TW"]
    outfield = [p for p in sorted_squad if get_position_category(p.get("position")) != "TW"]
    
    assigned_names = set()
    starters = []
    
    slots = FORMATION_SLOTS[formation]
    
    for slot in slots:
        if slot == "TW":
            selected = gks[0] if gks else (outfield[0] if outfield else None)
        else:
            primary_cat, fallback_cats = SLOT_CATEGORY_MAPPING.get(slot, ("ZM", []))
            
            # 1. Try direct primary position match among outfield players
            candidates = [p for p in outfield if p["name"] not in assigned_names and get_position_category(p.get("position")) == primary_cat]
            
            # 2. Try fallback categories
            if not candidates:
                for fb_cat in fallback_cats:
                    candidates = [p for p in outfield if p["name"] not in assigned_names and get_position_category(p.get("position")) == fb_cat]
                    if candidates:
                        break
                        
            # 3. Any remaining unassigned outfield player
            if not candidates:
                candidates = [p for p in outfield if p["name"] not in assigned_names]
                
            selected = candidates[0] if candidates else None
            
        if selected:
            assigned_names.add(selected["name"])
            starters.append({
                "slot": slot,
                "name": selected["name"],
                "position": selected["position"],
                "age": selected.get("age", "25"),
                "foot": selected.get("foot", "Rechts"),
                "contract": selected.get("contract_until", "30.06.2027"),
                "market_value": selected.get("market_value", "-"),
                "profile_url": selected.get("profile_url"),
                "minutes": 1400 + (11 - len(starters)) * 80
            })

    print(f"\n==========================================")
    print(f"CLUB: {club['name']} | Formation: {formation} | Starters: {len(starters)}")
    print(f"==========================================")
    for st in starters:
        print(f"  [{st['slot']:5s}] {st['name']:25s} | Pos: {st['position']:28s} | MV: {st['market_value']}")
