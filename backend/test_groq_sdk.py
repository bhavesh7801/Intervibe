import os
import asyncio
from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv(".env")
key = os.getenv("GROQ_API_KEY", "")

async def test_groq():
    client = AsyncGroq(api_key=key)
    models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"]
    for m in models:
        try:
            resp = await client.chat.completions.create(
                model=m,
                messages=[{"role": "user", "content": "Say 'hello' in JSON: {\"msg\": \"hello\"}"}],
                response_format={"type": "json_object"}
            )
            print(f"SUCCESS with {m}:", resp.choices[0].message.content)
            return m
        except Exception as e:
            print(f"FAILED with {m}:", str(e)[:150])

asyncio.run(test_groq())
