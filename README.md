# DRAUGR Shop Frontend

A modern e-commerce frontend for DRAUGR shop built with React, Tailwind CSS, and Framer Motion.

## Features

- Responsive design for all screen sizes
- Real-time cart management
- User authentication
- Product catalog with filtering and search
- Checkout process
- API integration with Draugr backend

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- NPM or Yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd draugr-shop
npm install
# or
yarn
```

3. Create a `.env` file in the project root with the following content:

```
VITE_API_URL=https://draugr-backend.onrender.com
```

> Note: You can use a different API URL if you are running the backend locally.

### Running the Application

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173.

## Building for Production

```bash
npm run build
# or
yarn build
```

## Connecting to the Backend

This frontend is designed to work with the DRAUGR backend API. The backend should be running and accessible at the URL specified in your `.env` file.

Backend repository: [DRAUGR-BackEnd](https://github.com/Mahdiglm/DRAUGR-BackEnd)

## Environment Variables

- `VITE_API_URL`: URL of the backend API (default: https://draugr-backend.onrender.com)

## Project Structure

```
draugr-shop/
├── public/            # Static assets
├── src/
│   ├── assets/        # Images, fonts, and other assets
│   ├── components/    # Reusable components
│   ├── contexts/      # React context providers
│   ├── services/      # API services
│   └── utils/         # Utility functions
└── .env               # Environment variables
```

## Authentication

The application uses JWT for authentication. Tokens are stored in localStorage and automatically included in API requests.
