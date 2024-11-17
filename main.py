import json
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# MongoDB connection setup
def get_user_skills(user_name):
    try:
        client = MongoClient("mongodb+srv://mindmelders05:mindmelders05@cluster0.cltov.mongodb.net/myDatabase?retryWrites=true&w=majority")  # MongoDB connection string
        db = client['myDatabase']
        collection = db['users']
        
        # Fetch user data based on name
        user_data = collection.find_one({"name": user_name})
        if user_data and "skills" in user_data:
            skills = set(user_data["skills"].lower().split(","))
            print(f"Successfully fetched skills for user: {user_name}")
            return skills
        else:
            print(f"Skills not found for user: {user_name}")
            return set()
    except Exception as e:
        print(f"Error while fetching data from MongoDB: {e}")
        return set()

# Function to fetch job skills from JSON and filter based on exact role match
def get_job_skills_from_json(role):
    try:
        with open('dataset.json', 'r') as file:
            jobs = json.load(file)
        
        # Debugging output to check the first job
        print("First job in JSON:", jobs[0])
        
        # Match the role exactly (case-sensitive comparison) 
        matching_jobs = [job for job in jobs if job.get("title", "").strip().lower() == role.strip().lower()]
        
        if matching_jobs:
            print(f"Successfully fetched matching job skills for role: {role}")
            return matching_jobs[0]  # Return only the first match
        else:
            print(f"No matching jobs found for role: {role}")
        
        return None
    except Exception as e:
        print("Error reading JSON file:", e)
        return None

# Function to compare user skills and job requirements
def compare_skills(user_skills, job_skills):
    missing_skills = job_skills - user_skills
    extra_skills = user_skills - job_skills
    
    print(f"Missing Skills: {missing_skills}")
    print(f"Extra Skills: {extra_skills}")
    
    if not missing_skills:
        print("You have all the required skills for this job.")
    else:
        print("You need to improve in the following areas.")

# Example usage
user_name = "roshini"  # Replace with actual user name
user_skills = get_user_skills(user_name)  # Fetch skills for this user

# Fetch matching job skills from JSON based on role
role = "Frontend Developer"  # Example role, replace with the actual role
matching_job = get_job_skills_from_json(role)

# If there is a matching job, compare the skills
if matching_job:
    print(f"Job Title: {matching_job['title']}")
    print(f"Required Skills: {matching_job['skills_required']}")
    
    job_skills = set(skill.lower() for skill in matching_job['skills_required'])
    compare_skills(user_skills, job_skills)
else:
    print("No matching jobs found.")



from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def analyze_skill_similarity(user_skills, job_skills):
    user_skills_text = " ".join(user_skills)
    job_skills_text = " ".join(job_skills)
    
    # Convert skills into vector format using TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([user_skills_text, job_skills_text])
    
    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    
    return cosine_sim[0][0]


similarity_score = analyze_skill_similarity(user_skills, job_skills)
print(f"Similarity Score: {similarity_score}")
