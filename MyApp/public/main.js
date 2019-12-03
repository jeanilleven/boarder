// ***** this for the dynamic occupant list *****//
var ctr =   0;
var ctr2 = 0;
var mylist = document.querySelector("#list");

function addItem(val){
    if(event.key == 'Enter'){
        //construct li item
        var newItem = document.createElement("li");
        newItem.setAttribute("id", "li"+ ctr++);
        newItem.setAttribute("onclick", "itemDone(this)");
        newItem.setAttribute("onmouseover", "mouseOver(this)");
        newItem.setAttribute("onmouseout", "mouseOut(this)");
        newItem.textContent = val.value;


        var delBtn = document.createElement("Button");
        delBtn.classList.add("delBtn");
        delBtn.classList.add("hide");
        delBtn.textContent = "delete";

        newItem.insertBefore(delBtn, newItem.childNodes[0]);

        mylist.insertBefore(newItem, mylist.childNodes[ctr]);    
        val.value = "";
    }
}

function itemDone(val){
    val.classList.toggle("done");
    val.classList.remove("mOver");
}

function mouseOver(val){
    if(val.classList.contains("done")==false){
        val.classList.add("mOver");
        val.childNodes[0].classList.remove("hide")
    }
}

function mouseOut(val){
    if(val.classList.contains("done")==false){
        val.classList.remove("mOver");
        val.childNodes[0].classList.add("hide")
    }
}

function dropOcc(val){
    var occDrop = document.querySelector("#room1 > div > #occDropDwn");
    occDrop.classList.toggle("hide");
}

function addOcc(val){
    if(event.key == 'Enter'){
        //construct li item
        var newItem = document.createElement("li");
        newItem.setAttribute("id", "li"+ ctr++);
        newItem.setAttribute("onclick", "itemDone(this)");
        newItem.setAttribute("onmouseover", "mouseOver(this)");
        newItem.setAttribute("onmouseout", "mouseOut(this)");
        newItem.textContent = val.value;


        var delBtn = document.createElement("Button");
        delBtn.classList.add("delBtn");
        delBtn.classList.add("hide");
        delBtn.textContent = "delete";

        newItem.insertBefore(delBtn, newItem.childNodes[0]);

        document.getElementById("occList").insertBefore(newItem, document.getElementById("occList").childNodes[ctr]);    
        val.value = "";
    }
}

function dropInv(val){

    var occDrop = document.querySelector("#room1 > div > #invDropDwn");
    occDrop.classList.toggle("hide");
}   

function dropPay(val){

    var occDrop = document.querySelector("#room1 > div > #payDropDwn");
    occDrop.classList.toggle("hide");
}  

function toggleHide(elemID1, elemID2){
    document.getElementById(elemID1).classList.toggle("hide");    
}

// function toggleTenantTab(elem){

//     document.getElementById("tenantBtn").classList.remove("inactiveTab");
//     document.getElementById("accountingBtn").classList.add("inactiveTab");
//     // document.getElementById("houseBtn").classList.add("inactiveTab");

//     document.getElementById("tenantContent").classList.remove("hide");
//     document.getElementById("accountingContent").classList.add("hide");
//     // document.getElementById("houseContent").classList.add("hide");
// }

function toggleAccountingTab(elem){
    
    document.getElementById("accountingBtn").classList.remove("inactiveTab");
    // document.getElementById("tenantBtn").classList.add("inactiveTab");
    document.getElementById("houseBtn").classList.add("inactiveTab");

    document.getElementById("accountingContent").classList.remove("hide");
    // document.getElementById("tenantContent").classList.add("hide");
    document.getElementById("houseContent").classList.add("hide");
}

function toggleHouseTab(elem){
    document.getElementById("houseBtn").classList.remove("inactiveTab");
    document.getElementById("accountingBtn").classList.add("inactiveTab");
    // document.getElementById("tenantBtn").classList.add("inactiveTab");
    
    document.getElementById("houseContent").classList.remove("hide");
    document.getElementById("accountingContent").classList.add("hide");
    // document.getElementById("tenantContent").classList.add("hide");
}

