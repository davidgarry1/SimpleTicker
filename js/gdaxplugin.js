var INTERVAL = 1500; //Rate limits available at https://docs.gdax.com/#rate-limits
var CURRENT_COIN_NUM = 0;
var HOME_CURRENCY = "USD";
var GRANULARITY = 60 * 1000; //60 seconds
var CHART_TYPE = "line";

$("#candle").click(function() {
    CHART_TYPE = "candle";
    $("#activechart").html("Chart: Candlestick");
    updateCharts(true);
    setCookie("CHART_TYPE","#candle");
});

$("#line").click(function() {
    CHART_TYPE = "line";
    $("#activechart").html("Chart: Line");
    updateCharts(true);
    setCookie("CHART_TYPE","#line");
});

$("#combo").click(function() {
    CHART_TYPE = "both";
    $("#activechart").html("Chart: Combo");
    updateCharts(true);
    setCookie("CHART_TYPE","#combo");
});

$("#min").click(function() {
    GRANULARITY = 60*1000;
    $("#activet").html("Interval: 1 Min");
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    eraseCookie("GRANULARITY");
});

$("#hour").click(function() {
    GRANULARITY = 60*60*1000;
    $("#activet").html("Interval: 1 Hour");
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    setCookie("GRANULARITY","#hour");
});

$("#day").click(function() {
    GRANULARITY = 60*60*24*1000;
    $("#activet").html("Interval: 1 Day");
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    setCookie("GRANULARITY","#day");
});

$("#week").click(function() {
    GRANULARITY = 60*60*24*7*1000;
    $("#activet").html("Interval: 1 Week");
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    setCookie("GRANULARITY","#week");
});


$("#cusd").click(function() {
    HOME_CURRENCY = "USD";
    $("#activec").html(HOME_CURRENCY);
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    eraseCookie("HOME_CURRENCY");
});
$("#ceur").click(function() {
    HOME_CURRENCY = "EUR";
    $("#activec").html(HOME_CURRENCY);
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    setCookie("HOME_CURRENCY","#ceur");
});
$("#cgbp").click(function() {
    HOME_CURRENCY = "GBP";
    $("#activec").html(HOME_CURRENCY);
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    setCookie("HOME_CURRENCY","#cgbp");
});


if(hasCookie("GRANULARITY")){
  $(getCookie("GRANULARITY")).click();
}

if(hasCookie("HOME_CURRENCY")){
  $(getCookie("HOME_CURRENCY")).click();
}

if(hasCookie("CHART_TYPE")){
  $(getCookie("CHART_TYPE")).click();
}


var moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: HOME_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
var percentFormatter = new Intl.NumberFormat("percent", {
    style: "percent",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
});
function updateCoin(crypto, currency) {
    var min_frac = 2;
    if ((crypto == "ltc" || crypto == "eth") && currency == "GBP") {
        currency = "BTC"; //no GBP exchange for LTC/ETH
        min_frac = 7;
    }
    moneyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: min_frac,
        maximumFractionDigits: min_frac
    });

    $.getJSON("https://api.gdax.com/products/" + crypto + "-" + currency + "/ticker", function(ticker) {
        $("#" + crypto + "price").html(moneyFormatter.format(ticker.price));
        if (crypto == "btc") document.title = moneyFormatter.format(ticker.price) + "-BTC | Simple Ticker";
        $.getJSON("https://api.gdax.com/products/" + crypto + "-" + currency + "/stats", function(t) {
            $("#" + crypto + "open").html(percentFormatter.format(((ticker.price / t.open) - 1)));
            changeColor(crypto + "price", ((ticker.price / t.open) - 1));
            changeColor(crypto + "open", ((ticker.price / t.open) - 1));
            $("#" + crypto + "high").html(moneyFormatter.format(t.high));
            $("#" + crypto + "low").html(moneyFormatter.format(t.low));
        }).fail(function() {
            console.log("Too many requests to GDAX API");
        });
    }).fail(function() {
        console.log("Too many requests to GDAX API");
    });
}

