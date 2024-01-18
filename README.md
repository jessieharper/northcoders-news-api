# Northcoders News API 📰

Link to the project: https://nc-news-7wgo.onrender.com

Welcome to my Northcoders News API project! The aim of this project was to build an API that mimicked a real-world backend news service such as Reddit. You can use this API to:

- Get articles, users, comments, and topics
- Post articles and topics
- Filter articles by topic
- Sort articles by title, topic, author, and date created, in descending or ascending order (sorts by DESC by default)
- Patch, post, and delete comments
- Upvote or downvote articles and comments

You will need to have Node.js (v20.6.1 or higher) and Postgres (v16 or higher) to run the project. You may also need to install a JSON formatter extension for your browser to make the data easier to read.

In order to run this project locally, you will need to create .env.test and .env.development files in the main folder, and create a PGDATABASE=database_name_here environment variable in each. In db/setup.sql, copy over your database variable names.
