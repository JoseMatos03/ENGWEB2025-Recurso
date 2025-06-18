import json

INPUT_FILE = "./dataset.json"
OUTPUT_FILE = "./dataset_ready.json"

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

# Substituir "id" por "_id"
for doc in data:
    if "id" in doc:
        doc["_id"] = doc["id"]
        del doc["id"]

# Gravar o novo dataset
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Dataset normalizado guardado em {OUTPUT_FILE}")