function changeColor(elemID, num) {
    $("#" + elemID).removeClass("red");
    $("#" + elemID).removeClass("green");
    if (num >= 0) {
        $("#" + elemID).addClass("green");
    } else {
        $("#" + elemID).addClass("red");
    }
}

function updatePage(all) {
    times = 1;
    if (all) {
        times = 3;
    }
    for (var i = 0; i < times; i++) {
        if (++CURRENT_COIN_NUM > 3) {
            CURRENT_COIN_NUM = 1;
        }
        if (CURRENT_COIN_NUM == 1) {
            updateCoin("btc", HOME_CURRENCY);
        } else if (CURRENT_COIN_NUM == 2) {
            updateCoin("eth", HOME_CURRENCY);
        } else {
            updateCoin("ltc", HOME_CURRENCY);
        }
    }
}

updatePage(true);
setTimeout(function() {
    updateCharts(true);
}, 1000);


setInterval(function() {
    updatePage(false);
}, INTERVAL);

$(window).resize(function() {
    updateCharts(true);
});

setInterval(function() {
    updateCharts(false);
}, GRANULARITY);

function updateCharts(hardReset) {
    if (hardReset) {
        firstBTCDraw = false;
        firstETHDraw = false;
        firstLTCDraw = false;
    }
    drawChart("btc", HOME_CURRENCY, hardReset);
    drawChart("eth", HOME_CURRENCY, hardReset);
    drawChart("ltc", HOME_CURRENCY, hardReset);
}

function retryCharts() {
    setTimeout(function() {
        console.log("Attemping redraw");
        if (!firstBTCDraw) drawChart("btc", HOME_CURRENCY, false);
        if (!firstLTCDraw) drawChart("ltc", HOME_CURRENCY, false);
        if (!firstETHDraw) drawChart("eth", HOME_CURRENCY, false);
    }, 1500);
}

var firstBTCDraw = false;
var firstETHDraw = false;
var firstLTCDraw = false;


