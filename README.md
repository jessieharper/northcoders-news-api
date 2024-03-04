# 🗞️ Northcoders News API 📰

Tech stack: SQL, Postgres, Express, Node.js, Supertest 

Welcome to my Northcoders News API project! The aim of this project was to build an API that mimicked a real-world backend news service such as Reddit. You can access the hosted version of the API [here](https://nc-news-7wgo.onrender.com/api). You can use this API to:

- Get users
- Get and post topics
- Get, post, and delete articles and comments
- Filter articles by topic
- Sort articles by title, topic, author, and date created, in descending or ascending order (sorts by DESC by default)
- Use limits and pagination on articles and comments
- Upvote or downvote articles and comments

You will need to have [Node.js](https://nodejs.org/en/download/current) (v20.6.1 or higher) and [Postgres](https://www.postgresql.org/download/) (v16 or higher) to run the project. You may also need to install a [JSON formatter extension](https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en) for your browser to make the data easier to read.

In order to run this project locally, you will need to:

- Create a .env.development file at the root file directory and set the PGDATABASE to equal nc_news
- If you want to run the test file, you will need to add a .env.test file and set the PGDATABASE to equal nc_news_test
- Run npm install to install required dependencies.
- Run npm setup-dbs to initialize the databases.
- Run npm run seed to seed the production database.
- Run npm run start to start the API listening on port 9090.
- You can now view a list of endpoints by making a GET request to http://localhost:9090/api.


Contact me:
- jessieharper12@gmail.com
- https://www.linkedin.com/in/jessie-harper/
