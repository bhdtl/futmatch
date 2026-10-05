import sys
import re
from pathlib import Path

sys.path.append(str(Path(__file__).parent))
from app.db.supabase_client import get_supabase_client
from app.services.scout_ai_engine import ScoutAIEngine, ROLE_DEFINITIONS

# Specific Player Overrides for 100% Tactical Precision
PLAYER_ROLE_OVERRIDES = {
    # FC Bayern München
    "manuel neuer": ("SWEEPER_KEEPER", "CLASSIC_GOALKEEPER", "Pionier des mitspielenden Torwartspiels (Sweeper Keeper)"),
    "sven ulreich": ("CLASSIC_GOALKEEPER", "SWEEPER_KEEPER", "Linienfokussierter Ersatz-Torwart (Shot-Stopper)"),
    "jonas urbig": ("SWEEPER_KEEPER", "CLASSIC_GOALKEEPER", "Mitspielendes Torwart-Talent (Sweeper Keeper)"),
    "dayot upamecano": ("BALL_PLAYING_DEFENDER", "STOPPER_IV", "Athletischer Aufbauspieler (BPD)"),
    "jonathan tah": ("BALL_PLAYING_DEFENDER", "NO_NONSENSE_CB", "Zweikampfstarker Aufbauspieler (BPD / Stopper)"),
    "min-jae kim": ("NO_NONSENSE_CB", "BALL_PLAYING_DEFENDER", "Kompromissloser Zweikampf-Stopper (Monster-IV)"),
    "hiroki ito": ("BALL_PLAYING_DEFENDER", "INVERTED_WING_BACK", "Linksfüßiger Aufbauspieler & Hybrid-IV"),
    "nathaniel brown": ("WING_BACK", "INVERTED_WING_BACK", "Dynamischer Schienenspieler (Complete Wing-Back)"),
    "alphonso davies": ("WING_BACK", "INSIDE_FORWARD_IW", "Elite High-Speed Schienenspieler (Speed/Dribbling)"),
    "josip stanisic": ("INVERTED_WING_BACK", "WIDE_CENTRE_BACK", "Taktisch disziplinierter Inverted Full-Back"),
    "konrad laimer": ("WING_BACK", "BOX_TO_BOX_MIDFIELDER", "Pressingstarker Allrounder & Außenverteidiger"),
    "sacha boey": ("WING_BACK", "INVERTED_WING_BACK", "Zweikampfstarker Schienenspieler"),
    "aleksandar pavlovic": ("DEEP_LYING_PLAYMAKER", "ANCHOR_BWM", "Taktgeber & Strategischer Aufbauspieler (DLP)"),
    "joshua kimmich": ("DEEP_LYING_PLAYMAKER", "INVERTED_WING_BACK", "Metronom & Spielgestalter aus der Tiefe (DLP)"),
    "tom bischof": ("ADVANCED_PLAYMAKER_MEZZALA", "DEEP_LYING_PLAYMAKER", "Kreativer Halbraum-Spielmacher (MEZ)"),
    "jamal musiala": ("ADVANCED_PLAYMAKER_MEZZALA", "INSIDE_FORWARD_IW", "Dribbelstarker Kreativknotenpunkt (AP / MEZ)"),
    "luis díaz": ("INSIDE_FORWARD_IW", "CLASSIC_WINGER", "Torgefährlicher Flügelstürmer (Inside Forward)"),
    "luis diaz": ("INSIDE_FORWARD_IW", "CLASSIC_WINGER", "Torgefährlicher Flügelstürmer (Inside Forward)"),
    "michael olise": ("INSIDE_FORWARD_IW", "ADVANCED_PLAYMAKER_MEZZALA", "Spieleentscheidender Inside Forward & Spielmacher"),
    "serge gnabry": ("INSIDE_FORWARD_IW", "SHADOW_STRIKER", "Abschlussstarker Flügelstürmer & Schattenstürmer"),
    "harry kane": ("FALSE_NINE_DLF", "TARGET_FORWARD", "Spielgestaltender Neuner & Strafraum-Knipser (F9/AF)"),

    # Borussia Dortmund
    "gregor kobel": ("SWEEPER_KEEPER", "CLASSIC_GOALKEEPER", "Moderne Nummer 1 (Sweeper Keeper)"),
    "nico schlotterbeck": ("BALL_PLAYING_DEFENDER", "NO_NONSENSE_CB", "Vertikalstarker Aufbauspieler (BPD)"),
    "waldemar anton": ("NO_NONSENSE_CB", "BALL_PLAYING_DEFENDER", "Physischer Zweikämpfer & Führungsspeiler"),
    "daniel svensson": ("WING_BACK", "INVERTED_WING_BACK", "Dynamischer Schienenspieler (Wing-Back)"),
    "julian ryerson": ("WING_BACK", "INVERTED_WING_BACK", "Kampfstarker Schienenspieler"),
    "felix nmecha": ("BOX_TO_BOX_MIDFIELDER", "ADVANCED_PLAYMAKER_MEZZALA", "Physischer Box-To-Box Allrounder"),
    "jobe bellingham": ("BOX_TO_BOX_MIDFIELDER", "ADVANCED_PLAYMAKER_MEZZALA", "Dynamisches Mittelfeld-Talent (BBM)"),
    "ethan nwaneri": ("ADVANCED_PLAYMAKER_MEZZALA", "INSIDE_FORWARD_IW", "Kreativer Halbraum-Spielmacher"),
    "konstantinos karetsas": ("ADVANCED_PLAYMAKER_MEZZALA", "INSIDE_FORWARD_IW", "Technisch versierter 10er"),
    "maximilian beier": ("ADVANCED_FORWARD", "SHADOW_STRIKER", "Tiefenläufer & Stoßstürmer (AF)"),
    "serhou guirassy": ("TARGET_FORWARD", "ADVANCED_FORWARD", "Physischer Zielspieler & Strafraum-Knipser (TF/AF)"),

    # Bayer 04 Leverkusen
    "mark flekken": ("SWEEPER_KEEPER", "CLASSIC_GOALKEEPER", "Mitspielender Bundesliga-Torwart"),
    "jarell quansah": ("BALL_PLAYING_DEFENDER", "NO_NONSENSE_CB", "Moderne Innenverteidiger-Hoffnung (BPD)"),
    "edmond tapsoba": ("BALL_PLAYING_DEFENDER", "NO_NONSENSE_CB", "Ruhiger Aufbauspieler & Zweikämpfer"),
    "miguel gutiérrez": ("INVERTED_WING_BACK", "WING_BACK", "Einrückender Aufbauspieler (IWB - Grimaldo-Typ)"),
    "guéla doué": ("WING_BACK", "INVERTED_WING_BACK", "Athletischer Außenverteidiger"),
    "equi fernández": ("DEEP_LYING_PLAYMAKER", "ANCHOR_BWM", "Taktgeber & Balleroberer (DLP/BWM)"),
    "aleix garcía": ("DEEP_LYING_PLAYMAKER", "BOX_TO_BOX_MIDFIELDER", "Metronom & Passgeber aus der Tiefe"),
    "ibrahim maza": ("ADVANCED_PLAYMAKER_MEZZALA", "INSIDE_FORWARD_IW", "Kreativer 10er & Dribbler"),
    "moussa diaby": ("INSIDE_FORWARD_IW", "CLASSIC_WINGER", "High-Speed Flügelstürmer (Inside Forward)"),
    "patrik schick": ("ADVANCED_FORWARD", "TARGET_FORWARD", "Strafraum-Knipser & Stoßstürmer (AF)"),
    "victor boniface": ("TARGET_FORWARD", "ADVANCED_FORWARD", "Physisches Kraftpaket & Zielspieler (TF/AF)")
}

client = get_supabase_client()
res = client.table("clubs").select("*").execute()

for club in res.data:
    sp = club.get("squad_profile", {})
    squad = sp.get("full_squad_2027", [])
    print(f"\n==========================================")
    print(f"CLUB: {club['name']} | Squad size: {len(squad)}")
    print(f"==========================================")
    for p in squad[:8]:
        name = p.get("name", "")
        name_clean = name.lower().strip()
        pos = p.get("position", "")
        
        if name_clean in PLAYER_ROLE_OVERRIDES:
            r1_key, r2_key, arch = PLAYER_ROLE_OVERRIDES[name_clean]
            r1_def = ROLE_DEFINITIONS[r1_key]
            r2_def = ROLE_DEFINITIONS[r2_key]
            t1 = r1_def["label"].split("(")[0].strip()
            t2 = r2_def["label"].split("(")[0].strip()
            role_str = f"82% {t1} • 18% {t2}"
        else:
            arch = "Profi-Athlet"
            role_str = f"75% {pos} (Standard)"
            
        print(f"  {name:25s} | {pos:22s} | {role_str:55s} | {arch}")
