$.getJSON("http://simpleticker.com/json/news.json",function(news){
  var output = "<div class='article'><div class='article-title'>Recent News</div></div>";
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
  return new Date(timeString.substr(0, 4) + "-" + timeString.substr(4, 2) + "-" + timeString.substr(6)).toLocaleString('en-US');
}
