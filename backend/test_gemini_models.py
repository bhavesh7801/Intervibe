import os
import json
import ssl
import urllib.request
from dotenv import load_dotenv

load_dotenv(".env")
key = os.getenv("GEMINI_API_KEY", "")

models = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-flash-latest"
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for m in models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={key}"
    payload = {
        "contents": [{"parts": [{"text": "Say 'hello world' in JSON format."}]}],
        "generationConfig": {"responseMimeType": "application/json"}
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            print(f"✅ Model {m} SUCCESS:", data["candidates"][0]["content"]["parts"][0]["text"])
            break
    except Exception as e:
        print(f"❌ Model {m} failed:", e)
