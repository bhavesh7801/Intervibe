import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    "https://api.groq.com/openai/v1/models",
    headers={"Authorization": "Bearer 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"}
)
try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        data = json.loads(resp.read().decode())
        models = [m["id"] for m in data["data"]]
        print("Groq Models:", models)
except Exception as e:
    import urllib.error
    if isinstance(e, urllib.error.HTTPError):
        print("Groq Error:", e.code, e.read().decode())
    else:
        print("Groq Error:", e)

req2 = urllib.request.Request(
    "https://generativelanguage.googleapis.com/v1beta/models?key=AQ.Ab8RN6K_Q8zyHm8nS5SatxBOsFBM8GPH8lDlqWwuuiX0Y-FLug"
)
try:
    with urllib.request.urlopen(req2, context=ctx) as resp:
        data = json.loads(resp.read().decode())
        models = [m["name"] for m in data.get("models", [])]
        print("Gemini Models:", models)
except Exception as e:
    import urllib.error
    if isinstance(e, urllib.error.HTTPError):
        print("Gemini Error:", e.code, e.read().decode())
    else:
        print("Gemini Error:", e)
