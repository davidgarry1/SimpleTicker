function w(){

var INTERVAL_PRICES = 1300; //Rate limits available at https://docs.gdax.com/#rate-limits
var INTERVAL_CHARTS = 60 * 1000; //Rate limits available at https://www.cryptocompare.com/api/#requests
var CURRENT_COIN_NUM = 0;
var HOME_CURRENCY = "USD";
var CHART_TYPE = "line";
var ACTIVE_TAB = "BTC";
var GRAN_HOUR = 1;
var GRAN_DAY = 2;
var GRAN_WEEK = 3;
var GRAN_MONTH = 4;
var GRAN_YEAR = 5;
var GRAN_ALL_TIME = 6;
var GRANULARITY = GRAN_HOUR;
var CRYPTOS = ["btc", "bch", "eth", "ltc"];
var percentFormatter = new Intl.NumberFormat("percent", {
    style: "percent",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
});
var pageInt, chartInt;
var callback = JSON.parse("{}");

$.each(CRYPTOS, function(i, v){
  callback[v] = true;
});

var cachedJSON = [];

google.charts.setOnLoadCallback(function() {
  checkCookies();
  setHandlers();
  resetIntervalsAndUpdateBoth();
});

function setHandlers() {
    var timeHelper;
    window.onresize = function(){
      $.each(CRYPTOS, function(i, v){
        hardResetData(v);
      });
      clearTimeout(timeHelper);
      timeHelper = setTimeout(function(){
        updateChartsUsingCache();
      },150);
    };
    $("#candle").click(function() {
        CHART_TYPE = "candle";
        $("#activechart").html("Chart: Candlestick");
        updateChartsUsingCache();
        setCookie("CHART_TYPE", "candle");
    });
    $("#line").click(function() {
        CHART_TYPE = "line";
        $("#activechart").html("Chart: Line");
        updateChartsUsingCache();
        setCookie("CHART_TYPE", "line");
    });
    $("#combo").click(function() {
        CHART_TYPE = "both";
        $("#activechart").html("Chart: Combo");
        updateChartsUsingCache();
        setCookie("CHART_TYPE", "both");
    });
    $("#hour").click(function() {
        GRANULARITY = GRAN_HOUR;
        $("#activet").html("Interval: 1 Hour");
        $("span.interval").html("1 Hour Stats");
        resetIntervalsAndUpdateCharts();
        setCookie("GRANULARITY", GRAN_HOUR);
    });
    $("#day").click(function() {
        GRANULARITY = GRAN_DAY;
        $("#activet").html("Interval: 1 Day");
        $("span.interval").html("1 Day Stats");
        resetIntervalsAndUpdateCharts();
        setCookie("GRANULARITY", GRAN_DAY);
    });
    $("#week").click(function() {
        GRANULARITY = GRAN_WEEK;
        $("#activet").html("Interval: 1 Week");
        $("span.interval").html("1 Week Stats");
        resetIntervalsAndUpdateCharts();
        setCookie("GRANULARITY", GRAN_WEEK);
    });
    $("#month").click(function() {
        GRANULARITY = GRAN_MONTH;
        $("#activet").html("Interval: 1 Month");
        $("span.interval").html("1 Month Stats");
        resetIntervalsAndUpdateCharts();
        setCookie("GRANULARITY", GRAN_MONTH);
    });
    $("#year").click(function() {
        GRANULARITY = GRAN_YEAR;
        $("#activet").html("Interval: 1 Year");
        $("span.interval").html("1 Year Stats");
        resetIntervalsAndUpdateCharts();
        setCookie("GRANULARITY", GRAN_YEAR);
    });
    $("#alltime").click(function() {
        GRANULARITY = GRAN_ALL_TIME;
        $("#activet").html("Interval: All Time");
        $("span.interval").html("All Time Stats");
        resetIntervalsAndUpdateCharts();
        setCookie("GRANULARITY", GRAN_ALL_TIME);
    });
    $("#cusd").click(function() {
        HOME_CURRENCY = "USD";
        $("#activec").html(HOME_CURRENCY);
        resetIntervalsAndUpdateBoth();
        setCookie("HOME_CURRENCY", "USD");
    });
    $("#ceur").click(function() {
        HOME_CURRENCY = "EUR";
        $("#activec").html(HOME_CURRENCY);
        resetIntervalsAndUpdateBoth();
        setCookie("HOME_CURRENCY", "EUR");
    });
    $("#cgbp").click(function() {
        HOME_CURRENCY = "GBP";
        $("#activec").html(HOME_CURRENCY);
        resetIntervalsAndUpdateBoth();
        setCookie("HOME_CURRENCY", "GBP");
    });

    $.each(CRYPTOS, function(i, v){
      $("#tab"+v).click(function() {
          ACTIVE_TAB = v.toUpperCase();
          $("#activetab").html("Tab: "+ACTIVE_TAB);
          document.title = $("#" + ACTIVE_TAB.toLowerCase() + "price").html() + "-"+ACTIVE_TAB+" | Simple Ticker";
          setCookie("ACTIVE_TAB", v.toUpperCase());
      });
    });
}

function checkCookies() {
    if (hasCookie("GRANULARITY")) {
        GRANULARITY = getCookie("GRANULARITY");
        if (GRANULARITY == GRAN_HOUR) {
            $("#activet").html("Interval: 1 Hour");
            $("span.interval").html("1 Hour Stats");
        } else if (GRANULARITY == GRAN_DAY) {
            $("#activet").html("Interval: 1 Day");
            $("span.interval").html("1 Day Stats");
        } else if (GRANULARITY == GRAN_WEEK) {
            $("#activet").html("Interval: 1 Week");
            $("span.interval").html("1 Week Stats");
        } else if (GRANULARITY == GRAN_MONTH) {
            $("#activet").html("Interval: 1 Month");
            $("span.interval").html("1 Month Stats");
        } else if (GRANULARITY == GRAN_YEAR) {
            $("#activet").html("Interval: 1 Year");
            $("span.interval").html("1 Year Stats");
        } else if (GRANULARITY == GRAN_ALL_TIME) {
            $("#activet").html("Interval: All Time");
            $("span.interval").html("All Time Stats");
        } else {
          GRANULARITY = GRAN_HOUR;
          $("#activet").html("Interval: 1 Hour");
          $("span.interval").html("1 Hour Stats");
        }
    }

    if (hasCookie("ACTIVE_TAB")) {
        ACTIVE_TAB = getCookie("ACTIVE_TAB");
    }

    if (hasCookie("HOME_CURRENCY")) {
        HOME_CURRENCY = getCookie("HOME_CURRENCY");
        $("#activec").html(HOME_CURRENCY);
    }

    if (hasCookie("CHART_TYPE")) {
        CHART_TYPE = getCookie("CHART_TYPE");
        if (CHART_TYPE == "candle") {
            $("#activechart").html("Chart: Candlestick");
        } else if (CHART_TYPE == "line") {
            $("#activechart").html("Chart: Line");
        } else if (CHART_TYPE == "both") {
            $("#activechart").html("Chart: Combo");
        } else {
            CHART_TYPE = "line";
            $("#activechart").html("Chart: Line");
        }
    }
}


function resetIntervalsAndUpdateBoth() {
    resetIntervalsAndUpdateCharts();
    resetIntervalsAndUpdatePrices();
}

function resetIntervalsAndUpdatePrices() {
    clearInterval(pageInt);
    updatePage(true);
    pageInt = setInterval(function() {
        updatePage(false);
    }, INTERVAL_PRICES);
}

function resetIntervalsAndUpdateCharts() {
    clearInterval(chartInt);
    updateCharts(true);
    chartInt = setInterval(function() {
        updateCharts(false);
    }, INTERVAL_CHARTS);
}

function updateChartsUsingCache() {
    console.log("NEXT CHART LOAD SET FROM LOCAL CACHE");
    $.each(CRYPTOS, function(i, v){
      completeChartDraw(v, HOME_CURRENCY, cachedJSON[v]);
    });
}


function updateCoin(crypto, currency) {
    var min_frac = 2;
    if (crypto.toLowerCase() != "btc" && currency == "GBP") {
        currency = "BTC"; //no GBP exchange for LTC/ETH/BCH
        min_frac = 7;
    }
    if(crypto.toLowerCase() == "bch"){
        currency = "USD";
        min_frac = 2;
    }
    $.getJSON("https://api.gdax.com/products/" + crypto.toUpperCase() + "-" + currency.toUpperCase() + "/ticker", function(ticker) {
        console.log("PRICE UPDATE: "+crypto.toUpperCase() + "-" + currency.toUpperCase());
        var moneyFormatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: min_frac,
            maximumFractionDigits: min_frac
        });
        $("#" + crypto.toLowerCase() + "price").html(moneyFormatter.format(ticker.price));
        if (crypto.toUpperCase() == ACTIVE_TAB){
          document.title = moneyFormatter.format(ticker.price) + "-"+crypto.toUpperCase()+" | Simple Ticker";
        }
    }).fail(function() {
        console.error("Too many requests to GDAX API");
    });
}

