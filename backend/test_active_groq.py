import os
import asyncio
from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv(".env")
key = os.getenv("GROQ_API_KEY", "")

async def test_active_models():
    client = AsyncGroq(api_key=key)
    models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b", "groq/compound-mini"]
    for m in models:
        try:
            resp = await client.chat.completions.create(
                model=m,
                messages=[{"role": "user", "content": "Generate 1 interview question in json: [{\"text\": \"What is an interface in Java?\", \"category\": \"technical\", \"difficulty\": \"easy\"}]"}]
            )
            print(f"SUCCESS with {m}:", resp.choices[0].message.content[:200])
        except Exception as e:
            print(f"FAILED with {m}:", e)

asyncio.run(test_active_models())
