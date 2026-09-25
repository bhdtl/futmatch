"""
Clubs Database with Squad Metrics, Formation Suitability, and Contract Expiry Stats
"""

CLUBS_DATABASE = [
    {
        "id": "CLB-STP",
        "name": "FC St. Pauli",
        "logo_short": "STP",
        "league": "Bundesliga / 2. Bundesliga",
        "primary_tactics": ["3-4-2-1", "3-5-2"],
        "target_positions": ["IV", "LV", "DM"],
        "preferred_foot": "Links",
        "ideal_age_range": (20, 27),
        "contract_expiring_count": { "IV": 2, "LV": 1, "DM": 0, "MS": 1 },
        "squad_profile": {
            "pressing_intensity": "High",
            "build_up_style": "Short passing from back",
            "vacancies": "Vertrag auf IV läuft im Sommer aus, Coach spielt Dreierkette. Linksfuß als Aufbau-IV gesucht."
        },
        "base_rating": 88
    },
    {
        "id": "CLB-KVM",
        "name": "KV Mechelen",
        "logo_short": "KVM",
        "league": "Jupiler Pro League (Belgien)",
        "primary_tactics": ["4-3-3", "4-2-3-1"],
        "target_positions": ["IV", "ZM", "RF"],
        "preferred_foot": "Links",
        "ideal_age_range": (21, 28),
        "contract_expiring_count": { "IV": 1, "ZM": 2, "RF": 0 },
        "squad_profile": {
            "pressing_intensity": "Medium-High",
            "build_up_style": "Vertical transition",
            "vacancies": "Stamm-IV vor Wechsel in Serie A. Suchen ballfesten Innenverteidiger für hohes Pressingsystem."
        },
        "base_rating": 85
    },
    {
        "id": "CLB-SVE",
        "name": "SV Elversberg",
        "logo_short": "SVE",
        "league": "2. Bundesliga",
        "primary_tactics": ["4-2-3-1", "4-3-3"],
        "target_positions": ["IV", "LV", "ZM"],
        "preferred_foot": "Beidfüßig",
        "ideal_age_range": (19, 26),
        "contract_expiring_count": { "IV": 1, "LV": 1, "ZM": 1 },
        "squad_profile": {
            "pressing_intensity": "High",
            "build_up_style": "Possession-based build-up",
            "vacancies": "Spielstarke Abwehr benötigt. Hohe Passquote im Spielaufbau gefordert (K-Means Match 89%)."
        },
        "base_rating": 84
    },
    {
        "id": "CLB-F95",
        "name": "Fortuna Düsseldorf",
        "logo_short": "F95",
        "league": "2. Bundesliga",
        "primary_tactics": ["4-4-2", "4-2-3-1"],
        "target_positions": ["IV", "MS", "RV"],
        "preferred_foot": "Rechts",
        "ideal_age_range": (22, 29),
        "contract_expiring_count": { "IV": 2, "MS": 1, "RV": 1 },
        "squad_profile": {
            "pressing_intensity": "Medium",
            "build_up_style": "Direct counter-attack",
            "vacancies": "Zwei Abwehrverträge laufen aus. Budget für ablösefreie Spieler reserviert."
        },
        "base_rating": 83
    },
    {
        "id": "CLB-GNT",
        "name": "KAA Gent",
        "logo_short": "GNT",
        "league": "Jupiler Pro League (Belgien)",
        "primary_tactics": ["3-5-2", "3-4-3"],
        "target_positions": ["IV", "MS", "DM"],
        "preferred_foot": "Rechts",
        "ideal_age_range": (21, 28),
        "contract_expiring_count": { "IV": 1, "MS": 2, "DM": 0 },
        "squad_profile": {
            "pressing_intensity": "High",
            "build_up_style": "Wing-play overload",
            "vacancies": "Kader-Tiefe auf IV gering. Suchen physisch starken Vorstopper als Ergänzung."
        },
        "base_rating": 82
    },
    {
        "id": "CLB-KSV",
        "name": "Holstein Kiel",
        "logo_short": "KSV",
        "league": "Bundesliga",
        "primary_tactics": ["3-4-1-2", "3-5-2"],
        "target_positions": ["LV", "RV", "ZM"],
        "preferred_foot": "Links",
        "ideal_age_range": (20, 27),
        "contract_expiring_count": { "LV": 2, "RV": 0, "ZM": 1 },
        "squad_profile": {
            "pressing_intensity": "High",
            "build_up_style": "Aggressive wing-backs",
            "vacancies": "Schienenspieler links dringend gesucht für 3-5-2 System. Hohes Flankenvolumen nötig."
        },
        "base_rating": 89
    },
    {
        "id": "CLB-SGG",
        "name": "Greuther Fürth",
        "logo_short": "SGG",
        "league": "2. Bundesliga",
        "primary_tactics": ["3-4-1-2", "4-3-1-2"],
        "target_positions": ["MS", "ZM", "LF"],
        "preferred_foot": "Rechts",
        "ideal_age_range": (18, 25),
        "contract_expiring_count": { "MS": 2, "ZM": 1, "LF": 0 },
        "squad_profile": {
            "pressing_intensity": "High",
            "build_up_style": "High-intensity transition",
            "vacancies": "Top-Torschütze verlässt den Verein im Sommer. Dringende Vakanz im Sturmzentrum (Target Man)."
        },
        "base_rating": 86
    }
]
