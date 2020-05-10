# google_sheet_reader_bot by emirn (Modified by dante720a)
Original Code Link: https://github.com/emirn/google_sheet_reader_bot

This Telegram bot get data from Google worksheet, checks the very first column for a Code and returns rows where it matches from 3 pages in google worksheet.

## steps to use

### 1.Register a telegram bot 
- (send **/newbot** commmand to register bot with [https://telegram.me/BotFather](@BotFather) in Telegram) and copy token for newly created bot.

### 2. Create Google Sheet with the data. The very first column is treated as a key to search for data. You may have multiple rows with the same key, all of them they will be displayed then.
| Code  | Where           | Description | Author |
| ----------  | --------------- | ---------------- | -----|
| 9  | red room | first talk description |John Doe|
| 10 | red room | talk about javascript |Jack Black|
| 11 | red room  | some marketing talk bs |William White|
| 9  | green room | some keynote talk |John Baker|
| 10 | green room | networking and coffee |Bob Will|
| 11 | green room  | some use case for node.js |Diana White|

#### 3. Publish this Google sheet (File - Publish To Web - OK)

#### 4. signup for a heroku account and create a new app on it

#### 5. Make a clone from this Github Project to your pc

#### 6. Open Config.js in downloaded zip file and set the following values:

    module.exports = {
     'TelegramProductionURL': 'https://myapp-bot-app.herokuapp.com/', // your heroku app do not forget trailing "/" !!
     'TelegramToken': 'telegram token here', // Telegram token you got from @BotFather
     'googleSheetKey': 'google sheet key', // the key of the google sheet (should be public!), extract key from the google sheet doc publich url
     "confTimeZone": "Europe/Berlin" // time zone of the conference so the bot could output events for the current time in the form like "Europe/Berlin", see http://momentjs.com/timezone/
    }


#### 7.Create a github account and make a new repository and upload downloaded project with edited Config.js file

#### 8. Go to heroku select your app goto "deploy" tab change "Deployment method" to "github"
#### Connected to your github account and search for your given repository name
#### Click On Enable Automatic deploys button.
#### then click on Deploy branch button.


#### How it works for enduser:
- add the bot to the Telegram using the link `https://telegram.me/yourbot` where `yourbot` will be replaced with your actual bot name
- Send the Code in first column of your worksheet
- bot will list all columns with matched code in 3 sheets
