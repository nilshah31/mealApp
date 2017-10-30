//Admin LogOut Button from Menu
function log_out() {
    if(confirm("Do you want to Log Out ?")) {
        document.getElementById("logoutAdmin").submit();
    }
}

//Admin Item's
function delete_item(item_id) {
    if(confirm("Do you want to delete this Item ?")) {
        document.getElementById('item_ID').value = item_id;
        document.getElementById("item_list_form").submit();
    }
}

//Delete Multiple checked Items
function deleteitemsAll() {
    counter_temp = getCheckedBoxes('checkAllItems');
    if(counter_temp>0){
      if(confirm("Do you want to delete all this Item ?")) {
        document.getElementById("delete_multiple_item").submit();
      }
    }
    else {
      alert("Please Select items to delete");
    }
}

// Pass the checkbox name to the function
function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    var id_hidden_ob = document.getElementById('delete_all_items_ids');
    var counter_temp=0;
    // loop over them all
    for (var i=1; i<checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
            id_hidden_ob.value+=","+checkboxes[i].value;
            counter_temp+=1;
        }
    }
    return counter_temp;
}

$(document).ready(function() {
    $("#checkAllItems").change(function(){
        if(this.checked){
            $(".checkAllItemsSingle").each(function(){
                this.checked=true;
            })
        }else{
            $(".checkAllItemsSingle").each(function(){
                this.checked=false;
            })
        }
    });

    $(".checkAllItemsSingle").click(function () {
        if ($(this).is(":checked")){
            var isAllChecked = 0;
            $(".checkAllItemsSingle").each(function(){
                if(!this.checked)
                    isAllChecked = 1;
            })
            if(isAllChecked == 0){ $("#checkAllItems").prop("checked", true); }
        }else {
            $("#checkAllItems").prop("checked", false);
        }
    });
});

//No Longer Needed
function edit_item_status_inactive(item_id){
  document.getElementById('item_status_id_active').value=item_id;
  document.getElementById("update_item_status_active").submit();
}

//No Longer Needed
function edit_item_status_active(item_id){
  document.getElementById('item_status_id_inactive').value=item_id;
  document.getElementById("update_item_status_inactive").submit();
}

//Edit the Item, Check for edit Image path
function edit_item(item_id, item_name, desc, price, init_qty, edit_item_img_path) {
    document.getElementById('edititemNameTxtBox').value=item_name;
    document.getElementById('editdescTxtBox').value=desc;
    document.getElementById('editpriceTxtBox').value=price;
    document.getElementById('editinititalQtyTxtBox').value=init_qty;
    document.getElementById('editItemId').value=item_id;
    //document.getElementById('edit_item_img').src=edit_item_img_path;

    // Get the modal
    var modal6 = document.getElementById('editItemModal');
    // Get the <span> element that closes the modal
    var span6 = document.getElementsByClassName("close")[3];
    modal6.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span6.onclick = function () {
        modal6.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal6) {
            modal6.style.display = "none";
        }
    }
}

//Location JS
function delete_location(location_id) {
    if(confirm("Do you want to delete selected Location ?")) {
        document.getElementById('location_ID').value = location_id;
        document.getElementById("location_form").submit();
    }
}


function deletelocationAll() {
    counter_temp = getCheckedBoxesLocation('checkAllLocation');
    if(counter_temp>0){
      if(confirm("Do you want to delete all selected Location ?")) {
        document.getElementById("delete_multiple_location").submit();
      }
    }
    else{
      alert('Please Select Location\'s to Remove');
    }
}

// Pass the checkbox name to the function
function getCheckedBoxesLocation(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    var id_hidden_ob = document.getElementById('delete_all_location_ids');
    // loop over them all
    for (var i=1; i<checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
            id_hidden_ob.value+=","+checkboxes[i].value;
        }
    }
}

$(document).ready(function() {
    $("#checkAllLocation").change(function(){
        if(this.checked){
            $(".checkAllLocationSingle").each(function(){
                this.checked=true;
            })
        }else{
            $(".checkAllLocationSingle").each(function(){
                this.checked=false;
            })
        }
    });

    $(".checkAllLocationSingle").click(function () {
        if ($(this).is(":checked")){
            var isAllChecked = 0;
            $(".checkAllLocationSingle").each(function(){
                if(!this.checked)
                    isAllChecked = 1;
            })
            if(isAllChecked == 0){ $("#checkAllLocation").prop("checked", true); }
        }else {
            $("#checkAllLocation").prop("checked", false);
        }
    });
});

