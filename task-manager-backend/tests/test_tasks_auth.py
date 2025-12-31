def get_token(client):
    
    signup_payload = {
        "username": "testuser",
        "password": "TestPass123"
    }

    client.post("/auth/signup", json=signup_payload)

    
    login_payload = {
        "username": "testuser",
        "password": "TestPass123"
    }

    res = client.post(
        "/auth/login",
        data=login_payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

    print("LOGIN RESPONSE:", res.text)

    assert res.status_code == 200, f"Login failed: {res.text}"

    data = res.json()
    assert "access_token" in data, "Missing token in login response"

    return data["access_token"]


def test_create_task_with_auth(client):
    
    token = get_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    
    payload = {
    "title": "Auth test task",
    "description": "Testing authenticated task creation",
    "category": "Testing",
    "priority": 1,                     
    "deadline": "2050-01-01T00:00:00",
    "status": "Pending"
}
    res = client.post("/tasks/", json=payload, headers=headers)

    print("CREATE TASK RESPONSE:", res.text)

    
    assert res.status_code in (200, 201), f"Unexpected status: {res.status_code} - {res.text}"

    data = res.json()
    assert data["title"] == payload["title"]
