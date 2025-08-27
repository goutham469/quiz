import csv
import json
import requests

# ----------------------------
# Config
# ----------------------------
ENDPOINT = "http://localhost:4000/quiz/add-questions"
DATA_FILE = "clean_general_aptitude_dataset.csv"  # Change to your CSV or JSON file
CATEGORY = "Logical Reasoning"  # Default category

# ----------------------------
# Helper: Convert CSV to API format
# ----------------------------
def csv_to_api_format(file_path):
    questions = []
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')  # <-- Note delimiter
        for row in reader:
            options = [row['Option A'], row['Option B'], row['Option C'], row['Option D']]
            correct_index = {'A':0,'B':1,'C':2,'D':3}.get(row['Answer'].strip(), 0)
            questions.append({
                "question": row['Question'],
                "options": options,
                "correct_option_index": correct_index,
                "category": CATEGORY
            })
    return questions

# ----------------------------
# Helper: Convert JSON to API format
# ----------------------------
def json_to_api_format(file_path):
    questions = []
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for item in data:
            options = item.get('options', [])
            correct_index = item.get('correct_option_index', 0)
            questions.append({
                "question": item.get('question', ''),
                "options": options,
                "correct_option_index": correct_index,
                "category": item.get('category', CATEGORY)
            })
    return questions

# ----------------------------
# Choose input file type
# ----------------------------
if DATA_FILE.endswith('.csv'):
    payload = csv_to_api_format(DATA_FILE)
elif DATA_FILE.endswith('.json'):
    payload = json_to_api_format(DATA_FILE)
else:
    raise ValueError("Unsupported file type. Use CSV or JSON.")

# ----------------------------
# Send POST request
# ----------------------------
response = requests.post(ENDPOINT, json=payload)

if response.status_code == 200:
    print("Questions uploaded successfully!")
else:
    print(f"Failed to upload questions. Status code: {response.status_code}")
    print(response.text)