function edit_location(location_id, city, location) {
    document.getElementById('locationeditTxtBox').value=location;
    document.getElementById('cityeditTxtBox').value=city;
    document.getElementById('locationItemId').value=location_id;

    // Get the modal
    var modal_edit_location = document.getElementById('editLocationModal');

    // Get the <span> element that closes the modal
    var span_edit_location = document.getElementsByClassName("close")[1];

    modal_edit_location.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span_edit_location.onclick = function () {
        modal_edit_location.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal_edit_location) {
            modal_edit_location.style.display = "none";
        }
    }
}

//adminOrders

function filterLocation()
	{
    if($('#filterLocation').val()!=0){
		    var rex = new RegExp($('#filterLocation').val());
		      if(rex =="/all/")
          {
            clearFilter()
          }
          else{
            $('.content').hide();
			      $('.content').filter(function() {
			           return rex.test($(this).text());
			      }).show();
	       }
    }
    else{
      removeFilterData();
    }
}

function clearFilter()
	{
		$('.filterLocation').val('');
		$('.content').show();
	}

function downloadpdf() {
    document.getElementById("downloadpdf_form").submit();
}

//Remove Order Table Data
function removeFilterData() {
    var input, filter, table, tr, td, i;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
          tr[i].style.display = "";
        }
    }

//Filter Table Data
function filterOrderTableData(table_id,index,id,location,index2) {
    var input, filter, table, tr, td, i;
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    table = document.getElementById(table_id);
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[index];
        td1 = tr[i].getElementsByTagName("td")[index2];


        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              if((td1.innerHTML.toUpperCase().indexOf(location.toUpperCase())) > -1){
                tr[i].style.display = "";
              }
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

//Filter Order Table Data
function searchTodaysOrder(index,id,id2,location) {
    var input, filter, table, tr, td, i,td1;
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    var input1 = document.getElementById(id2);
    var filter1 = input1.value.toUpperCase();

    for (i = 1; i < tr.length; i++) {
        var Cells = tr[i].getElementsByTagName("td");

        td = tr[i].getElementsByTagName("td")[index];
        td1 = tr[i].getElementsByTagName("td")[0];
        td2 = tr[i].getElementsByTagName("td")[4];

        if (td) {
            if (td.innerText.toUpperCase().indexOf(filter) > -1) {
                if(td1.innerText.toUpperCase().indexOf(filter1) > -1){
                  if(td2.innerText.toUpperCase().indexOf(location.toUpperCase()) > -1){
                    tr[i].style.display = "";
                  }
                  else{
                    tr[i].style.display = "none";
                  }
                }
                else{
                    tr[i].style.display = "none";
                }
            }else {
                tr[i].style.display = "none";
            }
        }
    }
}

sortTable(0);
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("myInput3").value = d + "/" + m + "/" + y;
document.getElementById("myInput4").value = "Cancled";
document.getElementById("myInput6").value = "Ordered";


//main layout-boxed

$("#userDIV").toggle();
$(document).ready(function(){
    $("#viewAllUser").click(function(){
        if ( $('#itemDIV').is(':visible')){
            $("#itemDIV").toggle();
        }
        if ( $('#OrderDiv').is(':visible')){
            $("#OrderDiv").toggle();
        }
        if ( $('#ItemOrderDiv').is(':visible')){
            $("#ItemOrderDiv").toggle();
        }
        if ( $('#locationDIV').is(':visible')){
            $("#locationDIV").toggle();
        }
        $("#userDIV").toggle();
    });

});


$("#locationDIV").toggle();
$(document).ready(function(){
    $("#viewAllLocation").click(function(){
        if ( $('#itemDIV').is(':visible')){
            $("#itemDIV").toggle();
        }
        if ( $('#OrderDiv').is(':visible')){
            $("#OrderDiv").toggle();
        }
        if ( $('#ItemOrderDiv').is(':visible')){
            $("#ItemOrderDiv").toggle();
        }
        if ( $('#userDIV').is(':visible')){
            $("#userDIV").toggle();
        }
        $("#locationDIV").toggle();
    });

});

$("#ItemOrderDiv").toggle();
$("#viewAllItemOrderTable").click(function(){
    if ( $('#itemDIV').is(':visible')){
        $("#itemDIV").toggle();
    }
    if ( $('#OrderDiv').is(':visible')){
        $("#OrderDiv").toggle();
    }
    if ( $('#userDIV').is(':visible')){
        $("#userDIV").toggle();
    }
    if ( $('#locationDIV').is(':visible')){
        $("#locationDIV").toggle();
    }
    $("#ItemOrderDiv").toggle();
});

// Get the modal
var modal = document.getElementById('locationModal');

// Get the button that opens the modal
var btn = document.getElementById("addLocation");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

$("#itemDIV").toggle();
$(document).ready(function(){
    $("#viewAllItem").click(function(){
        if ( $('#locationDIV').is(':visible')){
            $("#locationDIV").toggle();
        }
        if ( $('#OrderDiv').is(':visible')){
            $("#OrderDiv").toggle();
        }
        if ( $('#ItemOrderDiv').is(':visible')){
            $("#ItemOrderDiv").toggle();
        }
        if ( $('#userDIV').is(':visible')){
            $("#userDIV").toggle();
        }
        $("#itemDIV").toggle();
    });
});

// Get the modal
var modal1 = document.getElementById('itemModal');

// Get the button that opens the modal
var btn1 = document.getElementById("addItem");

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close")[2];

// When the user clicks the button, open the modal
btn1.onclick = function() {
    modal1.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
    modal1.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
    }
}

