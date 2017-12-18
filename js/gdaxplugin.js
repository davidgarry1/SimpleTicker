var INTERVAL = 1500; //Rate limits available at https://docs.gdax.com/#rate-limits
var CURRENT_COIN_NUM = 0;
var HOME_CURRENCY = "USD";
var GRANULARITY = 60*1000; //60 seconds
//Google Charts



$("#cusd").click(function(){
  HOME_CURRENCY = "USD";
  $("#activec").html(HOME_CURRENCY);
  updatePage(true);
  setTimeout(function(){
    updateCharts(true);
  }, 500);
});
$("#ceur").click(function(){
  HOME_CURRENCY = "EUR";
  $("#activec").html(HOME_CURRENCY);
  updatePage(true);
  setTimeout(function(){
    updateCharts(true);
  }, 500);
});
$("#cgbp").click(function(){
  HOME_CURRENCY = "GBP";
  $("#activec").html(HOME_CURRENCY);
  updatePage(true);
  setTimeout(function(){
    updateCharts(true);
  }, 500);
});

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
        if(crypto == "btc") document.title = moneyFormatter.format(ticker.price) + "-BTC | Simple Ticker";
        $.getJSON("https://api.gdax.com/products/"+crypto+"-"+currency+"/stats", function(t) {
            $("#"+crypto+"open").html(percentFormatter.format(((ticker.price/t.open)-1)));
            changeColor(crypto+"price", ((ticker.price/t.open)-1));
            changeColor(crypto+"open", ((ticker.price/t.open)-1));
            $("#"+crypto+"high").html(moneyFormatter.format(t.high));
            $("#"+crypto+"low").html(moneyFormatter.format(t.low));
        }).fail(function(){
          console.log("Too many requests to GDAX API");
        });
    }).fail(function(){
      console.log("Too many requests to GDAX API");
    });
}

function changeColor(elemID, num){
  $("#"+elemID).removeClass("red");
  $("#"+elemID).removeClass("green");
  if(num >= 0){
    $("#"+elemID).addClass("green");
  } else {
    $("#"+elemID).addClass("red");
  }
}

function updatePage(all){
  times = 1;
  if(all){
    times = 3;
  }
  for(var i=0; i<times; i++){
    if(++CURRENT_COIN_NUM>3){
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
}

updatePage(true);
setTimeout(function(){
  updateCharts(true);
}, 1000);


setInterval(function() {
    updatePage(false);
}, INTERVAL);

$(window).resize(function(){
  updateCharts(true);
});

setInterval(function() {
  updateCharts(false);
}, GRANULARITY);

function updateCharts(hardReset){
  if(hardReset){
    firstBTCDraw = false;
    firstETHDraw = false;
    firstLTCDraw = false;
  }
  drawChart("btc", HOME_CURRENCY, hardReset);
  drawChart("eth", HOME_CURRENCY, hardReset);
  drawChart("ltc", HOME_CURRENCY, hardReset);
}

function retryCharts(){
    setTimeout(function(){
      console.log("Attemping redraw");
      if(!firstBTCDraw) drawChart("btc", HOME_CURRENCY, false);
      if(!firstLTCDraw) drawChart("ltc", HOME_CURRENCY, false);
      if(!firstETHDraw) drawChart("eth", HOME_CURRENCY, false);
    },1500);
}

var firstBTCDraw = false;
var firstETHDraw = false;
var firstLTCDraw = false;


function drawChart(crypto, currency, hardReset) {
  if(hardReset){
    document.getElementById(crypto+'chart').innerHTML = " Loading...";
  }

  if((crypto == "ltc" || crypto == "eth") && currency == "GBP"){
    currency = "BTC"; //no GBP exchange for LTC/ETH
  }

$.getJSON("https://api.gdax.com/products/"+crypto+"-"+currency+"/candles?granularity="+GRANULARITY/1000, function(candles) {
  console.log("Drawing "+crypto+"-"+currency+" chart");
  if(crypto == "btc") firstBTCDraw = true;
  if(crypto == "eth") firstETHDraw = true;
  if(crypto == "ltc") firstLTCDraw = true;
  var chartCandles = [];

  for(var i=0; i<60; i++){
    var time = candles[i][0];
    var low = candles[i][1];
    var high = candles[i][2];
    var open = candles[i][3];
    var close = candles[i][4];
    var volume = candles[i][5];
    chartCandles[i] = [0,0,0,0,0];
    chartCandles[i][0] = new Date(time*1000);
    chartCandles[i][1] = low;
    chartCandles[i][2] = open;
    chartCandles[i][3] = close;
    chartCandles[i][4] = high;
  }


    var data = google.visualization.arrayToDataTable(chartCandles, true);// Treat first row as data as well.

    var options = {
        legend: 'none',
        bar: {
            groupWidth: '100%'
        }, // Remove space between bars.
        colors: ['lightgrey'],
        candlestick: {
            fallingColor: {
                stroke: 'black',
                strokeWidth: 0,
                fill: '#a52714'
            }, // red
            risingColor: {
                stroke: 'black',
                strokeWidth: 0,
                fill: '#0f9d58'
            }, // green
        },
        chartArea: {
            left: '8%',
            bottom: '10%',
            width: '91%',
            height: '85%',
        },
        vAxis: {

            titleTextStyle: {
                color: 'black'
            },
            gridlines: {
                color: 'lightrey',

            },
        },

        backgroundColor: 'white',
        fontName: 'Consolas',
        hAxis: {
            logscale: false
        },
        hAxis: {
            gridlines: {
                color: 'lightgrey',

            },

        },
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById(crypto+'chart'));

    chart.draw(data, options);
}).fail(function(){
    console.log("Chart API Call Failed");
    retryCharts();
});
}
