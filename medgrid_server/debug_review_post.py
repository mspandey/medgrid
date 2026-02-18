
import requests
import json

BASE_URL = 'http://localhost:8001/api'

def debug_review():
    # 1. Login/Register as Patient to get ID
    email = "debug_patient@example.com"
    password = "password123"
    
    print(f"1. Authenticating as {email}...")
    # Try login first
    login_res = requests.post(f'{BASE_URL}/auth/patient/login', data={'email': email, 'password': password})
    
    user_id = None
    
    if login_res.status_code == 200:
        user_id = login_res.json()['user']['id']
        print(f"   Logged in. User ID: {user_id}")
    else:
        print("   Login failed, trying to register...")
        # Register if not exists
        reg_res = requests.post(f'{BASE_URL}/auth/patient/register', data={
            'name': 'Debug Patient',
            'email': email,
            'password': password,
            'phone': '1234567890',
            'age': 30,
            'bloodGroup': 'O+'
        })
        if reg_res.status_code == 201:
            user_id = reg_res.json()['user']['id']
            print(f"   Registered. User ID: {user_id}")
        else:
            print(f"   Registration failed: {reg_res.text}")
            return

    if not user_id:
        print("Could not get user ID.")
        return

    # 2. Get a Hospital ID
    print("\n2. Fetching a hospital...")
    hospitals_res = requests.get(f'{BASE_URL}/hospitals/')
    if hospitals_res.status_code != 200 or not hospitals_res.json():
        print("   Failed to fetch hospitals.")
        return
    
    hospital_id = hospitals_res.json()[0]['id']
    print(f"   Using Hospital ID: {hospital_id}")

    # 3. Submit Review
    print("\n3. Submitting Review...")
    payload = {
        'hospital': hospital_id, # Frontend sends this as string sometimes, let's try strict types
        'patient': user_id,
        'rating': 4,
        'comment': 'Debug comment from script'
    }
    
    print(f"   Payload: {json.dumps(payload, indent=2)}")
    
    review_res = requests.post(f'{BASE_URL}/reviews/', json=payload, headers={'Content-Type': 'application/json'})
    
    with open('debug_output.txt', 'w', encoding='utf-8') as f:
        f.write(f"Request URL: {review_res.url}\n")
        f.write(f"Status Code: {review_res.status_code}\n")
        f.write(f"Response Body:\n{review_res.text}\n")

if __name__ == '__main__':
    debug_review()
