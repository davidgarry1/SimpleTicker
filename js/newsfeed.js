$.getJSON("https://davidgarry1.github.io/SimpleTicker/json/news.json",function(news){
  var output = "";
  for(var i=0; i<news.articles.length; i++){
    var article = "";
    article += "<a href='";
    article += news.articles[i].url;
    article += "' title='";
    article += news.articles[i].description;
    article += "'>";
    article += "<div class='article'><span class='article-sitename'>";
    article += news.articles[i].source.name;
    article += "</span> * <span class='article-title'>";
    article += news.articles[i].title;
    article += "</span> * <span class='article-time'>";
    article += convertTimestampToLocaleString(news.articles[i].publishedAt);
    article += "</span></div>";
    article += "</a>";
    output += article;
  }
  $("#newsfeed").html(output);
}).fail(function(){
  $("#newsfeed").html("Error loading feed.");
});

function convertTimestampToLocaleString(timeString){
  string = timeString.substr(0, 4) + "-" + timeString.substr(4, 2) + "-" + timeString.substr(6);
  console.log(string);
  return new Date(string).toLocaleString('en-US');
}
