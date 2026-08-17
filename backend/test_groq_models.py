import urllib.request
import json
import ssl
import os
from dotenv import load_dotenv

load_dotenv(".env")
key = os.getenv("GROQ_API_KEY")

req = urllib.request.Request(
    "https://api.groq.com/openai/v1/models",
    headers={
        "Authorization": f"Bearer {key}",
    }
)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        models = [m["id"] for m in data.get("data", [])]
        print("Available Groq Models:")
        for m in models:
            print(" -", m)
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())
