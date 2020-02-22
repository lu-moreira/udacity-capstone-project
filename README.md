# Wall Scratch

Want you a way to post anything without other users recognize you? 
The WallScratch app allows us to do this!

Your posts are like scratches on the way, so post it.
On this app you can, read/like/dislike others scratches and write yours, also attach images on yours scratches ;)

- Repository Url: https://github.com/lu-moreira/udacity-capstone-project
- Postman collection: https://github.com/lu-moreira/udacity-capstone-project/blob/master/udacity-capstone-wallscratch.postman_collection.json

## Requirements
* Node 12
* serverless 1.60.4
* aws cli 1.16.257+

# Dependencies

Take a look at the package.json files under backend and client folders.

## Deploying on your own in AWS
This assumes that you already have an AWS Profile called *serverless* and are using *us-east-2* region
(obviously you can substitute your own settings as required)
```sh
export NODE_OPTIONS=--max_old_space_size=4096

sls deploy -v --aws-profile <your profile> --aws-region us-east-1
```
:warning: Note that NODE_OPTIONS is required for the _individually_ packaging option in *serverless.yml* to avoid Out Of Memory issues 

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Screenshots

TBD
