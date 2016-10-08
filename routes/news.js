var express = require('express');
var router = express.Router();

var newsDataEngine = require('../data/news');

var fs = require('fs');
var request = require('request');
var utils = require('../utils/utils');

function isProperDataSent(body) {
    return !body.emotion || !body.degree || !body.age || !body.ethnicity;
}

function selectDataSource(ethnicity) {

    //Possible Values: Caucasian,African,East Asian,South Asian,Hispanic

    if(ethnicity.trim().toLowerCase()!="caucasian"){
        return "BBC";
    }else{
        return "CNN";
    }

}

function getDataPaths(dataSource) {

    var dataPath = {};

    if(dataSource==="CNN"){
        //for CNN
        dataPath.accessURL = {};
        dataPath.accessURL.main = "http://www.cnn.com";
        dataPath.accessURL.world = "/world";
        dataPath.accessURL.asia = "/asia";
        dataPath.accessURL.europe = "/europe";
        dataPath.accessURL.america = "/americas";
        dataPath.accessURL.latin = dataPath.accessURL.america;

        dataPath.publisher = "CNN";
        dataPath.main = "article.cd--article"; //also check class 'cd--extra-small'
        dataPath.title = ".cd__headline-text";
        dataPath.excerpt = "";
        dataPath.date = ""; //Todo: Read a better section of CNN
        dataPath.link =".cd__headline a"



    }else{
        // for BBC
        dataPath.accessURL = {};
        dataPath.accessURL.main = "http://www.bbc.com/news";
        dataPath.accessURL.world = "/world";
        dataPath.accessURL.asia = "/world/asia";
        dataPath.accessURL.europe = "/world/europe";
        dataPath.accessURL.america = "/world/us_and_canada";
        dataPath.accessURL.latin = "/world/latin_america";

        dataPath.publisher = "BBC";
        dataPath.main = ".sparrow-item";
        dataPath.title = ".title-link__title-text";
        dataPath.excerpt = ".sparrow-item__summary";
        dataPath.date = ".date.date--v2"; // read attribute 'data-seconds'
        dataPath.link = "a.title-link"; //read 'href'

    }

    return dataPath;
}



router.post('/',function (req,res,next) {

    if(isProperDataSent(req.body)){
       res.send({error:"No data found in request body. Server is not able to decide which type of news you want."});
        return;
    }

    var emotion, degree, age,ethnicity ;
    var dataSource, dataPath;

    emotion = req.body.emotion || "";
    degree = req.body.degree || "";
    age = req.body.age || "";
    ethnicity = req.body.ethnicity || "";

    dataSource = selectDataSource(ethnicity);

    dataPath = getDataPaths(dataSource);

    utils.getNewsDetails(res,dataPath);

});


