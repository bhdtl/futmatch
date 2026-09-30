"""
FutMatch Pro — Master Data Pipeline Orchestrator
Executes all 6 data ingestion & enrichment modules in strict sequence to ensure
100% complete, non-truncated squad lists, live PPDA metrics, 11-starter formations, and Reep IDs.
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from app.data_pipeline.scrape_live_transfermarkt import run_live_transfermarkt_sync
from app.data_pipeline.ingest_pure_live_rolling import run_pure_live_rolling_ingestion
from app.data_pipeline.ingest_dynamic_minutes_starters import run_dynamic_minutes_starters_ingestion
from app.data_pipeline.ingest_wyscout_player_roles import run_wyscout_player_roles_ingestion
from app.data_pipeline.detect_live_formation import run_dynamic_formation_detection
from app.data_pipeline.resolve_entities_reep import run_reep_entity_resolution_sync
from app.data_pipeline.compute_player_similarity_benchmarks import run_player_similarity_benchmarking_sync

def execute_master_pipeline():
    print("============================================================")
    print("[Pipeline] FutMatch Pro: MASTER DATA PIPELINE EXECUTION")
    print("============================================================")
    
    print("\n[Step 1/7] Scraping Live 2026/2027 Transfermarkt Squads & Coaches...")
    run_live_transfermarkt_sync()

    print("\n[Step 2/7] Ingesting Live Rolling Tactical Metrics & Coach PPDA...")
    run_pure_live_rolling_ingestion()

    print("\n[Step 3/7] Ingesting 100% Dynamic Player Minutes & Live Starting XI Rosters...")
    run_dynamic_minutes_starters_ingestion()

    print("\n[Step 4/7] Enriching WyScout Positional Roles & Behaviors...")
    run_wyscout_player_roles_ingestion()

    print("\n[Step 5/7] Detecting Dynamic Tactical Formations...")
    run_dynamic_formation_detection()

    print("\n[Step 6/7] Executing Reep Entity Resolution & Cross-Provider Sync...")
    run_reep_entity_resolution_sync()

    print("\n[Step 7/7] Computing Player Similarity Vectors & Positional Medians...")
    run_player_similarity_benchmarking_sync()

    print("\n============================================================")
    print("[COMPLETED] MASTER DATA PIPELINE FULLY COMPLETED & SYNCED TO SUPABASE!")
    print("============================================================")
    return True

if __name__ == "__main__":
    execute_master_pipeline()