function changeColor(elemID, num) {
    $("#" + elemID).removeClass("red").removeClass("green");
    if (num >= 0) {
        $("#" + elemID).addClass("green");
    } else {
        $("#" + elemID).addClass("red");
    }
}

function updatePage(all) {
    if (all) {
        $.each(CRYPTOS, function(i, v){
           updateCoin(v, HOME_CURRENCY);
        });
    } else {
        if (++CURRENT_COIN_NUM > CRYPTOS.length) {
            CURRENT_COIN_NUM = 1;
        }
        updateCoin(CRYPTOS[CURRENT_COIN_NUM-1], HOME_CURRENCY);
    }
}

function updateCharts(hardReset) {
    $.each(CRYPTOS, function(i, v){
      drawChart(v, HOME_CURRENCY, hardReset);
    });
}

function updatePChange(crypto, open) {
    var innerd = $("#" + crypto + "price").text().replace(/[^0-9\.-]+/g, "");
    if (innerd != "...") {
        var percent = ((Number(innerd) / open) - 1);
        $("#" + crypto + "open").html(percentFormatter.format(percent));
        changeColor(crypto + "price", percent);
        changeColor(crypto + "open", percent);
    } else if (callback[crypto]) {
        callback[crypto] = false;
        setTimeout(function() {
            callback[crypto] = true;
            updatePChange(crypto, open);
        }, 100);
    }
}