function drawChart(crypto, currency, hardReset) {
    if (hardReset) {
        document.getElementById(crypto + 'chart').innerHTML = " Loading...";
    }
    var min_frac = 2;
    if ((crypto == "ltc" || crypto == "eth") && currency == "GBP") {
        currency = "BTC"; //no GBP exchange for LTC/ETH
        min_frac = 7;
    }
    moneyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: min_frac,
        maximumFractionDigits: min_frac
    });
    console.log("Getting " + crypto + "-" + currency + " chart");
    var dateObj = new Date( (new Date)*1 - GRANULARITY*61 );//ms*seconds*minutes*hours*days*weeks*months
    var loc = "https://api.gdax.com/products/" + crypto + "-" + currency + "/candles?granularity=" + GRANULARITY/1000 ;

    $.getJSON(loc, function(candles) {
        if (crypto == "btc") firstBTCDraw = true;
        if (crypto == "eth") firstETHDraw = true;
        if (crypto == "ltc") firstLTCDraw = true;
        var chartCandles = [];
        if(CHART_TYPE == "both"){
          chartCandles[0] = ["Date", "Low", "Open", "Close", "High", "Tooltip", "Close"];
        } else if(CHART_TYPE == "candle") {
          chartCandles[0] = ["Date", "Low", "Open", "Close", "High", "Tooltip"];
        } else if(CHART_TYPE == "line"){
          chartCandles[0] = ["Date", "Close"];
        }

        for (var i = 1; i < 1+candles.length && new Date(candles[i-1][0] * 1000) >= dateObj; i++) {
            var time = candles[i-1][0];
            var low = candles[i-1][1];
            var high = candles[i-1][2];
            var open = candles[i-1][3];
            var close = candles[i-1][4];
            var volume = candles[i-1][5];
            if(CHART_TYPE == "both"){
              chartCandles[i] = [0, 0, 0, 0, 0, 0, 0];
            } else if(CHART_TYPE == "candle"){
              chartCandles[i] = [0, 0, 0, 0, 0, 0];
            } else if(CHART_TYPE == "line"){
              chartCandles[i] = [0, 0];
            }

            chartCandles[i][0] = new Date(time * 1000);
            if(CHART_TYPE == "both" || CHART_TYPE == "candle"){
              chartCandles[i][1] = low;
              chartCandles[i][2] = open;
              chartCandles[i][3] = close;
              chartCandles[i][4] = high;
              chartCandles[i][5] = chartCandles[i][0].toLocaleString() + ": "+moneyFormatter.format(chartCandles[i][3]);
              if(CHART_TYPE == "both"){
                chartCandles[i][6] = close;
              }
            } else if(CHART_TYPE == "line"){
              chartCandles[i][1] = close;

            }
        }
        var formatter;
        if(currency=="USD"){
          formatter = "$"+'#,###.##';
        } else if(currency=="EUR"){
          formatter = "€"+'#,###.##';
        } else if(currency=="GBP"){
          formatter = "£"+'#,###.##';
        } else if(currency=="BTC"){
          formatter = "BTC"+'#,###.#######';
        }
        var data = google.visualization.arrayToDataTable(chartCandles, false); // DO NOT Treat first row as data as well.
        if(CHART_TYPE == "both" || CHART_TYPE == "candle"){
          data.setColumnProperty(5, 'role', 'tooltip');
          var options = {
              legend: 'none',
              bar: {
                  groupWidth: '100%'
              }, // Remove space between bars.
              colors: ['lightgrey', 'black'],
              candlestick: {
                  fallingColor: {
                      stroke: 'black',
                      strokeWidth: 0,
                      fill: 'red'
                  }, // red
                  risingColor: {
                      stroke: 'black',
                      strokeWidth: 0,
                      fill: 'green'
                  }, // green
              },
              chartArea: {
                  left: '10%',
                  bottom: '10%',
                  width: '89%',
                  height: '85%',
              },
              vAxis: {
                  titleTextStyle: {
                      color: 'black'
                  },
                  gridlines: {
                      color: 'lightgrey',

                  },
                  textStyle: {
                      color: 'black'
                  },
                  titleTextStyle: {
                      color: 'black'
                  },
                  format:formatter,
              },

              backgroundColor: 'white',
              titleTextStyle: {
                      color: 'black'
                  },
              fontName: 'Consolas',
              hAxis: {
                  logscale: false,
                  textStyle: {
                      color: 'black'
                  },
                  titleTextStyle: {
                      color: 'black'
                  },
                  gridlines: {
                      color: 'lightgrey',
                      count: 6
                  },

              },
              crosshair: {
                trigger: 'both',
              },
              seriesType: 'candlesticks',
              series: {
                1: {
                  type: 'area'
                }
              }
          };

        } else if(CHART_TYPE == "line"){

          var options = {
              legend: 'none',
              bar: {
                  groupWidth: '100%'
              }, // Remove space between bars.
              colors: ['black'],
              candlestick: {
                  fallingColor: {
                      stroke: 'black',
                      strokeWidth: 0,
                      fill: 'red'
                  }, // red
                  risingColor: {
                      stroke: 'black',
                      strokeWidth: 0,
                      fill: 'green'
                  }, // green
              },
              chartArea: {
                  left: '10%',
                  bottom: '10%',
                  width: '89%',
                  height: '85%',
              },
              vAxis: {
                  titleTextStyle: {
                      color: 'black'
                  },
                  gridlines: {
                      color: 'lightgrey',

                  },
                  textStyle: {
                      color: 'black'
                  },
                  titleTextStyle: {
                      color: 'black'
                  },
                  format:formatter,
              },

              backgroundColor: 'white',
              titleTextStyle: {
                      color: 'black'
                  },
              fontName: 'Consolas',
              hAxis: {
                  logscale: false,
                  textStyle: {
                      color: 'black'
                  },
                  titleTextStyle: {
                      color: 'black'
                  },
                  gridlines: {
                      color: 'lightgrey',
                      count: 6
                  },

              },
              crosshair: {
                trigger: 'both',
              },
              seriesType: 'area',
          };

        }

        var chart = new google.visualization.ComboChart(document.getElementById(crypto + 'chart'));

        chart.draw(data, options);
    }).fail(function() {
        console.log("Chart API Call Failed");
        retryCharts();
    });
}
