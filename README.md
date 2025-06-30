# Sunset

![Rails](https://img.shields.io/badge/rails-v8.0.2-red)
![React](https://img.shields.io/badge/react-v19.1.0-blue)
![npm](https://img.shields.io/badge/node-v10.7.0-blue)


## CONTEXT

Jumpseller is an e-commerce platform where people can create their online stores and
connect with several sales channels, inside an all-in-one platform with everything people
need to build their business online.
On this take home assignment, you will develop a small application using Ruby in the
backend and React in the frontend with a server and frontend components.
Provide the code on a Git repository with a README file with instructions on how to run
the project. We expect to receive this code in 3 days.
Time spent should be less than 6hs. Make your own best decisions for non-specified
requirements.

### SERVER SIDE

1. Set up a Ruby project with a server-side framework like Ruby on Rails or Sinatra.
2. Implement an API endpoint that receives parameters for location (example:
Lisbon, Berlin) , start date, and end date.
3. Develop a service class that interacts with the Sunset Sunrise API to:
a. Perform HTTP requests to retrieve historical sunrise and sunset data for the
given location and date range.
b. Extract relevant details such as sunrise time, sunset time, and golden hour.
4. Define a data model for storing the historical information.
5. Optimize API requests: Implement backend logic to check if data already exists in
the database:

a. If the requested data exists, return it directly.
b. If the requested data does not exist, fetch it from the Sunrise-Sunset API,
store it, and return the response.

6. Ensure error handling: Handle invalid locations, Handle special cases like
Arctic/Antarctic where the sun doesn't rise/set in some months, API failures, and
missing parameters.
### FRONTEND
1. Design a user interface with an input field for the location name (example: Lisbon),
start date, and end date.
2. Implement a client-side function that sends a request to the server API when a
button is clicked, passing the entered location, start date, and end date as
parameters.
3. Handle the API response and display the historical information (sunrise time,
sunrise time, golden hour) on the frontend with a chart library and on table format.

### DELIVERABLES

1. Screencast of the Application, demoing the main features. Use your voice to
better explain yourself.
2. Repository URL or Zip, containing all the code.


## How to run

To prepare your computer for development you need to install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### Local Setup

#### Deploy Local Server 

1. Clone the repository

```bash
git clone https://github.com/ChenCook/SunSet.git
```

2. Go to the project directory `/Sunset`:
   
```bash
cd /Sunset

```

4. Run the docker-compose file:

```bash
docker-compose up -d
```

5. Run the Ruby on Rails server migration:
```bash
docker exec -it sunset-backend-1 bin/rails db:migrate
```

6. Go to:

```bash

http://localhost:3000/

```

 