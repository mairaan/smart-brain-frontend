# Smart Brain - Frontend

The front-end user interface for the Smart Brain full-stack application. This React application allows users to register, log in, and submit image URLs to detect people. It calculates and draws bounding boxes around detected people and dynamically tracks the number of entries each user submits.

Detection runs through the Smart Brain API. The backend forwards the image URL to a Hugging Face model and returns bounding boxes, which this app converts and renders on the image.

You can find the Smart Brain - Backend repository here: https://github.com/mairaan/smart-brain-backend

## Features

- Face Detection UI: Calculates and renders bounding boxes over people in submitted images.
- User Authentication Flow: Seamless routing between sign-in, registration, and the main dashboard.
- Live Rank Tracking: Displays and instantly updates the user's total image submission count.

## Built With

- React.js
- Vite
- JavaScript (ES6+)
- HTML5 & CSS3
- [Tachyons](https://tachyons.io/) for layout and styling
- [particles-bg](https://github.com/lindelof/particles-bg) for the background
- [react-parallax-tilt](https://github.com/mkosir/react-parallax-tilt) for the logo effect

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- The Smart Brain API (backend) running locally on `http://localhost:3000`.

This frontend calls these backend endpoints:

| Method | Path        | Purpose                          |
| ------ | ----------- | -------------------------------- |
| POST   | `/signin`   | Sign in an existing user         |
| POST   | `/register` | Create a new account             |
| POST   | `/imageurl` | Detect people in an image URL    |
| PUT    | `/image`    | Increment the user's entry count |

## Usage

1. Register a new account or sign in.
2. Paste a public image URL into the form.
3. Click **Detect** to draw boxes around people in the image.
4. Your entry count updates after each successful detection.

This project was developed during the Zero To Mastery - Complete Web Developer Bootcamp.
