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

### Home page, here u can see all available scratches
![image](https://user-images.githubusercontent.com/3696197/75270808-ee8d9f80-57d9-11ea-9395-8bc11d516af1.png)

### Login is also protected by Auth0
![image](https://user-images.githubusercontent.com/3696197/75270891-15e46c80-57da-11ea-800e-7cbf8617e5c7.png)

### After u login, u can see that on home page enables votting on scratches
![image](https://user-images.githubusercontent.com/3696197/75271058-5e038f00-57da-11ea-82d7-4462c3220c2e.png)

### Accessing My Scratches page, u can create, edit or delete your scratches and also see the public ones
![image](https://user-images.githubusercontent.com/3696197/75271228-a02cd080-57da-11ea-8a1d-2c17f7e8b758.png)

### For create a scratch just hit the button, tip a title, description and if is available for public or not
![image](https://user-images.githubusercontent.com/3696197/75271338-cce0e800-57da-11ea-9cf6-ca22bb17abd5.png)

### After you create, will be see the scratch like this.
_*Important* seams that has a little bug using monsaic render, so just scroll down and up the page for see the new created scratch_
![image](https://user-images.githubusercontent.com/3696197/75271477-04e82b00-57db-11ea-9c47-6f8390a4015c.png)

### Once created, u can upload a image file, and update the scratch. Also u can delete too.
![image](https://user-images.githubusercontent.com/3696197/75271724-6b6d4900-57db-11ea-8917-9b3908e0e2fb.png)

# Demo
![app-running](http://g.recordit.co/QXfiPhCCgn.gif)
http://g.recordit.co/QXfiPhCCgn.gif
