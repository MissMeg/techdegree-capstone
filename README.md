```
 _____                 _                    ______          _           _   
/  __ \               | |                   | ___ \        (_)         | |  
| /  \/ __ _ _ __  ___| |_ ___  _ __   ___  | |_/ / __ ___  _  ___  ___| |_
| |    / _` | '_ \/ __| __/ _ \| '_ \ / _ \ |  __/ '__/ _ \| |/ _ \/ __| __|
| \__/\ (_| | |_) \__ \ || (_) | | | |  __/ | |  | | | (_) | |  __/ (__| |_
\____/\__,_| .__/|___/\__\___/|_| |_|\___| \_|  |_|  \___/| |\___|\___|\__|
           | |                                           _/ |              
           |_|                                          |__/               
```
*This project is for a real wedding website (my own) and will be updated as details are finalized. Login page will no longer be able to be accessed so my guest list cannot be seen or changed by others.*

# Chosen Topic: Wedding Website

## Grading/Testing Locally Requirements


In order to grade/test this project you will need to complete the following steps:
- Either create a free account or login to your mLab account.
- Create a free MongoDB sandbox db in mLab
- Open the new database and click on users to create a new one (this will be the mlabUser and mlabPass)
- Use the given MongoDb URI - Find 'To connect using a driver via the standard MongoDB URI:' towards the top of the page after creating the new sandbox.
- Replace '@ds129821.mlab.com:29821/wedding-website' in the index.js file with your new db URI. Full code looks like this:
```
mongoose.connect(`mongodb://${process.env.mlabUser}:${process.env.mlabPass}@ds129821.mlab.com:29821/wedding-website`, { useNewUrlParser: true });
```
- API Keys you will need to get:
  - Google Maps API Key
  - Giphy API Key
- Create a config file and replace the process.env keys (used for Heroku) on the index.js file and the one for google maps on the routes.js file inside the js folder with the appropriate key. Ex: process.env.mlabPass changes to keys.mlabPass
```
const keys = {
    mlabPass: 'passwordHere',
    mlabUser: 'usernameHere',
    google_maps_api_key: 'keyHere',
    giphy_api_key: 'keyHere',
    secret_key: 'chooseYourOwnSecretHere'
}

module.exports = keys;
```
- Uncomment the requiring of the config file on those two pages
- After those steps are complete make sure to use npm install before running the project locally


## Description


Built a functioning wedding website including a back-end to create, update and delete guests from a guest list and organize into groups for future seating charts. 


Skills Practiced:
- MongoDB w/ Mongoose
- APIs
- Responsive layout
- Heroku
- HTML5 Validation
- Testing - mocha, chai, and sinon
