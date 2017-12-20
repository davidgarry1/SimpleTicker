var INTERVAL = 1500; //Rate limits available at https://docs.gdax.com/#rate-limits
var CURRENT_COIN_NUM = 0;
var HOME_CURRENCY = "USD";
var GRANULARITY = 60 * 60 * 1000; //1 Hour
var CHART_TYPE = "line";

$("#candle").click(function() {
    CHART_TYPE = "candle";
    $("#activechart").html("Chart: Candlestick");
    updateCharts(true);
    setCookie("CHART_TYPE", "#candle");
});

$("#line").click(function() {
    CHART_TYPE = "line";
    $("#activechart").html("Chart: Line");
    updateCharts(true);
    setCookie("CHART_TYPE", "#line");
});

$("#combo").click(function() {
    CHART_TYPE = "both";
    $("#activechart").html("Chart: Combo");
    updateCharts(true);
    setCookie("CHART_TYPE", "#combo");
});

$("#hour").click(function() {
    GRANULARITY = 60 * 60 * 1000;
    $("#activet").html("Interval: 1 Hour");
    $("span.interval").html("1H");
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    eraseCookie("GRANULARITY");
});

$("#day").click(function() {
    GRANULARITY = 24 * 60 * 60 * 1000;
    $("#activet").html("Interval: 1 Day");
    $("span.interval").html("1D");
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    setCookie("GRANULARITY", "#day");
});

$("#week").click(function() {
    GRANULARITY = 7 * 24 * 60 * 60 * 1000;
    $("#activet").html("Interval: 1 Week");
    $("span.interval").html("1W");
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    setCookie("GRANULARITY", "#week");
});

$("#month").click(function() {
    GRANULARITY = 30 * 24 * 60 * 60 * 1000;
    $("#activet").html("Interval: 1 Month");
    $("span.interval").html("1M");
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    setCookie("GRANULARITY", "#month");
});

$("#year").click(function() {
    GRANULARITY = 364 * 24 * 60 * 60 * 1000;
    $("#activet").html("Interval: 1 Year");
    $("span.interval").html("1Y");
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    setCookie("GRANULARITY", "#year");
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
    setCookie("HOME_CURRENCY", "#ceur");
});
$("#cgbp").click(function() {
    HOME_CURRENCY = "GBP";
    $("#activec").html(HOME_CURRENCY);
    updatePage(true);
    setTimeout(function() {
        updateCharts(true);
    }, 500);
    setCookie("HOME_CURRENCY", "#cgbp");
});


if (hasCookie("GRANULARITY")) {
    $(getCookie("GRANULARITY")).click();
}

if (hasCookie("HOME_CURRENCY")) {
    $(getCookie("HOME_CURRENCY")).click();
}

if (hasCookie("CHART_TYPE")) {
    $(getCookie("CHART_TYPE")).click();
}

google.charts.setOnLoadCallback(updateCharts(true));

$(window).resize(function() {
    updateCharts(true);
});

setInterval(function() {
    updatePage(false);
}, INTERVAL);

setInterval(function() {
    updateCharts(false);
}, 20*1000);



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
    $.getJSON("https://api.gdax.com/products/" + crypto + "-" + currency + "/ticker", function(ticker) {

        var moneyFormatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: min_frac,
            maximumFractionDigits: min_frac
        });
        $("#" + crypto + "price").html(moneyFormatter.format(ticker.price));
        if (crypto == "btc") document.title = moneyFormatter.format(ticker.price) + "-BTC | Simple Ticker";
    }).fail(function() {
        //console.log("Too many requests to GDAX API");
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
    if (!firstBTCDraw) drawChart("btc", HOME_CURRENCY, false);
    if (!firstLTCDraw) drawChart("ltc", HOME_CURRENCY, false);
    if (!firstETHDraw) drawChart("eth", HOME_CURRENCY, false);
}

var firstBTCDraw = false;
var firstETHDraw = false;
var firstLTCDraw = false;
var callback = JSON.parse("{}");
callback["btc"] = true;
callback["ltc"] = true;
callback["eth"] = true;

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

function drawChart(crypto, currency, hardReset) {

    if (hardReset) {
        document.getElementById(crypto + 'chart').innerHTML = " Loading...";
    }
    var min_frac = 2;
    if ((crypto == "ltc" || crypto == "eth") && currency == "GBP") {
        currency = "BTC"; //no GBP exchange for LTC/ETH
        min_frac = 7;
    }
    var date = new Date();
    var dateObj = new Date((new Date) * 1 - GRANULARITY); //ms*seconds*minutes*hours*days*weeks*months
    var loc = "https://api.gdax.com/products/" + crypto + "-" + currency + "/candles?start=" + dateObj.toISOString() + "&end=" + date.toISOString() + "&granularity=" + GRANULARITY / 150000;

    $.getJSON(loc, function(candles) {
        var SWidth = Math.max(10, (100 / $(document).width()));
        console.log(SWidth);

        if (candles.length < 140) {
            console.log("GDAX API Returned Junk");
            drawChart(crypto, HOME_CURRENCY, hardReset);
            return;
        }
        var moneyFormatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: min_frac,
            maximumFractionDigits: min_frac
        });
        console.log("Rendering " + crypto.toUpperCase() + "-" + currency + ", candles.length: " + candles.length);
        if (crypto == "btc") firstBTCDraw = true;
        if (crypto == "eth") firstETHDraw = true;
        if (crypto == "ltc") firstLTCDraw = true;
        var chartCandles = [];
        if (CHART_TYPE == "both") {
            chartCandles[0] = ["Date", "Low", "Open", "Close", "High", "Tooltip", "Close"];
        } else if (CHART_TYPE == "candle") {
            chartCandles[0] = ["Date", "Low", "Open", "Close", "High", "Tooltip"];
        } else if (CHART_TYPE == "line") {
            chartCandles[0] = ["Date", "Close"];
        }
        var overallHigh, overallLow;
        overallLow = candles[0][1];
        overallHigh = candles[0][2];

        updatePChange(crypto, candles[candles.length - 1][3]);

        for (var i = 1; i < 1 + candles.length; i++) {
            var time = candles[i - 1][0];
            var low = candles[i - 1][1];
            overallLow = Math.min(overallLow, low);
            var high = candles[i - 1][2];
            overallHigh = Math.max(overallHigh, high);
            var open = candles[i - 1][3];
            var close = candles[i - 1][4];
            var volume = candles[i - 1][5];
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
        var formatter;
        if (currency == "USD") {
            formatter = "$" + '#,###.##';
        } else if (currency == "EUR") {
            formatter = "€" + '#,###.##';
        } else if (currency == "GBP") {
            formatter = "£" + '#,###.##';
        } else if (currency == "BTC") {
            formatter = "BTC" + '#,###.#######';
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
    }).fail(function() {
        console.log("GDAX API Candle Call Failed");
        setTimeout(function() {
            retryCharts();
        }, 2000);
    });
}
