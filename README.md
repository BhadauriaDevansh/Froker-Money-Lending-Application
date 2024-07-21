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
- [API Endpoints Screenshots](#api-endpoints-screenshots)


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
    npm mainApp.js
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
    
      {  "amount": 7000,
         "tenureMonths": 12
      }

Response:
json
  
    { "purchasePower": 993000,
      "totalLoanAmount": 7000,
      "totalMonthlyRepayment": 608.9190035979541
     }

## API Endpoints Screenshots

### Signup API Endpoint - 
![Signup_Endpoint](https://github.com/user-attachments/assets/737e0cb4-88d9-4f67-abb5-4c59fec6f8cb)

### Login API Endpoint - 
![Login_Endpoint](https://github.com/user-attachments/assets/7f764aee-9600-40f5-848c-5d56bc68732d)

### Get User Endpoint -

![User_Endpoint](https://github.com/user-attachments/assets/5d85048e-2a64-4a2d-b2f6-bd03ee94f73c)

### Borrow Money Endpoints - 

![MoneyBorrow_Endpoint1](https://github.com/user-attachments/assets/1c916f68-cd35-42da-be79-5df8090c92b5)

![MoneyBorrow_Endpoint2](https://github.com/user-attachments/assets/a8cf0189-8b1c-4f70-ae3c-9e47c279ffe2)