function addRoomClicked(){
    document.getElementById("backRoomModal").classList.remove("hide");
}
function addProductClicked(){
    document.getElementById("backProductModal").classList.remove    ("hide");
}


function deleteRoomClicked(elem){
    toggleHide('backDeleteModal');
    document.getElementById("delForm").setAttribute("action", "/deleteRoom");
    document.getElementById("rmId").setAttribute("value", elem.getAttribute("id"));
}

function editRoomClicked(elem){
    toggleHide('backRoomModal');

    
    document.getElementById('roomForm').setAttribute('action', '/processEditRoom');
    document.getElementById('roomForm').innerHTML += '<input name="roomId" value="'+ elem.getAttribute("id") +'" class="hide">';
    document.getElementById('addBtn').innerHTML = 'SAVE';

    var inpLabel = document.getElementById('labelInput');
    var inpCapacity = document.getElementById('capacityInput');
    
    inpLabel.value = document.getElementById(elem.getAttribute("id") + '-label').innerHTML;
    inpCapacity.value = document.getElementById(elem.getAttribute("id") + '-capacity').innerHTML;


}   

function addRoomClicked(elem){
    toggleHide('backRoomModal');

    document.getElementById('roomForm').setAttribute('action', '/processNewRoom');
    document.getElementById('addBtn').innerHTML = 'ADD';

    var inpLabel = document.getElementById('labelInput');
    var inpCapacity = document.getElementById('capacityInput');

    inpLabel.value = "";
    inpCapacity.value = "";
}


var copyAddOccBtn = document.getElementById('addOccupantBtn').cloneNode(true);
var occCount = 1;

function addRentClicked(){
    document.getElementById("backRentModal").classList.remove("hide");
    
    var list = document.getElementById('occList');
    list.innerHTML = "<li id='occTemplate' class='box'><p class='boldLabel'>Occupant 1</p><p class='label topZero'>First Name</p><input name='occ[0][fname]' class='invInpTitle' type='text'placeholder='Enter here'><p class='label'>Last Name</p><input name='occ[0][lname]' class='invInpTitle' type='text'placeholder='Enter here'><p class='label'>Middile Name</p><input name='occ[0][mname]'class='invInpTitle' type='text'placeholder='Enter here'><p class='label'>Email Address</p><input name='occ[0][email]' class='invInpDesc' type='text' placeholder='Address'></li><div id='addOccupantBtn'class='center'><button id='invLiInput' type='button' onclick='addOccupantClicked()'>Add more occupants</button></div>";
    occCount = 1;
}

function addOccupantClicked(){
    var list = document.getElementById('occList');
    occCount++;
    var copy = document.getElementById('occTemplate').cloneNode(true);
    copy.childNodes[0].innerHTML = "Occupant " + occCount;
    copy.childNodes[2].setAttribute('name', "occ["+ (occCount-1) +"][fname]");
    copy.childNodes[4].setAttribute('name', "occ["+ (occCount-1) +"][lname]");
    copy.childNodes[6].setAttribute('name', "occ["+ (occCount-1) +"][mname]");
    copy.childNodes[8].setAttribute('name', "occ["+ (occCount-1) +"][email]");
    list.insertBefore(copy, document.getElementById('addOccupantBtn'));
}


function endRentClicked(elem){
    toggleHide('backDeleteModal');
    document.getElementById("delForm").setAttribute("action", "/deleteRoom");
    document.getElementById("rmId").setAttribute("value", elem.getAttribute("id"));
}






// var tileCtr = 1;

// function addTile(elem){
//     tileCtr++;
//     tile1 = document.getElementById("roomTile");
//     tile2 = tile1.cloneNode(true);
//     tile2.classList.remove("hide");
//     tile2.children["roomTitle"].textContent = "Room " + tileCtr;
//     tile2.setAttribute("id", "room"+tileCtr);
//     var tile = "room"+(tileCtr-1);
//     document.getElementById("tileContainer").insertBefore(tile2, document.getElementById("tileContainer").childNodes[tileCtr-1]);
// }


