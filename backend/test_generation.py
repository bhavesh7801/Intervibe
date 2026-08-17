import urllib.request
import json

url = "http://127.0.0.1:8000/api/questions/generate"
payload = {
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "question_type": "coding",
    "is_dsa_or_coding": True
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req, timeout=30) as response:
        res = json.loads(response.read().decode())
        print("Success!")
        print(json.dumps(res, indent=2))
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())
