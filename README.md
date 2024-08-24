
# PeekFi

[![Netlify Status](https://api.netlify.com/api/v1/badges/936fbfb5-9383-43da-a15a-b1232068fc6f/deploy-status)](https://app.netlify.com/sites/peekfi/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://reactjs.org/)
[![Coverage Status](https://coveralls.io/repos/github/username/repository/badge.svg?branch=main)](https://coveralls.io/github/username/repository?branch=main)

PeekFi is a cutting-edge cryptocurrency tracking application designed to provide users with real-time data on market trends, price changes, and trading volumes of various cryptocurrencies. With its sleek interface and powerful search functionality, PeekFi makes it easier than ever to monitor the volatile world of crypto markets.

## Features

- 🔥 **Trending Coins**: Automatically displays the top trending cryptocurrencies based on the latest data.
- 🔍 **Search Functionality**: Quickly find any cryptocurrency by name or symbol, with real-time data fetched via the CoinGecko API.
- 📊 **Comprehensive Data**: View detailed statistics on each cryptocurrency, including current price, 24h price change, and trading volume.
- 🌗 **Dark Mode Support**: Toggle between light and dark themes to suit your preference and environment.
- 🚀 **Fast and Responsive**: Built with React and optimized for performance, ensuring a smooth and responsive user experience.

![image](https://github.com/user-attachments/assets/05815c37-c1a3-476f-92fe-ce99edc94c52)

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [Deployment](#deployment)
6. [Running Tests](#running-tests)
7. [Building for Production](#building-for-production)
8. [Contributing](#contributing)
9. [License](#license)
10. [Contact](#contact)

## Getting Started

PeekFi requires Node.js and npm (or yarn) to be installed on your system. Follow the instructions below to set up the project on your local machine.

### Prerequisites

- **Node.js** (version 14.x or higher)
- **npm** (version 6.x or higher) or **yarn** (version 1.x or higher)

## Project Architecture

PeekFi is structured to follow best practices in React development. Below is a brief overview of the architecture:

- **`public/`**: Contains the static assets, such as the HTML file and images.
- **`src/`**: The main directory for the application's source code.
  - **`assets/`**: Stores images, fonts, and other static assets.
  - **`components/`**: Reusable React components, such as buttons, forms, and the cryptocurrency cards.
  - **`hooks/`**: Custom React hooks for fetching and managing data, including the `useCryptoSearch` hook.
  - **`pages/`**: Contains the different page components, each representing a route in the application.
  - **`stores/`**: Manages global state using Zustand or another state management library.
  - **`utils/`**: Utility functions and helpers, such as API key management and data formatting functions.
- **`tests/`**: Contains test files to ensure code quality and functionality.
- **`package.json`**: Manages dependencies, scripts, and project metadata.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/username/peekfi.git
    cd peekfi
    ```

2. **Install dependencies:**

    Using npm:
    ```bash
    npm install
    ```

    Or using yarn:
    ```bash
    yarn install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add your API keys and other configuration variables:

    ```env
    REACT_APP_API_KEY=your_api_key_here
    ```

## Running the Application

To start the application in development mode:

Using npm:
```bash
npm start
```

Or using yarn:
```bash
yarn start
```

This command runs the app in development mode, opening it in your default web browser at `http://localhost:3000`.

## Deployment

PeekFi is pre-configured for deployment on Netlify. Any changes pushed to the `main` branch will trigger an automatic deployment.

To manually deploy to Netlify:

1. **Build the project:**

    ```bash
    npm run build
    ```

    Or with yarn:

    ```bash
    yarn build
    ```

2. **Deploy to Netlify:**

    Drag and drop the contents of the `build/` directory into the Netlify dashboard or use the Netlify CLI for continuous deployment.

    ![Netlify Status](https://api.netlify.com/api/v1/badges/936fbfb5-9383-43da-a15a-b1232068fc6f/deploy-status)

## Running Tests

To run the test suite and ensure all components work as expected:

```bash
npm test
```

Or with yarn:

```bash
yarn test
```

## Building for Production

To create an optimized build for production:

```bash
npm run build
```

Or with yarn:

```bash
yarn build
```

The production build will be available in the `build/` directory, ready for deployment.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue on GitHub. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any inquiries or support, please reach out:

- **Email**: ilyes.abd-lillah@epitech.eu
- **x**: [@AbdIlyes](https://twitter.com/AbdIlyes)

