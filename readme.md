# Modeling Agency Management System – Backend API

## Project Overview

For this assignment, we developed the server side part of our Modeling Agency Management System using Node.js, Express, and MongoDB.

The backend handles all operations related to users and models. It allows users to register, log in, and manage model profiles through API routes. All data is stored in MongoDB, and sessions are used to keep users logged in across requests.

This builds on our Assignment 1 proposal, where we planned features such as model listing, profile viewing, search and filtering, and authentication. In this assignment, we focused on implementing those features on the server side and making sure everything works together.


## Functionality Implemented

### User Management

* Users can register with username, email, and password
* Passwords are hashed using bcrypt
* Users can log in and log out
* Sessions are used to keep users authenticated
* Logged-in user can be retrieved using `/api/users/me`

### Model Management (CRUD)

* **Create**: Add a new model profile
* **Read**: View all models or a single model by ID
* **Update**: Edit an existing model (only owner or admin)
* **Delete**: Soft delete (not permanently removed)

### Search and Filtering

* Models can be searched by:

  * name
  * category
  * location
* At least one field must be provided

### Validation and Error Handling

* Server-side validation using middleware
* Proper error messages returned for invalid input
* Invalid MongoDB IDs handled
* Duplicate values handled
* Centralized error handler used for consistency


## Technologies Used

* Node.js
* Express.js
* MongoDB (Mongoose)
* express-session
* connect-mongo
* bcryptjs
* dotenv


## How to Run the Project

1. Install dependencies:

```
npm install
```

2. Create a `.env` file in the root folder:

```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

3. Start the server:

```
npm start
```

4. Server runs on:

```
http://localhost:9000
```


## API Endpoints

### Users

* `POST /api/users/register` → register
* `POST /api/users/login` → login
* `POST /api/users/logout` → logout
* `GET /api/users/me` → current user

### Models

* `GET /api/models` → all models
* `GET /api/models/:id` → single model
* `GET /api/models/search` → search models
* `POST /api/models` → create model
* `PUT /api/models/:id` → update model
* `DELETE /api/models/:id` → soft delete


## Database Schema

### User Schema

* username
* name
* email
* passwordHash
* role (admin / editor / viewer)
* createdAt

### Model Schema

* name
* age
* email
* height
* category
* location
* imageUrl
* bio
* availability
* agency
* createdAt
* createdBy
* updatedBy
* deleted (soft delete flag)


## Contribution of Each Team Member – Assignment 2

### Nahal Kianpour

I worked mainly on integrating the backend and making sure everything runs together properly. I implemented the READ side of the models API, including `GET /api/models`, `GET /api/models/:id`, and the search route. I also connected all routes in `app.js` and tested everything using Bruno to make sure the system works as one complete application. I also deployed our app on render.

### Trinity kendi

I worked on the authentication routes in `routes/users.js`. I implemented the register, login, and logout functionality. This included validating input, hashing passwords, and setting up sessions so users stay logged in.

### Thanh Phuong Hoang

I worked on the create and update functionality for models in `routes/models.js`. I implemented the POST and PUT routes and added validation and permission checks so only the correct users can update model data.

### Keyla Paguaga Jarquin

I worked on the delete functionality and database structure. I implemented the DELETE route using soft delete logic and created the User and Model schemas to define how data is stored in MongoDB. I also worked on validation and error handling.

---

## Work Completed

* Express server set up and running
* MongoDB connected
* User authentication implemented
* Session handling working
* Full CRUD for models
* Search functionality implemented
* Server-side validation added
* Centralized error handling added
* API tested using Bruno


## Changes from Assignment 1

We kept the main planned features from Assignment 1. However, instead of implementing everything at once, we built the backend step by step.

We started by creating and testing routes, then added database logic, validation, and session handling. This helped us debug easier and make sure each part was working before integrating everything.


## Notes

* Soft delete is used instead of permanent deletion
* Sessions are stored in MongoDB
* The system can be extended further (e.g. more filters or frontend integration)


## References

* https://expressjs.com/
* https://mongoosejs.com/
* https://www.npmjs.com/package/bcryptjs
* https://www.npmjs.com/package/connect-mongo
