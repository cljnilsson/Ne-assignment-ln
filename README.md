## NE Task

### Running
Each project needs to be run seperately or launched via "docker-compose up" from the base directory

### Assumptions
* No payments are simulated, the price is merely displayed in the data
* The task is very specific, unless it's specifically mentioned I assume it's not a part of the task even though it would make logical sense, such as full CRUD support. Removing books is not mentioned for example.
* There is no load balancer involved meaning that you can keep some information in memory without worrying about Kubernetes having multiple instances of the backend
* "When the stock reaches 0 then the admin needs to order more!" I assume that this means that the ability to restock should exist, not that you can only restock when stock is 0 as that seems to be illogical.
* In order to save order history you need a user (have an account) and as such be logged in in order to buy a book

### Would if more time
* Swagger alternative for the REST API
* Better and more responsive frontend UI
* Automatic endpoint tests for backend
* Better request helper / wrapper for frontend
* Chronjob to reset login attempt counter
* Reuse more auth related code