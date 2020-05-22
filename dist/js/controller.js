$(window).on("load", function () {
  var windowWidth = $(window).width();
  if (windowWidth > 768) {
    console.log("web section screen size " + windowWidth);

    $(".mobile-view").hide();
    $(".web-view").show();
    callWebView();
  } else {
    console.log(" mobile section screen size " + windowWidth);

    $(".mobile-view").show();
    $(".web-view").hide();
    callMobileView();
  }
});
