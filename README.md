# School Management API

This is a Node.js API built with Express.js and MySQL for managing school data.

## Features

- **Add School**: Add a new school with its name, address, latitude, and longitude.
- **List Schools**: Retrieve a list of all schools, sorted by proximity to a given geographical location (latitude and longitude).

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server

## Setup Instructions

1. **Install Dependencies**
   Run the following command to install required packages:
   \`\`\`bash
   npm install
   \`\`\`

2. **Database Configuration**
   - Copy \`.env.example\` to \`.env\`:
     \`\`\`bash
     cp .env.example .env
     \`\`\`
   - Update the \`.env\` file with your MySQL database credentials (host, user, password). The script will automatically create the database name specified in \`DB_NAME\`.

3. **Initialize the Database**
   Run the initialization script to create the database and the \`schools\` table:
   \`\`\`bash
   npm run init-db
   \`\`\`

4. **Start the Server**
   To start the API server:
   \`\`\`bash
   npm start
   \`\`\`
   For development mode (with nodemon):
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### 1. Add School
- **URL**: \`/addSchool\`
- **Method**: \`POST\`
- **Payload**:
  \`\`\`json
  {
    "name": "Example School",
    "address": "123 Main St",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  \`\`\`

### 2. List Schools
- **URL**: \`/listSchools\`
- **Method**: \`GET\`
- **Query Parameters**: \`latitude\`, \`longitude\`
- **Example**: \`/listSchools?latitude=40.7128&longitude=-74.0060\`

## Testing with Postman

A Postman collection is included in the \`postman/\` directory. You can import \`School_Management.postman_collection.json\` into Postman to easily test the APIs.

## Deployment

To deploy this application:
1. Provision a MySQL database on a cloud provider (e.g., Aiven, PlanetScale, AWS RDS).
2. Set the environment variables in your hosting provider's dashboard (Render, Vercel, Heroku, etc.).
3. Deploy the code. The application uses the standard \`npm start\` command.
