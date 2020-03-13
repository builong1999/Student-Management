function viewSubjectData(tableID){
  $.ajax({
    method: "GET",
    url: "/viewSubjectData"
  }).done(function(data) {
    subjectList = data;
      var tbl = `<table class="SubjectTable">
      <thead>
      <tr>
        <th>ID<input id="findSubjectID" class="search" type="text" placeholder="ID môn học"></p></th>
        <th>Name<input id="findSubjectName" class="search" type="text" placeholder="Tên môn học"></th>
        <th>Credit</th>
        <th>Lesson</th>
        <th>Description</th>
        <th><input id="checkall" class="checkall" type="checkbox"></th>
      </tr>
      </thead>
      <tbody id="subjectTable">`
      for (var i = 0; i < subjectList.rowsAffected; i++)
      {
        tbl+=`<tr>
        <td>${subjectList.recordset[i].courseID}</td>
        <td>${subjectList.recordset[i].courseName}</td>
        <td>${subjectList.recordset[i].courseCredit}</td>
        <td>${subjectList.recordset[i].courseLesson}</td>
        <td>${subjectList.recordset[i].courseDescription}</td>
        <td><input id='select' class='check-box' type='checkbox' value=${subjectList.recordset[i].courseID}></td>
        </tr>`;
      }
      tbl+=`</tbody>
      </table>`
      $(tableID).html(tbl);
      $("#checkall").change(function(){
        if(this.checked){
          $(".check-box").each(function(){
            if(this.parentElement.parentElement.style[0]!='display')
              this.checked=true;
          })
        }
        else{
          $(".check-box").each(function(){
            if(this.parentElement.parentElement.style[0]!='display')
              this.checked=false;
          })
        }
      })
      $("#findSubjectID").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#subjectTable tr").filter(function() {
          var id =$(this.children[5].children[0]).map(function(){
            return this.checked;
          });
          $(this).toggle($(this.children[0]).text().toLowerCase().indexOf(value) > -1 || id[0])
        });
      });
      $("#findSubjectName").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#subjectTable tr").filter(function() {
          var id =$(this.children[5].children[0]).map(function(){
            return this.checked;
          });
          $(this).toggle($(this.children[1]).text().toLowerCase().indexOf(value) > -1 || id[0])
        });
      });    
  })   
}