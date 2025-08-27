import os
import json
import mysql.connector

# MySQL connection
db = mysql.connector.connect(
    host="",
    user=" ",          # change if needed
    password="",  # change if needed
    database=""          # change if needed
)
cursor = db.cursor()

# Root folder where your question categories are stored
BASE_DIR = r"D:\visual studio\full stack projects\quiz2\questions"

def insert_many_questions(questions_batch):
    try :
        sql = """
            INSERT INTO questions (question, options, correct_option_index, category, subCategory, difficulty)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(sql, questions_batch)
        db.commit()
        print(f"✅ Inserted {len(questions_batch)} questions")
        return True
    except Exception as e :
        return False


def process_json_file(file_path, category):
    subCategory = (
        os.path.basename(file_path)
        .replace("_questions.json", "")
        .replace(".json", "")
        .replace("_", " ")
    )

    with open(file_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            batch = []
            for q in data:
                batch.append((
                    q["question"],
                    json.dumps(q["options"]),
                    q["correct_option_index"],
                    category,
                    subCategory,
                    q.get("difficulty", "medium")  # default medium if not present
                ))
            
            if batch:
                status = insert_many_questions(batch)
                if status :
                    print(f"insertion success for {}")

        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")

def process_all_folders(base_dir):
    for root, dirs, files in os.walk(base_dir):
        category = os.path.basename(root)  # folder name = category
        for file in files:
            if file.endswith(".json"):
                process_json_file(os.path.join(root, file), category)

if __name__ == "__main__":
    process_all_folders(BASE_DIR)
    cursor.close()
    db.close()
    print("🎉 All questions inserted successfully!")
