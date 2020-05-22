function callWebView() {
  //var for input date type filter
  var dateinput =
    '<div class="input-group col col-sm-3">' +
    ' <input class="form-control bg-light date-range-filter"  type="text" id="date_range"  />' +
    ' <div class="input-group-append">' +
    '  <span class="input-group-text search-data " id="search-data" > </span>' +
    "  </div>" +
    "</div><br>";

  $(document).ready(function () {
    var table = $("#example").DataTable({
      ajax: {
        url: "data/data.txt",
        dataSrc: function (json) {
          console.log(json.data + " len " + json.data.length);
          return json.data;
        },
      },
      columns: [
        { title: "id", data: "id", sortable: false, visible: false },
        { title: "From", data: "from", sortable: false },
        {
          title: "To",
          data: "to",
          sortable: false,
          render: function (data, type, row, meta) {
            //console.log(row["total_mail"] + " toatal data");
            var count = row["total_mail"] - 1;
            if (count > 0)
              data +=
                "<button type='button' class='btn btn-sm btn-secondary float-right'>+" +
                count +
                "</button>";
            return data;
          },
        },
        {
          title: "Subject",
          data: "subject",
          sortable: false,
          render: function (data, type, row, meta) {
            if (row["attach"] == "true")
              data += "<div class='text-image'></div>";
            return data;
          },
        },
        {
          title: "Date",

          sortable: true,
          data: "date",
          render: function (data, type, full) {
            var mDate = moment(data);
            return mDate && mDate.isValid() ? mDate.format("YYYY/MM/DD") : "";
          },
        },
      ],

      dom: '<"toolbar">frtip',
      order: [[4, "desc"]],
      columnDefs: [
        {
          targets: [0, 1, 2, 3],
          orderable: false,
        },
        {
          targets: [0],
          visible: false,
        },
      ],
      info: false,
      paging: false,
      select: true,
      language: {
        search: "<h6>Results: <span id='total_row'></span>mail(s)<h4>", //Search filter text text Replace
        zeroRecords: "<img src='images/logo.png' />",
      },
      // call your table has fully been initialised
      // initComplete: function (settings, json) {}, //end
      drawCallback: function (settings) {
        var count = 0;
        var last_row_td = $("table tr:last-child td:first-child").html();
        $("#example tbody tr").each(function () {
          //var value = $(this).closest("tr").children("td:first").text();
          count++;
        });

        if (last_row_td.search("@") > 0) {
          // search return -1 if not found
          $("th").show();
          $("#total_row").html(count);
          $("#example").css("border-bottom", "1px solid #dee2e6");
        } else {
          console.log(count + " hide ");
          $("th").hide();
          $("#example").css("border-bottom", "none");
          $("#total_row").html(0);
        }
      }, // END drwacallback
    }); // #####     //END of the data table  ####

    $("div.toolbar").html(dateinput); //  '<input id="date_range" type="text" class="form-control">'       );

    // Date range script - Start of the sscript
    $("#date_range").daterangepicker({
      //autoUpdateInput: false,
      // opens: "left",
      locale: {
        cancelLabel: "Clear",
        format: "YYYY/MM/DD",
      },
    });

    $("#search-data").click(function () {
      table.draw();
      console.log("...............");
    });

    /* // for formate date data from table
   $("#date_range").on("apply.daterangepicker", function (ev, picker) {
        $(this).val(
       picker.startDate.format("YYYY-MM-DD") +
         "-" +
         picker.endDate.format("YYYY-MM-DD")
     );
     table.draw();
   });*/

    $("#date_range").on("cancel.daterangepicker", function (ev, picker) {
      $(this).val("");
      table.draw();
    });
    // Date range script - END of the script

    $.fn.dataTableExt.afnFiltering.push(function (
      oSettings,
      aData,
      iDataIndex
    ) {
      var daterange = $("#date_range").val();

      console.log(daterange + "lksdfsdf");

      var results_daterange = daterange.split("-");
      var filterstart = results_daterange[0];
      var filterend = results_daterange[1];
      var iStartDateCol = 4; //using column 2 in this instance
      var iEndDateCol = 4;
      var tabledatestart = aData[iStartDateCol];
      var tabledateend = aData[iEndDateCol];

      if (!filterstart && !filterend) {
        return true;
      } else if (
        (moment(filterstart).isSame(tabledatestart) ||
          moment(filterstart).isBefore(tabledatestart)) &&
        filterend === ""
      ) {
        return true;
      } else if (
        (moment(filterstart).isSame(tabledatestart) ||
          moment(filterstart).isAfter(tabledatestart)) &&
        filterstart === ""
      ) {
        return true;
      } else if (
        (moment(filterstart).isSame(tabledatestart) ||
          moment(filterstart).isBefore(tabledatestart)) &&
        (moment(filterend).isSame(tabledateend) ||
          moment(filterend).isAfter(tabledateend))
      ) {
        return true;
      }
      return false;
    });

    //End of the datable

    // ...........................inspect details..........................

    $("#example").delegate("tr", "click", function (e) {
      /*var id = $(this).find("td:eq(0)"); // return tr>first td value    
            alert(id.text());*/

      //e.preventDefault();
      var currentRow = $(this).closest("tr");
      var data = $("#example").DataTable().row(currentRow).data();
      var id = data["id"]; // data[0];
      console.log(" tr id is" + id);

      loadDetailsData(id);
    });

    var subject = false;
    function loadDetailsData(val) {
      $.ajax({
        type: "GET",
        cache: false,
        url: "data/details.txt",
        dataType: "json",
        success: function (result) {
          // console.log(JSON.stringify(result) + " val " + val);
          // console.log(" value " + result.data[0]);
          $.each(result.data[0], function (id, data) {
            if (id == val) {
              console.log(" datavalue " + data.from);
              if (data.from === undefined) {
                console.log(" undefined " + data.from);
                $.each(data, function (key, value) {
                  addDetails(value);
                });
              } else {
                addDetails(data);
              }
            }
          });

          $("#list-div").hide();
        }, // close success
        error: function (e) {
          alert(" Error message");
        },
      });
    } // close  loadDetailsData fn

    // add row in table
    function addDetails(data) {
      var newRow = "";
      if (subject == false) {
        newRow += "<tr><td><h4>Subject: " + data.subject + "</h4></td></tr>";
        subject = true;
      }
      newRow +=
        "<tr><td><b>" +
        data.from +
        "  <i class='fa fa-angle-double-right' aria-hidden='true'></i>   " +
        data.to +
        "</b></td></tr>";
      newRow += "<tr><td>" + data.details + "</td><tr>";
      $("table.details_list").append(newRow);
    } // end add row

    // ...........................END inspect details..........................
  }); // close ready function
} // callWebView
