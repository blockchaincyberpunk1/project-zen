# Getting Started with ProjectZen React App

TTo get started with this app, you will need to have Node.js and npm installed on your machine. Once you have those installed, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run npm install to install the necessary dependencies.
4. Create a Firebase project and enable authentication and Firestore.
5. Set up your Firebase configuration by creating a .env file in the root of the project and adding the following environment variables:

REACT_APP_API_KEY=<your Firebase API key>
REACT_APP_AUTH_DOMAIN=<your Firebase auth domain>
REACT_APP_PROJECT_ID=<your Firebase project ID>
REACT_APP_STORAGE_BUCKET=<your Firebase storage bucket>
REACT_APP_MESSAGING_SENDER_ID=<your Firebase messaging sender ID>
REACT_APP_APP_ID=<your Firebase app ID>

6. Run npm start to start the app in development mode.

## ProjectZen

This is a React app that uses Firebase for authentication and Firestore for data storage. The app includes several pages and components that are conditionally rendered based on the user's authentication state.

### Pages and Components
## Pages

Dashboard: This is the main page of the app, which shows a list of projects.
Create: This page allows the user to create a new project.
Project: This page displays the details of a specific project.
Tasks: This page shows a list of tasks for a specific project.
Login: This page allows the user to log in to the app.
SignUp: This page allows the user to sign up for the app.

## Components

Navbar: This component displays the app's navigation bar.
Sidebar: This component displays a sidebar menu for authenticated users.
OnlineUsers: This component shows a list of users who are currently online.
TaskList: This component shows a list of tasks for a specific project.

### Authentication

The app uses Firebase for authentication, and it includes a custom useAuthContext hook that provides the user object and authentication state to the components that need it.

### Firestore

The app uses Firestore for data storage, and it includes a custom useFirestore hook that provides functions for adding, updating, and deleting documents from Firestore.

### Dependencies

react
react-dom
react-router-dom
firebase
dotenv

### Author

This app was developed by Sheneeza Volcov.
