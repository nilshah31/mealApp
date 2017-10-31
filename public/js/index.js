old_shopping_cart=null;
if(sessionStorage.getItem( "cart" )!=null)
{
  old_shopping_cart = JSON.parse(sessionStorage.getItem('cart'))
}
if(old_shopping_cart!=null){
  for(i=0;i<old_shopping_cart.length;i++){
    newItemobject = { "ID": old_shopping_cart[i].ID,
                      "Name": old_shopping_cart[i].Name,
                      "Price": old_shopping_cart[i].Price,
                      "Qty": old_shopping_cart[i].Qty,
                      "SubTotal": old_shopping_cart[i].SubTotal,
                      "avaible_qty":old_shopping_cart[i].avaible_qty
                    };
    avlb_qty_value = document.getElementById("AVBLQTYSPAN"+String(old_shopping_cart[i].ID));
    avlb_qty_value.innerHTML = parseInt(avlb_qty_value.innerHTML)-old_shopping_cart[i].Qty;
    order_object.push(newItemobject);
  }
}

//Checking Ordering Window Time
if(checkTime()) {
  document.getElementById("order_cart_value").innerHTML = " <div class=\'panel-body\'>Ordering starts from "+
          "<br />LUNCH --- 9:00 AM to 11:30 AM <br />DINNER --- 5:00 PM to 7:00 PM</div>";
  disableAllButtons("add_to_cart_btn");
}
else{
  if(order_object.length==0){ //If Cart Is Empty
    document.getElementById("order_cart_value").innerHTML = " <div class=\'panel-body\'>"+
          "Please add items to your order</div>";
  }
  else{
    add_item_to_cart();
  }
}

//are we still taking order for registered location?
if(isLocationAvaible===false){
  document.getElementById("order_cart_value").innerHTML = " <div class=\'panel-body\'>We have"+
      "stopped delevery at your location, Kindly update your profile</div>";
  disableAllButtons("add_to_cart_btn");
}

//User maximum limit per time to place order should greater than 0
if(parseInt(user_limit<=0)){
  document.getElementById("order_cart_value").innerHTML = " <div class=\'panel-body\'>You "+
        "can not Order more than Rs.200 in a day</div>";
  disableAllButtons("add_to_cart_btn");
}

//User must login first to system to place order

if(logged_user===false){
  document.getElementById("order_cart_value").innerHTML = " <div class=\'panel-body\'>Please "+
        "Log in To start placing order</div>";
  disableAllButtons("add_to_cart_btn");
}

function check_cart_value(price) {
  if(user_limit-(parseInt(sub_total))<=0)
    return false;
  else
    return true;
}

function checkTime() {
    var today=new Date();
    var h=today.getHours();
    if(((h>= 9) && (h<=12)) || ((h>= 17) && (h<=19))){
       return false;
    }
    else{
        return false;
    }
}

function  addItemToOrder(newItemobject) {
    order_object.push(newItemobject);
    add_item_to_cart();
}

function check_item_already_exist(id){
    for(i=0;i<order_object.length;i++){
       if(order_object[i].ID==id){
           return i;
       }
    }
    return -1;
}

