<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)












dx                                                                                                                  
to run the project
open terminal 
first go to query directory and run the command : 
npm install 

this Installs the required node modules 

now go to backend directory and create .env file
add this line in your .env file
MONGODB_URI=(your mongo uri)

To run backend 
use this command 
nodemon ./index.js

To start the query interface(front end) 
open another terminal 
go to query directory
enter the following command :
 npm start

to ingest array of logs 
this endpoint http://localhost:3000/api/ingest works as query ingestor
you can use postman ,thunderclient or any other application to ingest array of logs in the given format
    [
    {
        "level": "debug",
        "message": "Debug message for server-0",
        "resourceId": "server-0",
        "timestamp": "2023-11-17T15:29:48.417059Z",
        "traceId": "abc-xyz-0",
        "spanId": "span-0",
        "commit": "00000000",
        "metadata": {
            "parentResourceId": "server-0"
        }
    },
    {
        "level": "info",
        "message": "Info message for server-1",
        "resourceId": "server-1",
        "timestamp": "2023-11-18T15:29:48.417059Z",
        "traceId": "abc-xyz-1",
        "spanId": "span-1",
        "commit": "00000001",
        "metadata": {
            "parentResourceId": "server-2"
        }
    },
    {
        "level": "error",
        "message": "Error message for server-2",
        "resourceId": "server-2",
        "timestamp": "2023-11-19T15:29:48.417059Z",
        "traceId": "abc-xyz-2",
        "spanId": "span-2",
        "commit": "00000002",
        "metadata": {
            "parentResourceId": "server-4"
        }
    }
    ]



=======
# carhub
A Car Management Application where users can create, view, edit, and delete cars.
>>>>>>> 8ce22002a6f7ea48097b26041e1a90a2a3832a2b
