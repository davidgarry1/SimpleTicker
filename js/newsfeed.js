$.getJSON("https://davidgarry1.github.io/SimpleTicker/json/news.json",function(news){
  var output = "";
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
  $("#newsfeed").html("Error loading feed.");
});

function convertTimestampToLocaleString(timeString){
  string = timeString.substr(0, 4) + "-" + timeString.substr(4, 2) + "-" + timeString.substr(6);
  console.log(string);
  return new Date(string).toLocaleString('en-US');
}
