# Northcoders News API 📰

Link to the hosted API: https://nc-news-7wgo.onrender.com/api

Welcome to my Northcoders News API project! The aim of this project was to build an API that mimicked a real-world backend news service such as Reddit. You can use this API to:

- Get users
- Get and post topics
- Get, post, and delete articles and comments
- Filter articles by topic
- Sort articles by title, topic, author, and date created, in descending or ascending order (sorts by DESC by default)
- Use limits and pagination on articles and comments
- Upvote or downvote articles and comments

You will need to have [Node.js(https://nodejs.org/en/download/current)] (v20.6.1 or higher) and [Postgres(https://www.postgresql.org/download/)] (v16 or higher) to run the project. You may also need to install a JSON formatter [extension(https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en)] for your browser to make the data easier to read.

In order to run this project locally, you will need to create .env.test and .env.development files in the main folder, and create a PGDATABASE=database_name_here environment variable in each. In db/setup.sql, copy over your database variable names.
