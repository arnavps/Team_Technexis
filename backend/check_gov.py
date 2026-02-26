import httpx
import json

def check():
    url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000018f6d2aeef8304ec27142be2cf3ef3688&format=json&limit=1"
    res = httpx.get(url)
    print(f"Status: {res.status_code}")
    print(res.text[:500])

if __name__ == "__main__":
    check()
