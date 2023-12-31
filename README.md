# Acelerate Take-Home

This web application allows users to view and manage ratings and reviews for various restaurants. It provides a user-friendly interface to search for restaurants, view their ratings and reviews, and perform additional actions such as refreshing data and filtering reviews.

## Imporant

- There is a Cloudflare bypassing issue for scraping data
  - I've tried many different ways with Puppeteer to bypass Cloudflare
- I can explain this in detail during our chat
- I also get a 403 error due to missing or incorrect authentication credentials
  - I've copied all the headers sent in the email, and it still doesn't work
  - It doesn't work at first, but sometimes when I wait, it works 

## Technologies Used

- Frontend: React, TypeScript, Axios, Tailwind CSS
- Backend: Express, Node.js, Axios, Puppeteer, Prisma
- Database: PostgreSQL
- Builder/Bundler: Vite

## Installation

1. Clone the repository:

2. Install the dependencies:
- npm i
 
3. Set up the environment variables:

- Rename the `.env.example` file to `.env`.
- Update the necessary variables in the `.env` file, such as database connection details.

4. Start the backend server:
- cd server
- npm start

5. Start the frontend development server:
- cd client
- npm run dev

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).