function hardResetData(crypto){
  document.getElementById(crypto + 'chart').innerHTML = " Loading...";
  $("#" + crypto + "open").html("...");
  $("#" + crypto + "high").html("...");
  $("#" + crypto + "low").html("...");
  $("#" + crypto + "vol").html("...");
  $("#" + crypto + "open").removeClass("red");
  $("#" + crypto + "open").removeClass("green");
}

function drawChart(crypto, currency, hardReset) {
    if (hardReset) {
        hardResetData(crypto);
    }

    $.getJSON(getURL(crypto, currency), function(candles){
      console.log("CHART UPDATE: "+crypto.toUpperCase() + "-" + currency.toUpperCase());
      if (candles.Response != "Success") {
          console.error("CHART API Call Returned: " + candles.Response);
          return;
      }
      cachedJSON[crypto] = candles;
      completeChartDraw(crypto, currency, candles);
    }).fail(function() {
        console.error("CHART API Call Failed to Return");
    });
}

function getURL(crypto, currency){
  var loc;
  if (crypto.toLowerCase() != "btc" && currency == "GBP") {
      currency = "BTC"; //no GBP exchange for LTC/ETH/BCH
  }
  if(crypto.toLowerCase() == "bch"){
      currency = "USD";
  }
  if (GRANULARITY == GRAN_HOUR) {
      loc = "https://min-api.cryptocompare.com/data/histominute?fsym=" + crypto.toUpperCase() + "&tsym=" + currency.toUpperCase() + "&limit=60&aggregate=1&e=GDAX";
  } else if (GRANULARITY == GRAN_DAY) {
      loc = "https://min-api.cryptocompare.com/data/histominute?fsym=" + crypto.toUpperCase() + "&tsym=" + currency.toUpperCase() + "&limit=96&aggregate=15&e=GDAX";
  } else if (GRANULARITY == GRAN_WEEK) {
      loc = "https://min-api.cryptocompare.com/data/histohour?fsym=" + crypto.toUpperCase() + "&tsym=" + currency.toUpperCase() + "&limit=84&aggregate=2&e=GDAX";
  } else if (GRANULARITY == GRAN_MONTH) {
      loc = "https://min-api.cryptocompare.com/data/histohour?fsym=" + crypto.toUpperCase() + "&tsym=" + currency.toUpperCase() + "&limit=90&aggregate=8&e=GDAX";
  } else if (GRANULARITY == GRAN_YEAR) {
      loc = "https://min-api.cryptocompare.com/data/histoday?fsym=" + crypto.toUpperCase() + "&tsym=" + currency.toUpperCase() + "&limit=73&aggregate=5&e=GDAX";
  } else if (GRANULARITY == GRAN_ALL_TIME) {
      loc = "https://min-api.cryptocompare.com/data/histoday?fsym=" + crypto.toUpperCase() + "&tsym=" + currency.toUpperCase() + "&limit=100&aggregate=12&e=GDAX";
  }
  console.log(loc);
  return loc;
}

