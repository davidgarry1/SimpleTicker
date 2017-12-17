var dateObj = new Date();
dateObj.setDate(dateObj.getDate() - 10);
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

var url = 'https://newsapi.org/v2/everything?' +
          'q=Investing+Cryptocurrency&' +
          'from='+year+'-'+month+'-'+day+'&' +
          'sortBy=popularity&' +
          'language=en&' +
          'apiKey=5448d59885724ecf9e865df785bbb667';

$.getJSON(url,function(news){
  var output = "<div class='article article-inverted'><div class='news-title'>Recent News From <a target='_blank' href='https://newsapi.org/'>NewsAPI</a></div></div>";
  for(var i=0; i<news.articles.length; i++){
    var article = "";
    if(i!= news.articles.length-1){
      article += "<div class='article border-bottom'>";
    }else{
      article += "<div class='article'>";
    }
    article += "<a target='_blank' href='";
    article += news.articles[i].url;
    article += "' title='";
    article += news.articles[i].description;
    article += "'>";
    article +="<div class='article-title'>";
    article += news.articles[i].title;
    article += "</div></a><div class='article-meta'><span class='article-sitename'>";
    article += news.articles[i].source.name;
    article += "</span>&nbsp&nbsp<span class='article-time'>";
    article += convertTimestampToLocaleString(news.articles[i].publishedAt);
    article += "</span></div></div>";
    article += "";
    output += article;
  }
  $("#newsfeed").html(output);
}).fail(function(){
  $("#newsfeed").html("<div class='article borderless'><div class='article-title'>Error loading newsfeed.<br><br>If this problem is persistent, please email us at <a target='_blank' href='mailto:bugs@simpleticker.com'>bugs@simpleticker.com</a>.</div></div>");
});

function convertTimestampToLocaleString(timeString){
  return new Date(timeString).toLocaleString('en-US');
}
