var INTERVAL = 5000;
var HOME_CURRENCY = "USD";
var moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
});
var percentFormatter = new Intl.NumberFormat("percent",{
    style: "percent",
    maximumFractionDigits: 2
});

function updateCoin(crypto, currency) {
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
  updateCoin("btc",HOME_CURRENCY);
  updateCoin("eth",HOME_CURRENCY);
  updateCoin("ltc",HOME_CURRENCY);
}


updatePage();
setInterval(function() {
    updatePage();
}, INTERVAL);
