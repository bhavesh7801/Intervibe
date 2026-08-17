import sys
import os

backend_dir = r"c:\Users\ratho\OneDrive\Desktop\coding\ai interview prep platform\backend"
sys.path.append(backend_dir)
os.chdir(backend_dir)

from api.question_generation import _call_llm, build_llm_prompt, _extract_json
import json

print("Testing direct LLM Generation with NEW models (gemma2-9b-it, Mistral-7B, Gemini-3.5-flash)...")

system, user = build_llm_prompt("Arrays", "Hard", [], None)
try:
    raw = _call_llm(system, user)
    data = _extract_json(raw)
    print("\n--- AI GENERATION SUCCESS! ---")
    print(json.dumps(data, indent=2))
except Exception as e:
    print(f"\n--- AI GENERATION FAILED ---")
    print(e)
