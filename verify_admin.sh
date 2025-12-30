#!/bin/bash
TOKEN=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"email":"admin@rosechemicals.com","password":"Admin@123"}' http://127.0.0.1:5000/api/auth/login | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"

echo "--- Analytics ---"
curl -s -H "Authorization: Bearer $TOKEN" http://127.0.0.1:5000/api/admin/analytics

echo -e "\n--- Users ---"
curl -s -H "Authorization: Bearer $TOKEN" http://127.0.0.1:5000/api/admin/users?limit=1

echo -e "\n--- Reviews ---"
curl -s -H "Authorization: Bearer $TOKEN" http://127.0.0.1:5000/api/admin/reviews?limit=1