function add_item_to_cart() {
  //sessionStorage.setItem( "order_cart_object", order_cart_object );
  sub_total=0;
  document.getElementById("order_cart_value").innerHTML="";

  document.getElementById("order_cart_value").innerHTML += ""+
    "<table id='order_cart_table' class='table' style='font-size:75%'>" +
    "<tr>" +
      "<th></th>" +
      "<th></th>" +
      "<th></th>" +
    "</tr>" +
    "</table>";

  for(i=0;i<=order_object.length-1;i++){
    var table = document.getElementById("order_cart_table");
    var row = table.insertRow(i+1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = order_object[i].Name+
      "<input type='hidden' value='"+order_object[i].Name+"' name='itemName' />"+
      "<br />"+
      "<a href='#' onclick='add_quintity("+i+","+order_object[i].avaible_qty+","+order_object[i].Price+")'>"+
      "<span class='icon-2x blackColorIcon icon-plus-sign'></span></a>"+
      "<a href='#' onclick='reduce_quintity("+i+")'>"+
      "<span class='icon-2x blackColorIcon icon-minus-sign'></span></a>"+
      "<input type='hidden' value='"+order_object[i].ID+"' name='itemID' />";

    cell2.innerHTML = order_object[i].Qty+
      "<input type='hidden' value='"+order_object[i].Qty+"' name='itemQty' />&nbsp;X&nbsp;" +
      order_object[i].Price+"<input type='hidden' value='"+order_object[i].Price+"' name='itemPrice' />";

    cell3.innerHTML = parseInt(order_object[i].Price)*parseInt(order_object[i].Qty);
    cell4.innerHTML = "<a href='#' onclick='removeItemFromCart("+i+")'>"+
                      "<i class='icon-remove fa-3x'></i></a>";
    sub_total += parseInt(cell3.innerHTML);
    }

    var table = document.getElementById("order_cart_table");
    var row = table.insertRow(order_object.length+1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell2.innerHTML = "Sub Total";
    cell3.innerHTML = sub_total;

    var row = table.insertRow(order_object.length+2);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell2.innerHTML = "Tax";
    cell3.innerHTML = '0';

    var row = table.insertRow(order_object.length+3);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell2.innerHTML = "Grand Total";
    cell3.innerHTML = sub_total;

    document.getElementById("order_cart_value").innerHTML +="" +
        "<input type='button' class='btn btn-success' style='height: 3em;' onclick='submitform()' " +
        "value='Process to Checkout' />";

    var jsonStr = JSON.stringify( order_object );
    sessionStorage.setItem( "cart", jsonStr );
}

function addItemtoCart(id,name,price,qty,avaible_qty) {
  if(check_cart_value(price)){
    if(!(checkTime())){
      newItemobject = { "ID": id,
                        "Name": name,
                        "Price": price,
                        "Qty": qty,
                        "SubTotal": parseInt(price)*parseInt(qty),
                        "avaible_qty":parseInt(avaible_qty)
                      };
      temp = check_item_already_exist(id)
      if(temp!=-1)
        add_quintity(temp, avaible_qty,price);
      else
        addItemToOrder(newItemobject);
      avlb_qty_value = document.getElementById("AVBLQTYSPAN"+String(id));
      if(parseInt(avlb_qty_value.innerHTML)>0)
        avlb_qty_value.innerHTML = parseInt(avlb_qty_value.innerHTML)-1;
    }
    else {
       alert("Sorry We Are Close Now");
    }
  }
  else{
    alert("Maximum Order Limit Is 200rs Per Day");
  }
}

function submitform() {
  document.getElementById("order_cart_form").submit();
}

function check_order_location(){
  if(order_location_avbl)
    return true;
  else
    return false;
}

function add_quintity(index,avbl_qnty,price){
  if((parseInt(price)+parseInt(sub_total))<=200){
    order_object[index].Qty = parseInt(order_object[index].Qty);
    if (order_object[index].Qty < avbl_qnty)
      order_object[index].Qty += 1;
    add_item_to_cart();
  }
  else{
    alert("You can order upto 200rs")
  }
}

function reduce_quintity(index){
  order_object[index].Qty = parseInt(order_object[index].Qty);
  order_object[index].Qty-=1;
  if(order_object[index].Qty==0) {
    avlb_qty_value = document.getElementById("AVBLQTYSPAN"+String(order_object[index].ID));
    avlb_qty_value.innerHTML = parseInt(avlb_qty_value.innerHTML)+1;
    sub_total = parseInt(sub_total)-(parseInt(order_object[index].Price)*parseInt(order_object[index].Qty));
    order_object.splice(index, 1);
  }
  if(order_object.length==0){
    sub_total = 0;
    document.getElementById("order_cart_value").innerHTML = " <div>Please add items to your order</div>";
  }
  else{
    avlb_qty_value = document.getElementById("AVBLQTYSPAN"+String(order_object[index].ID));
    avlb_qty_value.innerHTML = parseInt(avlb_qty_value.innerHTML)+1;
    sub_total = parseInt(sub_total)-(parseInt(order_object[index].Price));
    add_item_to_cart();
  }
}

function removeItemFromCart(index) {
  avlb_qty_value = document.getElementById("AVBLQTYSPAN"+String(order_object[index].ID));
  avlb_qty_value.innerHTML = parseInt(avlb_qty_value.innerHTML)+parseInt(order_object[index].Qty);
  sub_total = parseInt(sub_total)-(parseInt(order_object[index].Price)*parseInt(order_object[index].Qty));
  order_object.splice(index, 1);
  if(order_object.length==0){
    document.getElementById("order_cart_value").innerHTML = " <div>Please add items to your order</div>";
  }
  else{
    add_item_to_cart();
  }
  var jsonStr = JSON.stringify( order_object );
  sessionStorage.setItem( "cart", jsonStr );
}

//Few General Function's

function disableAllButtons(id){
  var all_btns = document.getElementsByClassName(id);
  for(var i=0, len=all_btns.length; i<len; i++){
    all_btns[i].disabled=true;
  }
}
