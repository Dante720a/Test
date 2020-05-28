// Created by Evgenii Mironichev, Copyright 2016,
// based on this awesome tutorial: https://mvalipour.github.io/node.js/2015/11/10/build-telegram-bot-nodejs-heroku/

var config = require('./config'); // rename config.js.example into config.js and set keys and tokens inside it

var Bot = require('node-telegram-bot-api');
var bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(config.TelegramToken);
  bot.setWebHook(config.TelegramProductionURL + bot.token);
}
else {
  bot = new Bot(config.TelegramToken, { polling: true });
}

//var Bot = require('node-telegram-bot-api'),
//    bot = new Bot(config.TelegramToken, { polling: true });

console.log('secon-bot server started...');

// Make sure it is public or set to Anyone with link can view 
// "od6" is the fist worksheet in the spreadsheet
var WrkSheet01 = "https://spreadsheets.google.com/feeds/list/" + config.googleSheetKey + "/1/public/values?alt=json";

var moment = require('moment-timezone');

bot.onText(/(.+)$/, function (msg, match) {
    // keywords are anything typed in
  var keywords = match[1];
  var request = require("request");
  var formattedAnswer = "";     

// send request to retrieve the spreadsheet as the JSON 


//Start of Get Sheet1

    request(WrkSheet01, function (error, response, body) {
        
		
		
    
        var parsed = JSON.parse(body);
        var targetTime = NaN;   
	   if (!isNaN(keywords))   // isNaN returns false if the value is number
       	   {
            try{
                targetTime = parseInt(keywords, 10);
            }
            catch(e){
                targetTime = NaN;
            }
        }
        
        if (isNaN(targetTime))
            targetTime = -1;
        
       formattedAnswer = "";  
        
        // debug purposes: echo from id: 
        // formattedAnswer += "\nMsg.from.id=" + msg.from.id + "\n";
    
        var currentHours = parseInt(moment().tz(config.confTimeZone).format('HH'),10);
        var currentMinutes = parseInt(moment().tz(config.confTimeZone).format('mm'),10);
        // console.log("Current hours: " + currentHours);
        var currentAnswer = "";
        
        var itemsFound = 0;
        // sending answers
        parsed.feed.entry.forEach(function(item){
                // get the time(in hours) from the very first column
                var itemTime = NaN;
                var itemTitle = item.title.$t
                try{
                    itemTime = parseInt(itemTitle, 10);
                }
                catch(e)
                {
                    itemTime = NaN;
                }
                
                if (
                    (!isNaN(itemTime) && itemTime == targetTime) ||
                    (isNaN(itemTime) && itemTitle.toLowerCase().trim() == keywords.toLowerCase().trim())
                    )
                {
                    // add the line break if not the first answer
                    if (itemsFound==0) 
                        formattedAnswer += "";
			
			
        	
                    else 
                        formattedAnswer += "\n";
                        
                    itemsFound++;
                    formattedAnswer += item.content.$t; // add item content, '\u27a1' is the arrow emoji
			
			
                }
				
				
				
                
                // else doing nothing
        });
        
       
        // send message telegram finally
	
	var MMSG1 = formattedAnswer;
	var MMSG1F = MMSG1.substring(6, 15);
	setTimeout(() => { 
		bot.sendMessage(msg.chat.id, MMSG1F).then(function () {
        	});
	}, 500);


       
    
    });

//End of Get Sheet1

	
});
module.exports = bot;
