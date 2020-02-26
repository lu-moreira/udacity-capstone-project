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

Take a look at the package.json files under backend and frontend folders.

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

To run a frontend application first edit the `frontend/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd frontend
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless WallScratch application.

# Screenshots

### Home page, when a user hasn't entered
![image](https://user-images.githubusercontent.com/45040629/75383203-b0b47800-58ba-11ea-8dc7-3d57fced8a40.png)

### Login is also protected by Auth0
![image](https://user-images.githubusercontent.com/3696197/75270891-15e46c80-57da-11ea-800e-7cbf8617e5c7.png)

### After logIn, the homepage will be like that when you don't have any scratches. Also will allows you to create scratches
![image](https://user-images.githubusercontent.com/45040629/75383579-5f58b880-58bb-11ea-8992-4eb4924286c3.png)

### For create a scratch just hit the button, tip a title, description and if is available for public or not
![image](https://user-images.githubusercontent.com/45040629/75383703-9cbd4600-58bb-11ea-8def-6a54632d1248.png)

### After you create, will be see the home page like this.
![image](https://user-images.githubusercontent.com/45040629/75383777-bf4f5f00-58bb-11ea-8ac4-3b4db2ae767f.png)

### Once created, you can update or delete the scratch. On the update view, u can upload a new image for that scratch, just hit the blue button. 
![image](https://user-images.githubusercontent.com/45040629/75383915-fa519280-58bb-11ea-936b-c3fa8bbf110b.png)

### Also u can delete the scratch
![image](https://user-images.githubusercontent.com/45040629/75383996-240ab980-58bc-11ea-9138-81f282562599.png)


# Demo

![app-running](http://g.recordit.co/jGgXuk24ir.gif)

**Important** if the image don't shows up, try see with this link: http://g.recordit.co/jGgXuk24ir.gif