$('button.newLocation').click( function() {
      $('form.newLocation').submit();
   });
$('button.newItem').click( function() {
      $('form.newItem').submit();
   });

   $("#OrderDiv").toggle();
   $(document).ready(function(){
       $("#viewAllOrders").click(function(){
           if ( $('#itemDIV').is(':visible')){
               $("#itemDIV").toggle();
           }
           if ( $('#locationDIV').is(':visible')){
               $("#locationDIV").toggle();
           }
           if ( $('#ItemOrderDiv').is(':visible')){
               $("#ItemOrderDiv").toggle();
           }
           if ( $('#userDIV').is(':visible')){
               $("#userDIV").toggle();
           }
           $("#OrderDiv").toggle();
       });
   });

//Export to PDF Admin Order
function DoCellData(cell, row, col, data) {}
function DoBeforeAutotable(table, headers, rows, AutotableSettings) {}

function downloadPDF(PDFtableName,headerTitle) {
  var pdfsize = 'a4';
  var pdf = new jsPDF('l', 'pt', pdfsize);
  var res = pdf.autoTableHtmlToJson(document.getElementById(PDFtableName));
  var header = function(data) {
   pdf.setFontSize(18);
   pdf.setTextColor(40);
   pdf.setFontStyle('normal');
   //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
   pdf.text(headerTitle, data.settings.margin.left, 50);
  }
  pdf.autoTable(res.columns, res.data, {
   beforePageContent: header,
   startY: 60,
   drawHeaderRow: function(row, data) {
     row.height = 46;
   },
   drawHeaderCell: function(cell, data) {
     pdf.rect(cell.x, cell.y, cell.width, cell.height, cell.styles.fillStyle);
     pdf.setFillColor(230);
     pdf.rect(cell.x, cell.y + (cell.height / 2), cell.width, cell.height / 2, cell.styles.fillStyle);
     pdf.autoTableText(cell.text, cell.textPos.x, cell.textPos.y, {
       halign: cell.styles.halign,
       valign: cell.styles.valign
     });
     pdf.setTextColor(100);
     var text = data.table.rows[0].cells[data.column.dataKey].text;
     pdf.autoTableText(text, cell.textPos.x, cell.textPos.y + (cell.height / 2), {
       halign: cell.styles.halign,
       valign: cell.styles.valign
     });
     return false;
   },
   drawRow: function(row, data) {
     if (row.index === 0) return false;
   },
   margin: {
     top: 60
   },
   styles: {
     overflow: 'linebreak',
     fontSize: 10,
     tableWidth: 'auto',
     columnWidth: 'auto',
   },
   columnStyles: {
     1: {
       columnWidth: 'auto'
     }
   },
 });
 pdf.save("Report" + ".pdf");
}


$(".exportButton").on("click", function() {
  downloadPDF('myTable',$('#filterLocation').val());
});

$(".exportButtonItemWise").on("click", function() {
  downloadPDF('itemWiseOrdered',$('#search_by_location_item').val());
});

