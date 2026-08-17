import os
import asyncio
from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv(".env")
key = os.getenv("GROQ_API_KEY", "")

async def list_models():
    client = AsyncGroq(api_key=key)
    try:
        models = await client.models.list()
        print("Active Groq models:")
        for m in models.data:
            print(" ->", m.id)
    except Exception as e:
        print("Error listing models:", e)

asyncio.run(list_models())
