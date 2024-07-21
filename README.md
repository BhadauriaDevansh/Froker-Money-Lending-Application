# Froker Money Lending Application

This project is a Money Lending application that supports user signup, login, borrowing money, and fetching user details. It uses Node.js, MongoDB, and JWT for authentication. 

## Table of Contents
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Sign Up](#sign-up)
  - [Login](#login)
  - [Get User Data](#get-user-data)
  - [Borrow Money](#borrow-money)


## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/BhadauriaDevansh/Froker-Money-Lending-Application.git
   cd Froker-Money-Lending-Application
3. **Install dependencies:**

   ```sh
   npm install
4. Make sure you have the following installed on your machine:

   Node.js (v14.x or later)
   MongoDB (local instance or MongoDB Atlas)

## Running the Application

1. Start the server:
   
    ```sh
    npm start
The server will run on port 3000 by default. You can change the port in the app.js file if needed.

## API Endpoints

### Sign Up

Endpoint: POST /api/signup
Description: Approves or rejects the application based on user age and monthly salary. Registers the user after all verification.
Request Body:
    
    { "phone": "9853898271",
      "email": "user@example.com",
      "name": "User Name",
      "dateOfRegistration": "2024-06-14",
      "dob": "2000-01-01",
      "monthlySalary": 30000,
      "password": "securePassword732"
     }
 
Response:
json
    
    { "token": "jwtSecretKey" }

### Login

Endpoint: POST /api/login
Description: Allows user to login using email and password. Uses JWT for authentication.
Request Body:
json
  
    {"email": "user@example.com",
    "password": "securePassword123"
    }

Response:
json
  
    { "token": "jwtSecretKey" }
    
### Get User Data

Endpoint: GET /api/user
Description: Shows user data with various fields.
Headers:
json
    
     { "authenticationToken": "jwtSecretKey" }
     
Response:
json

    {"phoneNumber": "9853898271",
    "email": "user@example.com",
    "name": "User Name",
    "registrationDate": "2024-06-14T00:00:00.000Z",
    "dob": "2000-01-01T00:00:00.000Z",
    "monthlySalary": 30000,
    "status": "Approved",
    "purchasePower": 0
    }
    
### Borrow Money

Endpoint: POST /api/borrow
Description: Allows the user to borrow money from the application and updates the Purchase Power amount.
Headers:
json
    
    { "authenticationToken": "jwtSecretKey" }
    
Request Body: json
    
      {  "amount": 10000,
         "tenureMonths": 12
      }

Response:
json
```sh
{
    "purchasePower": -10000,
    "monthlyRepayment": 900
}
