import os
import sys
from dotenv import load_dotenv

load_dotenv()

REQUIRED = ["OPENAI_API_KEY"]
missing = [k for k in REQUIRED if not os.getenv(k)]

if missing:
    print("환경변수 누락:", missing)
    print(".env 파일을 확인하세요. 템플릿: .env.example")
    sys.exit(1)

print("환경변수 OK")