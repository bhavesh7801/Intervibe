import urllib.request
import json
import time

url = "http://127.0.0.1:8000/api/assessment/generate-exam"
payload = {
    "target_role": "AI/ML Engineer",
    "num_questions": 5,
    "difficulty": "Hard"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

print(f"Sending request to {url} for AI/ML...")
start = time.time()
try:
    with urllib.request.urlopen(req, timeout=120) as response:
        res = json.loads(response.read().decode())
        print(f"\n--- SUCCESS! (Took {time.time()-start:.1f}s) ---")
        print(json.dumps(res, indent=2))
except Exception as e:
    print(f"\n--- ERROR! (Took {time.time()-start:.1f}s) ---")
    print(e)
    if hasattr(e, 'read'):
        print(e.read().decode())
