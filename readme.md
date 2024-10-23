Setup and Run Instructions

Prerequisites

Node.js installed on your machine (version >= 12.0.0)
MongoDB instance running locally or using MongoDB Atlas
Postman (optional for testing API endpoints) or Thunder client in vscode

Steps to Run the Project

1.Clone the repository:
git clone https://github.com/your-repo/finance-tracker-api.git

2.Navigate to the project directory:
cd finance-tracker

3.Install dependencies:
npm install

4.Create a .env file in the root directory and add the following environment variables:

MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

5.Start the server:

npm start

The API will now be running on http://localhost:3000.

API Documentation

Base URL

http://localhost:3000

Authentication
Login and Signup endpoints are used to authenticate users and generate JWT tokens.

step1:Register a New User

Endpoint: POST /auth/register
Description: Registers a new user.

Request Body (JSON):
{
  "username": "testuser",
  "password": "testpassword"
}
Expected Response (201 Created):
{
  "message": "User registered successfully"
}

step2:Log in and Get JWT

Endpoint: POST /auth/login
Description: Logs in and retrieves a JWT token.

Request Body (JSON):
{
  "username": "testuser",
  "password": "testpassword"
}

Expected Response (200 OK):
{
  "token": "<JWT_TOKEN>"
}

step3: Add a New Transaction

Endpoint: POST /transactions
Description: Adds a new income or expense transaction.

Request Body (JSON):
{
  "type": "expense",
  "category": "<CATEGORY_ID>", // Replace with an actual category ID
  "amount": 100,
  "description": "Groceries"
}

Expected Response (201 Created):
{
  "_id": "<TRANSACTION_ID>",
  "type": "expense",
  "category": "<CATEGORY_ID>",
  "amount": 100,
  "description": "Groceries",
  "user": "<USER_ID>",
  "date": "2023-12-23T07:40:52.570Z"
}

step 4: Fetch All Transactions (with Pagination)

Endpoint: GET /transactions?page=1&limit=10
Description: Retrieves paginated transactions of the user.

Expected Response (200 OK):
{
  "transactions": [
    {
      "_id": "<TRANSACTION_ID>",
      "type": "expense",
      "category": "<CATEGORY_ID>",
      "amount": 100,
      "description": "Groceries",
      "user": "<USER_ID>",
      "date": "2023-12-23T07:40:52.570Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}

step 5:Fetch a Single Transaction by ID

Endpoint: GET /transactions/<TRANSACTION_ID>
Description: Fetch a specific transaction by its ID.

Expected Response (200 OK):

{
  "_id": "<TRANSACTION_ID>",
  "type": "expense",
  "category": "<CATEGORY_ID>",
  "amount": 100,
  "description": "Groceries",
  "user": "<USER_ID>",
  "date": "2023-12-23T07:40:52.570Z"
}

step 6:Update a Transaction

Endpoint: PUT /transactions/<TRANSACTION_ID>

Request Body (JSON):
{
  "type": "expense",
  "category": "<NEW_CATEGORY_ID>",
  "amount": 150,
  "description": "Groceries Updated"
}

Expected Response (200 OK):
{
  "_id": "<TRANSACTION_ID>",
  "type": "expense",
  "category": "<NEW_CATEGORY_ID>",
  "amount": 150,
  "description": "Groceries Updated",
  "user": "<USER_ID>",
  "date": "2023-12-23T07:40:52.570Z"
}

step 7:Delete a Transaction

Endpoint: DELETE /transactions/<TRANSACTION_ID>

Expected Response (200 OK):

{
  "message": "Transaction deleted"
}

Step to Add and Use Categories

1. Adding Categories

Endpoint: POST /categories
Description: Adds a new category.

Request Body (JSON):
{
  "name": "Groceries",
  "type": "expense"  // "income" or "expense"
}

Expected Response (201 Created):

{
  "_id": "<CATEGORY_ID>",
  "name": "Groceries",
  "type": "expense"
}

2. Getting Categories

Endpoint: GET /categories
Description: Fetches all categories.

Expected Response (200 OK):

[
  {
    "_id": "<CATEGORY_ID>",
    "name": "Groceries",
    "type": "expense"
  },
  {
    "_id": "<CATEGORY_ID>",
    "name": "Salary",
    "type": "income"
  }
]


