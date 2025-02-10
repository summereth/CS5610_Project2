# CS5610_Project2

My Submission of CS5610 Project 2

## GenAI usage

Claude 3.5 Sonnet assisted me in finishing this project.

### Use cases

#### Random data generation

Prompt:
Generate a JS file containing data of exercises. The exercises is an array of exercise object. Each exercise object contains name, muscle group and description (some exercise tips).

### Client request with query

Prompt:
How can client side send request with some query. Please give me an example.

### MongoDB query

Prompt:

- I'm using MongoDB with Node.js driver. Without using mongoose, how can I query document by ObjectId.
- How can I sort the query result.

### Asynchronous programming issue with Array.map() function

Prompt:

Why my `convertedExercises` is an array of Promise. How should I modify the code so that I could get an array of exercise object

### Lazy loading workout plans

Prompt:
Right now my frontend fetches workoutPlans from backend, and uses the data to insert html of both `card-header-section` and `card-details`. However, I wish to lazy load plan details. That is to say to display information in `card-details`​, front-end must request `GET /api/plans/:id`​. That means, in `createWorkoutCard()` function we can't insert Expandable Details part. And in `toggleCardDetails()` function, we need to send `GET /api/plans/:id​ `request and then inject `card-details`​ html. What are the key changes I need to make here.

### POST Request

Prompt:
How to send POST request to backend with a body using just vanilla JavaScript

### Vercel Deploy Issue

Prompt:

- Analyze this error:
  file:///Users/liqian/.nvm/versions/node/v20.12.2/lib/node_modules/vercel/node_modules/@vercel/node/dist/dev-server.mjs:1952
  return listener(req, res);
  ^
  TypeError: listener is not a function
  at Server.<anonymous> (file:///Users/liqian/.nvm/versions/node/v20.12.2/lib/node_modules/vercel/node_modules/@vercel/node/dist/dev-server.mjs:1952:12)
  at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
  Node.js v20.12.2

- The deploy in dev is good. So I deployed it in production by running `vercel`. However, when I open the production url, there is an error in console:
  fitnessmaster-p7tr3bgl6-summers-projects-06a1372b.vercel.app/:1
  Failed to load resource: the server responded with a status of 404 ()
