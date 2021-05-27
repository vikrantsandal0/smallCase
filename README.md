# smallcase stocks assignment
* A simple stocks assignment consisting of API's manipulating ,fetching stocks and complete portfolio .
### Tech-stack used
* Express.js - A back end web application framework for Node.js.
* Postgres - Powerful, open source object-relational database system . 
* Sequelize - A promise-based Node.js ORM tool for Postgres and many others.
* Winston -  Simple and universal logging library with support for multiple transports
* Ajv - The fastest JSON validator for Node.js and browser.
* Lodash - A modern JavaScript utility library delivering modularity, performance & extras.

### APIs
**GET stock-api/trades - fetches all trades for a security**

**POST stock-api/trades - places a new  BUY/SELL trade for a security**

**PUT stock-api/trades - updates an existing trade**

**DELETE stock-api/trades - deletes an exisiting trade and revert the changes**

**GET stock-api/tradesReturns - fetches returns for a particular security**

**GET stock-api/portfolioDetails - fetches complete portfolio**




 ### FOLDER STRUCTURE 
 * the complete structure has been built using Node.js, other libs like phantom , cheerio , joi etc.
 * *server.js* entry point of the folder.
 * *common* contains common models,queries,associations which can be used anywhere validation.
 * *controllers* contains functions extracted from implementations.
 * *implementation* contains actual implementation code of all API's, alongs with error handler and helper files.
* *middleware* contains dbconnection middleware which picks db connection for each API, rather than directly accessing the global DB_CONNS object.
* *routes* contains all routes for this assignment.
* *schemas* contains all API's json schemas against which the API's body or query are validated.
* *static* contains all constants, error constants and logs messages files.
* *utils* contains all utility functions for connecting to database and setting up our logger.


### HOW TO INITIATE 
```
npm install
```
```
nodemon server.js
```

### POSTMAN COLLECTION
[link](https://www.getpostman.com/collections/9c34d77116ee6721b7d5)



