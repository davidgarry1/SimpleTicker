var dateObj = new Date();
dateObj.setDate(dateObj.getDate() - 20);
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();
var page = 1;
var newsload = false;
var PAGE_LIM = 10;

function loadMoreNews(){
  var url = 'https://newsapi.org/v2/everything?' +
            'sources=business-insider,bloomberg,the-wall-street-journal,cnbc,ars-technica,crypto-coins-news,engadget,recode,techradar,the-verge,wired,techcrunch,the-next-web,hacker-news,abc-news,cnn,associated-press,the-washington-post,the-huffington-post,usa-today&' +
            'page='+page+'&' +
            'q=Cryptocurrency+Investing&' +
            'from='+year+'-'+month+'-'+day+'&' +
            'sortBy=popularity&' +
            'language=en&' +
            'apiKey=5448d59885724ecf9e865df785bbb667';
  var backupUrl = 'http://www.simpleticker.com/json/news.json';
  $.getJSON(url,function(raw){
    console.log("Fetched newsfeed");
    createArticleList(raw);
    PAGE_LIM = Math.min(PAGE_LIM, Math.floor(raw.totalResults/20)+1);
    newsload = true;
  }).fail(function(){
    if(page == 1){
      $.getJSON(backupUrl,function(raw){
        console.log("Using cached newsfeed");
        createArticleList(raw);
        newsload = true;
      }).fail(function(){
        console.log("Failed to load newsfeed");
        showErrorLoadingNews();
        newsload = true;
      });
    } else {
      console.log("Failed to load newsfeed for page "+page);
    }
  });
}

loadMoreNews();

function showErrorLoadingNews(){
  $("#newsfeed").html("<div class='article borderless'><div class='article-title'>Error loading newsfeed.<br><br>If this problem is persistent, please email us at <a target='_blank' href='mailto:bugs@simpleticker.com'>bugs@simpleticker.com</a>.</div></div>");
}

function createArticleList(news){
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
  $("#newsfeed").html(document.getElementById("newsfeed").innerHTML + output);
}

jQuery(function($) {
    $('#sidebar').on('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            if(newsload && page <= PAGE_LIM){
              page++;
              loadMoreNews();
            }
        }
    })
});

function convertTimestampToLocaleString(timeString){
  return new Date(timeString).toLocaleString('en-US');
}
