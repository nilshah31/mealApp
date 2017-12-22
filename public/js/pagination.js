$(function () {
    // Selectors for future use
    var myTable = "#myTable";
    var myTableBody = myTable + " tbody";
    var myTableRows = myTableBody + " tr";
    var myTableColumn = myTable + " th";

    // Starting table state
    function initTable() {
        $(myTableBody).attr("data-pageSize", 8);
        $(myTableBody).attr("data-firstRecord", 0);
        $('#previous').hide();
        $('#next').show();

        // Increment the table width for sort icon support


        // Start the pagination
        paginate(parseInt($(myTableBody).attr("data-firstRecord"), 10),
            parseInt($(myTableBody).attr("data-pageSize"), 10));
    }


    // Table sorting function
    function sortTable(table, column, order) {


    }

    // Heading click
    $(myTableColumn).click(function () {


        // Start the pagination
        paginate(parseInt($(myTableBody).attr("data-firstRecord"), 10),
            parseInt($(myTableBody).attr("data-pageSize"), 10));
    });

    // Pager click
    $("a.paginate").click(function (e) {
        e.preventDefault();
        var tableRows = $(myTableRows);
        var tmpRec = parseInt($(myTableBody).attr("data-firstRecord"), 10);
        var pageSize = parseInt($(myTableBody).attr("data-pageSize"), 10);

        // Define the new first record
        if ($(this).attr("id") == "next") {
            tmpRec += pageSize;
        } else {
            tmpRec -= pageSize;
        }
        // The first record is < of 0 or > of total rows
        if (tmpRec < 0 || tmpRec > tableRows.length) return

        $(myTableBody).attr("data-firstRecord", tmpRec);
        paginate(tmpRec, pageSize);
    });

    // Paging function
    var paginate = function (start, size) {
        var tableRows = $(myTableRows);
        var end = start + size;
        // Hide all the rows
        tableRows.hide();
        // Show a reduced set of rows using a range of indices.
        tableRows.slice(start, end).show();
        // Show the pager
        $(".paginate").show();
        // If the first row is visible hide prev
        if (tableRows.eq(0).is(":visible")) $('#previous').hide();
        // If the last row is visible hide next
        if (tableRows.eq(tableRows.length - 1).is(":visible")) $('#next').hide();
    }

    // Table starting state
    initTable();
});
