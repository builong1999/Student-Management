// --------------------------------TEMPLATE--------------------------

var list = document.getElementById('label-click');
var work = document.getElementById('func-click');
var work_list = document.getElementById('showFunction');
var work_list_student = document.getElementById('function-student');
var work_list_teacher = document.getElementById('function-teacher');
var work_list_admin = document.getElementById('function-admin');
var About = document.getElementById('pAbout');
var about_list = document.getElementById('aboutShow');
var about_list_student = document.getElementById('student-about');
var about_list_teacher = document.getElementById('teacher-about');
var about_list_admin = document.getElementById('admin-about');
var posName = document.getElementById('posName');

var span1 = document.getElementById('span1');
var span2 = document.getElementById('span2');
var span3 = document.getElementById('span3');
var span4 = document.getElementById('span4');
var list_left = document.getElementById('Left');

var disable = document.getElementById('disable');
var body = document.getElementById('body');

function setDisplay(condition) {
        if (condition) {
            list_left.style.width = "260px";
            span1.style.display = "inline-block";
            span2.style.display = "inline-block";
            span3.style.display = "inline-block";
            span4.style.display = "inline-block";
            // add form style
            disable.style.display = "inline-block";
            body.style.overflow = "hidden";
        }
        else {
            list_left.style.width = "60px";
            span1.style.display = "none";
            span2.style.display = "none";
            span3.style.display = "none";
            span4.style.display = "none";
            work_list.style.display = "none";
            about_list.style.display = "none";
            
            disable.style.display = "none";
            body.style.overflow = "auto";
            // add form style

        }
}

setDisplay(false);

list.addEventListener('click', function () {
    this.style.backgroundColor = "#dcdcdc";
    setTimeout(function(){
        list.style.backgroundColor = "#fefefe";
    },200)
    if (list_left.style.width == "60px") {
        setDisplay(true)
    }
    else {
        setDisplay(false)
    }
})

work.addEventListener('click', function () {
    if (work_list.style.display == "none") {
        work_list.style.display = "inline-block";
        setDisplay(true);
    }
    else {
        work_list.style.display = "none";
    }
})

About.addEventListener('click', function(){
    if (about_list.style.display == "inline-block"){
        about_list.style.display = "none";
    }
    else {
        setDisplay('true');
        about_list.style.display = "inline-block";
    }
})



document.getElementById('Cpass').addEventListener('click', function () {
    event.preventDefault();
    window.open('/change-pass')
})
//-----------------------------------ENDTEMP---------------------------------
// ----------------------------------------GLOBAL VARIABLE-----------------------------------------

var tbl = document.getElementById('tbl');
var select = document.getElementById('navSelect');
var info = document.getElementById('navDInfo');
var spanu = document.getElementById('span-username');
var rnew = document.getElementById('pass');
var alert = document.getElementById('alert');
var validate = document.getElementById('validate');
// ------------------------------------------SEARCHING---------------------------------------------
var userF ="", idF ="", hostF ="", posF = "";


document.getElementById('userF').addEventListener('keyup',function(){
    userF = this.value;
    searchRowsInfo();
})
document.getElementById('idF').addEventListener('keyup',function(){
    idF = this.value;
    searchRowsInfo();
})
document.getElementById('hostF').addEventListener('keyup',function(){
    hostF = this.value;
    searchRowsInfo();
})
document.getElementById('posF').addEventListener('keyup',function(){
    posF = this.value;
    searchRowsInfo();
})

function searchRowsInfo(){
    var arr = new Array(5);
    var length = tbl.rows.length;
    var temp = 0;
    arr[temp] = [];

    for (var i = 0; i < length; i++){
        arr[temp][i] = i;
    }
    if (userF != ""){
        arr[temp+1] = [];
        for( var i = 0, j = 0; i < length; i++){
            var obj = tbl.rows.item(arr[temp][i]);
            if (!obj.cells[0].textContent.includes(userF)){
                obj.style.display = 'none';
            }
            else{
                obj.style.display = "table-row";
                arr[temp+1][j++] = arr[temp][i];
            }
        }
        temp++;
        length = arr[temp].length;
    }
    
    if (idF != ""){
        arr[temp+1] = [];
        for( var i = 0, j = 0; i < length; i++){
            var obj = tbl.rows.item(arr[temp][i]);
            if (!obj.cells[1].textContent.toUpperCase().includes(idF.toUpperCase())){
                obj.style.display = 'none';
            }
            else{
                obj.style.display = "table-row";
                arr[temp+1][j++] = arr[temp][i];
            }
        }
        temp++;
        length = arr[temp].length;
    }
    
    if (hostF != ""){
        arr[temp+1] = [];
        for( var i = 0, j = 0; i < length; i++){
            var obj = tbl.rows.item(arr[temp][i]);
            if (!obj.cells[2].textContent.toUpperCase().includes(hostF.toUpperCase())){
                obj.style.display = 'none';
            }
            else{
                obj.style.display = "table-row";
                arr[temp+1][j++] = arr[temp][i];
            }
        }
        temp++;
        length = arr[temp].length;
    }

    if (posF != ""){
        arr[temp+1] = [];
        for( var i = 0, j = 0; i < length; i++){
            var obj = tbl.rows.item(arr[temp][i]);
            if (!obj.cells[3].textContent.toUpperCase().includes(posF.toUpperCase())){
                obj.style.display = 'none';
            }
            else{
                obj.style.display = "table-row";
                arr[temp+1][j++] = arr[temp][i];
            }
        }
        temp++;
        length = arr[temp].length;
    }
}

// ---------------------------------------------SHOWING----------------------------------------------
var ID = "";
var saveIndex = 0;
var count = true;
for (var i = 0; i < tbl.rows.length; i++){
    tbl.rows[i].onclick =function(){
        validate.style.display = "none";
        tbl.rows.item(saveIndex).style.backgroundColor = "white";
        tbl.rows.item(saveIndex).style.color = "black";
        if (count){
            select.style.marginLeft = "-180px";
            info.style.display = "inline-block";
            count = false;
        }
        saveIndex = this.rowIndex;
        this.style.backgroundColor = 'black';
        this.style.color = 'white';
        ID = this.cells[1].textContent;
        spanu.textContent = this.cells[0].textContent;
    }
}

document.getElementById('submit').addEventListener('click', function(event){
    event.preventDefault();
    if (rnew.value.length == 0){
        alert.style.display = "inline-block";
        alert.style.color = "red";
        alert.textContent = "Bạn chưa nhập thông tin"
    }
    else if (rnew.value.length < 8){
        alert.style.display = "inline-block";
        alert.style.color = "red";
        alert.textContent = "Mật khẩu mới phải dài hơn 7 ký tự"
    }
    else {
        var Pass = rnew.value.trim();
        $.ajax({
            url:'/management/renew-done',
            type:'POST',
            data:{ID, Pass}
        }).done(function(result){
            if (result == "done"){
                validate.style.display = "inline-block";
            }
        })
    }
})

document.getElementById('pass_icn').addEventListener('click',function(event){
    if (rnew.type == "password"){
        this.innerHTML = '<i class="fas fa-eye-slash"></i>'
        rnew.type = "text";
    }
    else {
        rnew.type = "password";
        this.innerHTML = '<i class="fas fa-eye"></i>';
    }
})