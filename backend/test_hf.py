import urllib.request
import json
import ssl
import os

token = os.getenv("HF_API_TOKEN", "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")
model = "Qwen/Qwen2.5-7B-Instruct"

payload = {
    "model": model,
    "messages": [
        {"role": "user", "content": "Write a python script that returns 'hello world' in a valid JSON object. Just return the JSON."}
    ],
    "temperature": 0.9,
}
req = urllib.request.Request(
    "https://router.huggingface.co/v1/chat/completions",
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    },
    method="POST",
)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print("Success:", data["choices"][0]["message"]["content"])
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())
