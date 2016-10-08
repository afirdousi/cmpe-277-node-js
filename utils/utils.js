/**
 * Created by anasrazafirdousi on 10/8/16.
 */
var cheerio = require('cheerio');
var request = require('request');

exports.getDataFromUTCSecond = function(seconds) {
    var utcSeconds = seconds;
    var d = new Date(0);
    d.setUTCSeconds(utcSeconds);
    return d.getMonth() + "/" + d.getDate() + "/" + d.getYear();
};

exports.getNewsDetails = function (res,dataPath) {

    var url = dataPath.accessURL.main;// 'http://www.imdb.com/title/tt1229340/';
    var news = [];

    var that = this;

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var title, release, rating;
            var json = { title : "", release : "", rating : ""};

            //Title & Publisher & Excerpt & Image URL (Appending empty excerpt & imageURL for now : TODO: Need to fix this)
            //$(".sparrow-item .title-link__title-text").filter(function(){
            $(dataPath.main + " " + dataPath.title).filter(function(){

                var data = $(this);
                news.push({"title":data[0].children[0].data,"publisher":dataPath.publisher,"excerpt":"","imageURL":""});

            });

            //Date
            var counter = 0;
            //$(".sparrow-item .date.date--v2").filter(function(){
            $(dataPath.main+ " "+dataPath.date).filter(function(){

                var data = $(this);

                if(data[0].attribs["data-seconds"]) { //specific to BBC
                    news[counter].date = that.getDataFromUTCSecond(data[0].attribs["data-seconds"]);
                }else{
                    //specific to CNN since the news section we are scrapping from CNN does not have date section
                    var date = new Date();
                    news[counter].date =  date.getMonth() + "/" + date.getDate() + "/" + date.getYear();
                }



                counter++;

            });
            counter = 0; //resetting counter;

            //NewsID which is basically a HREF LINK
            //$(".sparrow-item a.title-link").filter(function(){
            $(dataPath.main+ " "+dataPath.link).filter(function(){

                var data = $(this);
                //news.push({"title":data[0].children[0].data});
                news[counter].newsID = dataPath.accessURL.main + data[0].attribs.href;
                counter++;

            });
            counter = 0; //resetting counter;

            res.send(news);


        }
    })

};