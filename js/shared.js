var HOME_CURRENCY = "USD";
$("#cusd").click(function(){
  HOME_CURRENCY = "USD";
  $("#activec").html(HOME_CURRENCY);
});
$("#ceur").click(function(){
  HOME_CURRENCY = "EUR";
  $("#activec").html(HOME_CURRENCY);
});
$("#cgbp").click(function(){
  HOME_CURRENCY = "GBP";
  $("#activec").html(HOME_CURRENCY);
});
