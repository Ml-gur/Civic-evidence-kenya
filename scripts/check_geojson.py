import json

with open("wards.geojson", "r", encoding="utf-8") as f:
    data = json.load(f)

print("Number of features:", len(data["features"]))
if data["features"]:
    print("Properties of first feature:", data["features"][0]["properties"])
