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
var WrkSheet02 = "https://spreadsheets.google.com/feeds/list/" + config.googleSheetKey + "/2/public/values?alt=json";
var WrkSheet03 = "https://spreadsheets.google.com/feeds/list/" + config.googleSheetKey + "/3/public/values?alt=json";

var moment = require('moment-timezone');

bot.onText(/(.+)$/, function (msg, match) {
    // keywords are anything typed in
  var keywords = match[1];
  var request = require("request");
  var formattedAnswer = "";     
  var formattedAnswerF =  ""; 
// send request to retrieve the spreadsheet as the JSON 


//Start of Get Sheet1

    request(WrkSheet01, function (error, response, body) {
        
		
		
		if (error || response.statusCode != 200) {
            console.log('Error: '+error); // Show the error
            console.log('Status code: ' + response.statusCode); // Show the error
            return;
        }
        
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
                else if (currentHours == itemTime) // else collect items for the current hour
                {
                    if (currentAnswer == '')
                        currentAnswer == 'Starting from ' + currentHours + " h the following talks are goinf:\n";
                    else 
                        currentAnswer += "\n"; 
                        
                    currentAnswer += item.content.$t; // get item content, '\u27a1' is the arrow emoji
                }
                
                // else doing nothing
        });
        
       



	   
		// if no items were found for the given time 
        if (itemsFound == 0)
        {
            if (targetTime<0 || targetTime>24)
               // formattedAnswer = "اطلاعاتی پیدا نشد" + ".\n"+ "لطفاً کد رابصورت صحیح وارد نمایید" + ".\n";
		    formattedAnswer = "";
            else 
                // formattedAnswer = " اطلاعاتی پیدا نشد( " + targetTime+ " ч)";
		    formattedAnswer = "";
                
            // output current answer
            if (currentAnswer != '')
            {
                formattedAnswer += "Hi! As of " + currentHours + ":" + currentMinutes + " " + config.confTimeZone+ " these talks are going:\n";
                formattedAnswer += currentAnswer;
            }
        }

 
        // send message telegram finally
	
	var MMSG1 = formattedAnswer; 
	var MMSG1F = MMSG1.substring(5, 100).replace(",", "\n").replace(",", " ");
	setTimeout(() => {bot.sendMessage(msg.chat.id, MMSG1F).then(function () {});
	}, 500);


       
    
    });

//End of Get Sheet1



//Start of Get Sheet2

    request(WrkSheet02, function (error, response, body) {
        
		
		
	if (error || response.statusCode != 200) {
        console.log('Error: '+error); // Show the error
        console.log('Status code: ' + response.statusCode); // Show the error
            return;
        }
        
        parsed = JSON.parse(body);
        targetTime = NaN;   
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
    
        currentHours = parseInt(moment().tz(config.confTimeZone).format('HH'),10);
        currentMinutes = parseInt(moment().tz(config.confTimeZone).format('mm'),10);
        // console.log("Current hours: " + currentHours);
        currentAnswer = "";
        
        itemsFound = 0;
        // sending answers
        parsed.feed.entry.forEach(function(item){
                // get the time(in hours) from the very first column
                itemTime = NaN;
                itemTitle = item.title.$t
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
                        //formattedAnswer += "\n";
			formattedAnswer += "\n";
                    else 
                        
			//formattedAnswer = formattedAnswer.substring(6, 100);   
			formattedAnswer += "\n";
                        			
                        itemsFound++;
                    	formattedAnswer += "" + item.content.$t.substring(5, 100).replace(",", "   │").replace("موجودی:", " ").replace(", ", "   (").replace("واحد:", "") + ")" ; // add item content, '\u27a1' is the arrow emoji
			//FormattedAnswerF += item.content.$t; // add item content, '\u27a1' is the arrow emoji
			
                }
                else if (currentHours == itemTime) // else collect items for the current hour
                {
                    if (currentAnswer == '')
                        currentAnswer == 'Starting from ' + currentHours + " h the following talks are goinf:\n";
                    else 
                        currentAnswer += "C"+ "\n"; 
                        
                    currentAnswer += item.content.$t; // get item content, '\u27a1' is the arrow emoji
                }
                
                // else doing nothing
        });
        
       



	   
		// if no items were found for the given time 
        if (itemsFound == 0)
        {
            if (targetTime<0 || targetTime>24)
                //formattedAnswer = "اطلاعاتی برای کد وارد شده پیدا نشد" + ".\n"+ "لطفاً کد رابصورت صحیح وارد نمایید" + ".\n";
           formattedAnswer = "";
		    else 
                //formattedAnswer = "پیدا نشد ( " + targetTime+ " ч)";
                formattedAnswer = "";
            // output current answer
            if (currentAnswer != '')
            {
                formattedAnswer += "Hi! As of " + currentHours + ":" + currentMinutes + " " + config.confTimeZone+ " these talks are going:\n";
                formattedAnswer += currentAnswer;
            }
        }
 

        // send message telegram finally
	formattedAnswer += "\n" + "\n" + '\uD83C\uDF38' + " گنجی " + '\uD83C\uDF38';
	var MMSG2 = formattedAnswer; 
	setTimeout(() => { 
		bot.sendMessage(msg.chat.id, MMSG2).then(function () {
        	});
	}, 2000);


	    
    });

//End of Get Sheet2
	
	
});
module.exports = bot;