/* GET users listing. */
router.get('/test', function(req, res, next) {

    res.json([
            {
                newsID:5777,
                title:"U.K. pound plunges 6% in mysterious flash crash",
                excerpt:"The sudden plunge in early trading in Asia left investors stunned and analysts struggling to explain what could have caused such an unusual move.",
                details:"The sudden plunge in early trading in Asia left investors stunned and analysts struggling to explain what could have caused such an unusual move.'It was just another quiet day in Asia, and then, Bang! All the lights went red,'' said Matt Simpson, senior market analyst at ThinkMarkets in Singapore.The pound had already sunk to a fresh 31-year low of around $1.26 on Thursday over deepening concerns that the U.K.'s split from the European Union will hurt the country's economy. Strategists had widely forecast it would go lower, but not as rapidly as it did on Friday.The flash crash yanked the British currency down to near $1.18. It recovered most of the losses soon afterward to trade around $1.24.",
                publisher:"CNN",
                date:"10/06/2016",
                imageURL:"http://i2.cdn.turner.com/money/dam/assets/161007131114-pound-dollar-flash-crash-chart-780x439.png"
            },
        {
            newsID:5778,
            title:"Florida could be hit twice by Hurricane Matthew",
            excerpt:"Hurricane Matthew could take a turn and head back to Florida again after making landfall this week, according to some forecast models.",
            details:"Hurricane Matthew could take a turn and head back to Florida again after making landfall this week, according to some forecast models.The first impact to Central Florida will be more dangerous; Matthew could make landfall in Florida early Friday as a Category 4 hurricane, according to the latest projections. Authorities have urged more than 2 million people to leave their homes in coastal Florida, Georgia and South Carolina.",
            publisher:"CNN",
            date:"10/06/2016",
            imageURL:"https://cdn.rt.com/files/2016.10/original/57f5cba7c36188c22a8b4599.jpg"
        },
        {
            newsID:5779,
            title:"Florida could be hit twice by Hurricane Matthew",
            excerpt:"Hurricane Matthew could take a turn and head back to Florida again after making landfall this week, according to some forecast models.",
            details:"Hurricane Matthew could take a turn and head back to Florida again after making landfall this week, according to some forecast models.The first impact to Central Florida will be more dangerous; Matthew could make landfall in Florida early Friday as a Category 4 hurricane, according to the latest projections. Authorities have urged more than 2 million people to leave their homes in coastal Florida, Georgia and South Carolina.",
            publisher:"CNN",
            date:"10/06/2016",
            imageURL:"http://i2.cdn.turner.com/money/dam/assets/161007131114-pound-dollar-flash-crash-chart-780x439.png"
        },
        {
            newsID:5780,
            title:"Trump 'would cut 70% of federal rules'",
            excerpt:"US Republican presidential candidate Donald Trump has said he could cut as many as 70% of federal US regulations if he is elected.",
            details:"Mr Trump, who was speaking at an event in New Hampshire, blamed regulations for stifling business but said rules on safety and the environment could stay. Earlier, one of his advisers said 10% of regulations could be eliminated.He will face Democratic rival Hillary Clinton in the second televised debate in St Louis, Missouri, on Sunday.Trump campaign adviser Anthony Scaramucci, a Wall Street financier, had told Reuters news agency a Trump administration would push for a much lower level of regulation cuts.",
            publisher:"BBC",
            date:"10/06/2016",
            imageURL:"http://ichef.bbci.co.uk/news/660/cpsprodpb/091F/production/_91553320_mediaitem91553319.jpg"
        },
        {
            newsID:5781,
            title:"Fox News stars in feud over Trump",
            excerpt:"With just 32 days to go until Americans choose a new president, we're bringing you all the latest campaign news, including an unseemly spat between two Fox anchors.",
            details:"Two of the conservative news channel's biggest stars have turned their sharp tongues on one another after Sean Hannity accused Megyn Kelly of being in league with Hillary Clinton.The clash began when Kelly said on her Wednesday night programme that both Mrs Clinton and Donald Trump avoid tough media interviews. She said the Republican nominee 'will go on Hannity and pretty much only Hannity'.Pundits lined up on Wednesday to declare Mike Pence the winner of a debate many other pundits said doesn't matter anyway. But where Tim Kaine failed to land a punch, Latino scholars had more success.",
            publisher:"BBC",
            date:"10/06/2016",
            imageURL:"http://ichef.bbci.co.uk/news/660/cpsprodpb/14AA2/production/_91524648_kelly_hannity.jpg"
        },
        {
            newsID: 5782,
            title: "Italy salvaged a draw in a 2018 World Cup",
            excerpt: "Italy salvaged a draw in a 2018 World Cup qualifier against Spain with a late Daniele de Rossi penalty.",
            details: "Spain had 72.4% of possession in the first half but failed to score.They finally took the lead after 55 minutes when keeper Gianluigi Buffon missed an attempted clearance to leave Vitolo to sidefoot in.Italy rarely threatened but, after Sergio Ramos tripped Eder, De Rossi equalised to extend his country's unbeaten run in qualifiers to 52 gamesThe last time the Azzurri lost a World Cup or European qualifier was in September 2006 when they were beaten 3-1 by France on their way to reaching Euro 2008.Italy and Spain now have four points from two games, with Albania, who beat Liechtenstein 2-0, top of Group G on six points.",
            publisher: "BBC",
            date: "10/06/2016",
            imageURL: "http://ichef.bbci.co.uk/onesport/cps/800/cpsprodpb/E821/production/_91552495_de_rossi_getty2.jpg"
        }


    ]);

});


router.get('/:id',function (req, res, next) {

  newsDataEngine.helloWorld();

  var newsID = req.params.id;
  res.json({id:newsID,title:'Title of news with ID:'+ newsID,detail:'Details of news with ID:'+ newsID});
});


module.exports = router;