function deleteItem(obj, id) {
  if(confirm('Are you sure you want to delete this?')){
    $.ajax({
      url: "/dbs/removeItem/"+id,
      type: "POST",
      data: { 'id': id },
      success: function(data){
        $(obj).closest('tr').fadeOut(300,function(){
            $(obj).closest('tr').remove();
        });
        $.notify("Item Removed", "success");
      },
    });
  }
}

function deleteLocation(obj, id) {
  if(confirm('Are you sure you want to delete this?')){
    $.ajax({
      url: "/dbs/removeLocation/"+id,
      type: "POST",
      data: { 'id': id },
      success: function(data){
        $(obj).closest('tr').fadeOut(300,function(){
            $(obj).closest('tr').remove();
        });
        $.notify("Item Removed", "success");
      },
    });
  }
}

function addLocation() {
  $.ajax({
      url: "/dbs/addLocation",
      type: "POST",
      data: { 'city': $('#cityTxtBox').val(), 'company': $('#locationTxtBox').val() },
      success: function(data){
        $('#locationListTable').append('<tr>' +
          '<td><input type="checkbox" checked/></td>' +
          '<td>'+ $('#cityTxtBox').val()+'</td>' +
          '<td>'+ $('#locationTxtBox').val()+'</td>' +
          '<td>'+
            '<div class="link_edit">'+
              '<a class="btnEdit" href="#" id="editItem" onclick="edit_location(\''+data+'\',\''+$('#cityTxtBox').val()+'\',\''+$('#locationTxtBox').val()+'\')">'+
                  '<i class="fa fa-edit" title="Edit Item Detail"></i>'+
              '</a>'+
            '</div>'+
          '</td>'+
          '<td>'+
            '<button onclick="deleteLocation(this,\''+data+'\')">Remove</button>'+
          '</td>'+
          '</tr>');
        $('#locationModal').hide();
        $.notify("Location Added", "success");
      }
  });
}
$('#filterOrderTableWithOption').on('change', function(){
    selectedOption = $(this).val();
    selectedLocation = $('#filterLocation').val();
    if(selectedLocation!=0){
      if(selectedOption==0)searchTodaysOrder(0,'myInput5','myInput3','');
      if(selectedOption==1)searchTodaysOrder(8,'myInput6','myInput3',selectedLocation);
      if(selectedOption==2)searchTodaysOrder(8,'myInput4','myInput3',selectedLocation);
    }
    else{
      if(selectedOption==0)searchTodaysOrder(0,'myInput5','myInput3','');
      if(selectedOption==1)searchTodaysOrder(8,'myInput6','myInput3','');
      if(selectedOption==2)searchTodaysOrder(8,'myInput4','myInput3','');
    }
});

$('#myInput1').keyup(function() {
    selectedLocation = $('#filterLocation').val();
    if(selectedLocation!=0)
    {
      filterOrderTableData('myTable',0,'myInput1',selectedLocation,4);
    }
    else{
      filterOrderTableData('myTable',0,'myInput1','',4);
    }
});
$('#myInput2').keyup(function() {
    selectedLocation = $('#filterLocation').val();
    if(selectedLocation!=0){
      filterOrderTableData('myTable',1,'myInput2',selectedLocation,4);
    }
    else{
      filterOrderTableData('myTable',1,'myInput2','',4);
    }
});
$('#search_by_location_item').keyup(function() {
    selectedLocation = $('#search_by_location_item').val();
    filterOrderTableData('itemWiseOrdered',2,'search_by_location_item',selectedLocation,2);
});

$('select[multiple]').multiselect({
    columns: 1
});

$('.multicheckboxLocation').on('change', function() {
  item_id = this.name;
  $("#"+this.id+" option:selected").each(function(){
    location_id = $(this).val();
    $.ajax({
        url: "/dbs/addLocationtoMenu",
        type: "POST",
        data: { 'item_id': item_id, 'location_id': location_id },
        success: function(data){
          $.notify("Location Added Successfully", "success");
        },
    });
  });
  $("#"+this.id+" option:not(:selected)").each(function(){
    location_id = $(this).val();
    $.ajax({
        url: "/dbs/removeLocationtoMenu",
        type: "POST",
        data: { 'item_id': item_id, 'location_id': location_id },
        success: function(data){
        },
    });
  });
})