function completeChartDraw(crypto, currency, candles){

      var min_frac = 2;
      if (crypto.toLowerCase() != "btc" && currency == "GBP") {
          currency = "BTC"; //no GBP exchange for LTC/ETH/BCH
          min_frac = 7;
      }
      if(crypto.toLowerCase() == "bch"){
          currency = "USD";
          min_frac = 2;
      }

      var SWidth = (100 * 85 / $(".main-panel").width());

      var moneyFormatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: min_frac,
          maximumFractionDigits: min_frac
      });

      console.log("\t\trendering " + crypto.toUpperCase() + "-" + currency.toUpperCase());

      var chartCandles = [];
      if (CHART_TYPE == "both") {
          chartCandles[0] = ["Date", "Low", "Open", "Close", "High", "Tooltip", "Close"];
      } else if (CHART_TYPE == "candle") {
          chartCandles[0] = ["Date", "Low", "Open", "Close", "High", "Tooltip"];
      } else if (CHART_TYPE == "line") {
          chartCandles[0] = ["Date", "Close"];
      }
      var overallHigh, overallLow;
      var periodVolume = 0;
      overallLow = candles.Data[0].low;
      overallHigh = candles.Data[0].high;

      for (var i = 1; i < 1 + candles.Data.length; i++) {
          var time = candles.Data[i - 1].time;
          var low = candles.Data[i - 1].low;
          overallLow = Math.min(overallLow, low);
          var high = candles.Data[i - 1].high;
          overallHigh = Math.max(overallHigh, high);
          var open = candles.Data[i - 1].open;
          var close = candles.Data[i - 1].close;
          var volume = candles.Data[i - 1].volumeto;
          periodVolume += Number(volume);


          if (CHART_TYPE == "both") {
              chartCandles[i] = [0, 0, 0, 0, 0, 0, 0];
          } else if (CHART_TYPE == "candle") {
              chartCandles[i] = [0, 0, 0, 0, 0, 0];
          } else if (CHART_TYPE == "line") {
              chartCandles[i] = [0, 0];
          }

          chartCandles[i][0] = new Date(time * 1000);
          if (CHART_TYPE == "both" || CHART_TYPE == "candle") {
              chartCandles[i][1] = low;
              chartCandles[i][2] = open;
              chartCandles[i][3] = close;
              chartCandles[i][4] = high;
              chartCandles[i][5] = chartCandles[i][0].toLocaleString() + ": " + moneyFormatter.format(chartCandles[i][3]);
              if (CHART_TYPE == "both") {
                  chartCandles[i][6] = close;
              }
          } else if (CHART_TYPE == "line") {
              chartCandles[i][1] = close;

          }
      }
      $("#" + crypto + "high").html(moneyFormatter.format(overallHigh));
      $("#" + crypto + "low").html(moneyFormatter.format(overallLow));
      $("#" + crypto + "vol").html(moneyFormatter.format(periodVolume));
      var formatter;
      if (currency == "USD") {
          formatter = "$" + '#,###.##';
      } else if (currency == "EUR") {
          formatter = "€" + '#,###.##';
      } else if (currency == "GBP") {
          formatter = "£" + '#,###.##';
      } else {
        formatter = currency + '#,###.#######';
      }
      var data = google.visualization.arrayToDataTable(chartCandles, false); // DO NOT Treat first row as data as well.
      if (CHART_TYPE == "both" || CHART_TYPE == "candle") {
          data.setColumnProperty(5, 'role', 'tooltip');
          var options = {
              legend: 'none',
              bar: {
                  groupWidth: '100%'
              }, // Remove space between bars.
              colors: ['lightgrey', '#4c77b2'],
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
                  left: SWidth + '%',
                  bottom: '10%',
                  width: (100 - SWidth - 1) + '%',
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
                  format: formatter,
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
                      count: 4,
                  },
                  showTextEvery: 1,
              },
              cursor: 'crosshair',
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

      } else if (CHART_TYPE == "line") {

          var options = {
              legend: 'none',
              bar: {
                  groupWidth: '100%'
              }, // Remove space between bars.
              colors: ['#4c77b2'],
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
                  left: SWidth + '%',
                  bottom: '10%',
                  width: (100 - SWidth - 1) + '%',
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
                  format: formatter,
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
                      count: 4,
                  },
                  showTextEvery: 1,

              },
              crosshair: {
                trigger: 'both',
              },
              seriesType: 'area',
          };

      }
      var chart = new google.visualization.ComboChart(document.getElementById(crypto + 'chart'));
      chart.draw(data, options);
      updatePChange(crypto, candles.Data[0].open);
}


}w();
