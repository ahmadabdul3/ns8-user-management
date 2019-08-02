## User Management

Live app deployed to Heroku: http://ns8-user-management.herokuapp.com/

Hi there. First off, this project is a clone of a personal [node-express-sequelize base project](https://github.com/ahmadabdul3/react-redux-express-base) that I use when starting new projects. I update this project from time to time when I'm working on something and find it useful and re-usable to have it ready for future projects. 

This is generally a pure JS project but I added TS after cloning it for this specific user management project. The reason I bring that up is to say that you will see a mix of TS and JS. I tried to keep anything 'new' using TS and anything pre-existing stayed mostly JS. I do want to point out that I've been using TS specifically with node for the past year and I've used other typed languages in the past like C# and Java. Overall, I've been working with node (with webpack and babel) for over 5 years now.


### Building and starting the project

This project uses TS along with webpack and babel. You will also need to have postgreSQL installed and running so the app can connect to it. To build the full bundle, you can run either of the following commands:

`npm install` <-- install all dependencies

`webpack` <-- build the bundle 1 time if you have webpack installed globally

`npm run heroku-postbuild` <-- build the bundle 1 time if you don't have webpack installed globally

`npm run watch` <-- run webpack in watch mode to make file changes

`npm start` <-- start the server, runs on localhost:3000


### Points of Discussion

The bulk of the relevant code for this project's requirements lies in the root level `routes` folder. There's are 2 routers: 

- users router
- events router
- the route validators were kept in the router files to keep the code grouped together for easier browsing for you guys

The project requirements mention that 'Data does not need to be persisted between server restarts', but since I have sequelize already set up with this project I went ahead and created a `users` and an `events` model, so data is actually persisted between server restarts. The important thing to note here is that some validations are set up with the model files, like: 

- (user) email uniqueness
- (user) non-empty email
- (user) non-empty password
- (user) phone number format if exists
- (event) non-empty type
- (event) non-empty userId 

Also, the relationship between users and events is that every event belongs to a user, so there's a required `userId` field on the event model.

These model files are under the root level `db` folder, under the `models` folder. Another important thing to note is that all sequelize related files were kept as pure JS just to keep the development process faster - I'm very familiar with working on sequelize with TS, so that can be set up if needed. 

I will point out that this project took a little over the 4 hour mark because I wanted to build a UI for it to make it easier to get to and play with. The back-end work probably took around 4 hours by itself, along with setting up TS.

As far as the `GET` endpoint for events, I decided to go with query params for the different filter options to keep a uniform approach with all filters. I could have used a url param pattern for the userId version of the filtering like:

```/users/:userId/events```

As far as the UI goes, I kept it very simplistic because this was not the focus of the project.

Finally, please disregard all the extra stuff that comes with this project. Again, it's a clone of something I get started with quickly for new projects so there are some services and helper files scattered here and there.

I Hope I didn't miss anything, looking forward to the feedback

