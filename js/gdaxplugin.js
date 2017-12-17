var INTERVAL = 1100;
var HOME_CURRENCY = "USD";
var CURRENT_COIN_NUM = 0;

function updateCoin(crypto, currency) {
    var moneyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: HOME_CURRENCY,
        minimumFractionDigits: 2
    });
    var percentFormatter = new Intl.NumberFormat("percent",{
        style: "percent",
        maximumFractionDigits: 2
    });
    $.getJSON("https://api.gdax.com/products/"+crypto+"-"+currency+"/ticker", function(ticker) {
        $("#"+crypto+"price").html(moneyFormatter.format(ticker.price));
        $.getJSON("https://api.gdax.com/products/"+crypto+"-"+currency+"/stats", function(t) {
            $("#"+crypto+"open").html(percentFormatter.format(((ticker.price/t.open)-1)));
            $("#"+crypto+"high").html(moneyFormatter.format(t.high));
            $("#"+crypto+"low").html(moneyFormatter.format(t.low));
        });
    });
}

function updatePage(){
  CURRENT_COIN_NUM++;
  if(CURRENT_COIN_NUM>3){
    CURRENT_COIN_NUM = 1;
  }
  if(CURRENT_COIN_NUM == 1){
    updateCoin("btc",HOME_CURRENCY);
  } else if(CURRENT_COIN_NUM == 2){
    updateCoin("eth",HOME_CURRENCY);
  } else {
    updateCoin("ltc",HOME_CURRENCY);
  }
}


updatePage();
setInterval(function() {
    updatePage();
}, INTERVAL);
