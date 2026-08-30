import argparse
import json
import os
import sys

import requests


URL = "https://api.openai.com/v1/responses"


def ask_openai(query, api_key):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload = {
        "model": "gpt-4o-mini",
        "input": query,
    }
    response = requests.post(URL, headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    return response.json()


def main():
    parser = argparse.ArgumentParser(description="OpenAI Responses API client")
    parser.add_argument("query", nargs="?", default="ChatGPT", help="Topik pencarian")
    args = parser.parse_args()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY belum diatur.", file=sys.stderr)
        print("PowerShell: $env:OPENAI_API_KEY = 'API_KEY_ANDA'", file=sys.stderr)
        return 1

    try:
        result = ask_openai(args.query, api_key)
    except requests.RequestException as error:
        print(f"Request OpenAI gagal: {error}", file=sys.stderr)
        return 1
    except ValueError as error:
        print(f"Response OpenAI bukan JSON valid: {error}", file=sys.stderr)
        return 1

    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
