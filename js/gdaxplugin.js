var INTERVAL = 1500; //Rate limits available at https://docs.gdax.com/#rate-limits
var CURRENT_COIN_NUM = 0;

function updateCoin(crypto, currency) {
    var min_frac = 2;
    if((crypto == "ltc" || crypto == "eth") && currency == "GBP"){
      currency = "BTC"; //no GBP exchange for LTC/ETH
      min_frac = 7;
    }
    var moneyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: min_frac,
        maximumFractionDigits: min_frac
    });
    var percentFormatter = new Intl.NumberFormat("percent",{
        style: "percent",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
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
