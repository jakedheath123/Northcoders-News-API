# Northcoders News API

## Overview
An Express server conforming to RESTful architectural style, to be used to interact and provide data to my Northcoders News Front End project. This project uses an SQL database that interacts with Postgres. Knex has been used to build the available queries.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
      
Node.js version needs to be 12.13.1 or higher.   
      
Dependencies that need to be installed to run the application:

``` 
express: ^4.17.1
jest: ^25.1.0
pg: ^7.18.2
supertest: ^4.0.2
```  


   
### Installation
  
Using the command terminal, navigate to the directory where you want the repository to be saved. Make a clone of the project by copy/pasting the below in your terminal:
```
git clone https://github.com/jakedheath123/Northcoders-News-API.git
```      
Move into the app folder like so:
```
cd Northcoders-News-API
```
Install the project dependencies:
```
npm install
```
Run the database install:
```
npm run setup-dbs
```
Seed the database with data:
```
npm run seed
```
Start the app:
```
npm run start
```


## Using the API
 Performing an initial GET request to /api will provide a list of available endpoints and example responses. The following endpoints are available:
### /api
```
GET /api
```
### /api/topics
```
GET /api/topics
```
### /api/users
```
GET /api/users/:username
```
### /api/articles
```
GET /api/articles
```
```
GET /api/articles/:article_id
```
```
PATCH /api/articles/:article_id
```
```
GET /api/articles/:article_id/comments
```
```
POST /api/articles/:article_id/comments
```
## /api/comments
```
PATCH /api/comments/:comment_id
```
```
DELETE /api/comments/:comment_id
```

## Running the tests

A full TTD test suite is available. The following command will test endpoints with Jest and Supertest: 
```
npm test
```
The following command will test pure functions with Jest:
```
npm run test-utils
```
## Built With
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Knex.js](http://knexjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Jest](https://jestjs.io/)
- [SuperTest](https://www.npmjs.com/package/supertest)
- [Heroku](https://www.heroku.com/)

## Links
Please click here for deployed API: [Heroku](https://nc-news-be-project.herokuapp.com/api)
        
## Authors
        
- Jake Heath - *Initial work* - [GitHub](https://github.com/jakedheath123)
