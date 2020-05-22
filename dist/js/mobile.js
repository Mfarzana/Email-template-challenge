function callMobileView() {
  console.log(" mobile viw ............. ");

  console.log("div fn call......");
  $(".mobile-view-body").html(""); // div emtpy

  $.ajax({
    type: "GET",
    cache: false,
    url: "data/data.txt",
    dataType: "json",
    success: function (result) {
      console.log(" value " + result.data[0] + " mobile view json data");
      $.each(result.data, function (id, data) {
        getMobileViewData(data, Object.keys(data).length);
      });
    }, // close success
    error: function (e) {
      alert(" Error message");
    },
  });
}
// if end >> window size

function getMobileViewData(data) {
  var count = data.total_mail - 1;

  var div =
    "<div class='row'>" +
    " <div class='col-sm-1'>" + // image
    "<img style='margin-top: 10px;' src='images/icon_mail_sp.png'/>" +
    "</div>" +
    "<div class='col-sm-11' style='padding-left: 0;'>" +
    " <div class='row'>" +
    "<div class='col-sm-8'><h6>" +
    data.from +
    "</h6></div>" + //from
    "<div class='text-right col-sm-4'>";
  if (data.attach == "true") div += "<img src='images/icon_clip.png' /> &nbsp;";
  div +=
    data.date +
    "&nbsp;<img src='images/icon_arrow02.png' /> " +
    "</div>" + //date
    " </div>" +
    "<div class='row'>" +
    " <div class='col-sm-8'>" +
    data.to +
    "</div>" +
    "<div class='text-right col-sm-4'>"; ////button
  if (count > 0) {
    div +=
      "<button type='button' class='btn btn-sm btn-secondary float-right'>+" +
      count +
      "</button>";
  }
  div +=
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "<div class='row'>" +
    "<div class='col-12'>" +
    data.subject +
    "</div>" +
    "</div>";

  $(".mobile-view-body").append(div);
} // end >>>  getMobileViewData

$(function () {
  $("#date_range_mobile").daterangepicker(
    {
      opens: "left",
    },
    function (start, end, label) {
      console.log(
        "A new date selection was made: " +
          start.format("YYYY-MM-DD") +
          " to " +
          end.format("YYYY-MM-DD")
      );
    }
  );
});
