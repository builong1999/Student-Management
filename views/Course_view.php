
<?php
//echo $_SERVER['HTTP_HOST'];
//echo $_SERVER['REQUEST_URI'];
/*include('Login.php');
if(!isset($_SESSION))
    {
        session_start();
    }
$LogID= $_SESSION['LoginID']; // outputs "Invalid input"
$LoginType=$_SESSION['LoginType'];
//echo $LogID;
//echo $LoginType;
if($LoginType=='' || $LogID=='')
 header("Location: index.php");*/
$DClass='AV4';
$Semester='181';
$Group='L01';
$serverName="MEEP\ROOT";
$connectionInfo=array("Database"=> "Student_Management");
$conn= sqlsrv_connect($serverName,$connectionInfo);
 ?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Course Name</title>
    <link rel="stylesheet" href="./resources/css/style.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
        integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">


        <style >
        .subbtn{
            text-decoration: none;
            text-align: center;
            font-size: 110%;
            background-color:#ffbf00;
            margin-top: 20px;
            width: 100px;
            margin-right: 35px;
            padding: 6px 5px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
        }
        .subbtn:hover{
            background-color:  #ff8000;
        }

        .delbtn{
            text-decoration: none;
            text-align: center;
            font-size: 110%;
            background-color:#ff4000;
            margin-top: 20px;
            width: 100px;
            margin-right: 35px;
            padding: 6px 5px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
        }
        .delbtn:hover{
            background-color:  #ff0000;
        }

        .space{
          margin-top: 20px;
          margin-left: 320px;
        }
        p{
          display: inline-block;
        }
        h2{
            display: inline-block;
        }
          table {
            border-collapse: collapse;
            width: 1000px;
            border-style: groove;


          }
          th, td {
            text-align: left;
            padding: 8px;
            border-style: solid;
            border-width: 1px;
          }
          tr:nth-child(even) {background-color: #f2f2f2;}
          #content{
              width:calc(100%-300px)
              float:right;
              height:500px;

          }
          #heading{

            width:300px;
            height:500px;
            background-color:lightBLUE;
            float:left;
            border-radius:10px;
          }
          a{

              text-decoration: none;
              color:navy;
          }
          a:hover{
            border-bottom: 2px solid;
          }
          .heardingcontent{
            padding: 10px 10px 10px 40px;
            margin-top:10px;
            color:red;
          }
          li{
            margin-top: 20px;
            margin-left: 20px;
          }
          .Members{
            width:calc(100%-300px)
            padding-left=300px;
          }
          .btnremove{
            background-color: red;
            border: none;
            color: white;
            outline:none;
            text-align: center;
            opacity: 0.6;
            display: inline-block;
            text-decoration: none;
            cursor: pointer;
            background: none;
          }
          .btnremove:hover{
            opacity:1;
          }
          .btnremove:active{
          background:none;
            box-shadow: 0 5px white;
            transform: translateY(4px);
          }
          .btnadd{
            display:inline-block;
            color:dark;
            background-color: GreenYellow ;
            padding: 10px 25px;
            border-radius: 15px;
            margin: 4px 2px;
            border: none;
            text-align: center;
             display: inline-block;
             cursor: pointer;
              text-decoration: none;
              text-decoration: none;
              box-shadow: 0 5px #999;
              outline:none;
              overflow:visible;
          }
          .btnadd:active {
            background-color:Chartreuse ;
            box-shadow: 0 5px #999;
            transform: translateY(4px);
          }
          .imgMaretial{
            height:20px;
          }
          .List_CourseMaterial{
            list-style-type: none;
            border-radius: 12px;
          }
      /*   .upload-btn-wrapper {
            position: relative;
            overflow: hidden;
            display: inline-block;
          }

          .btn {
            border: 2px solid gray;
            color: gray;
            background-color: white;
            padding: 8px 20px;
            border-radius: 8px;
            font-size: 20px;
            font-weight: bold;
            }

            .upload-btn-wrapper input[type=file] {
              font-size: 100px;
              position: absolute;
              left: 0;
              top: 0;
              opacity: 0;
            }*/
            /* Customize the label (the container) */
            .container {
              display: block;
              position: relative;
              padding-left: 35px;
              margin-bottom: 22px;
              margin-left: 10px;
              cursor: pointer;
              font-size: 22px;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }

            /* Hide the browser's default checkbox */
            .container input {
              position: absolute;
              opacity: 0;
              cursor: pointer;
              height: 0;
              width: 0;
            }

            /* Create a custom checkbox */
            .checkmark {
              position: absolute;
              top: 0;
              left: 0;
              height: 25px;
              width: 25px;
              background-color: #eee;
            }

            /* On mouse-over, add a grey background color */
            .container:hover input ~ .checkmark {
              background-color: #ccc;
            }

            /* When the checkbox is checked, add a blue background */
            .container input:checked ~ .checkmark {
              background-color: #f22121;
            }

            /* Create the checkmark/indicator (hidden when not checked) */
            .checkmark:after {
              content: "";
              position: absolute;
              display: none;
            }

            /* Show the checkmark when checked */
            .container input:checked ~ .checkmark:after {
              display: block;
            }
            /* Style the checkmark/indicator */
            .container .checkmark:after {
              left: 9px;
              top: 5px;
              width: 5px;
              height: 10px;
              border: solid white;
              border-width: 0 3px 3px 0;
              -webkit-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              transform: rotate(45deg);
            }
        </style>
  </head>
  <body >
    <header>
      <div class="Logo"><img class="imgLogo" src="./resources/imagine/logo.png" alt="Logo"></div>
      <div class="clearfix"></div>
      <div class="headInfo">

          <ul class="miniHeadInfo">
              <li><a href="">Trang chủ</a></li>
              <li><a href="">Trang của tôi</a></li>
              <li><a href="index.php" >
                <form class="" action="Logout.php" method="post">
                  <button type="submit" name="LogoutBtn">Đăng xuất</button>
              </form>
            </a></li>
          </ul>
      </div>

    </header>
    <main>
      <div class="">
        <div id="heading">
          <h2 style="text-align:center;">Điều hướng</h2>
          <ul >
            <li><a href="helloworld.html">Trang của tôi</a></li>
            <li><a href="Course_view.html">Tài liệu khoá học</a></li>
            <li><a href="Course_member.html">Danh sách thành viên</a></li>
          </ul>
        </div>
        <div class="space">
          <table>
            <thead>
            </thead>
            <tbody>
              <tr>
                <td>
                <ul class="List_CourseMaterial">
                  <a href="NewDaatabase_Test_Member_AV4.php">Go back to Course</a>

                  <form  action="Uploads.php" method="post" enctype="multipart/form-data">
                    <div class="upload-btn-wrapper">

                      <input type="submit" name="checkjs" value="Xem Diem">
                      <input <?php if($LoginType=='student'){ ?> style="visibility:hidden;" <?php } ?> class="btnadd" type="file" name="myFile[]" multiple size="50"   >
                      <input <?php if($LoginType=='student'){ ?> style="visibility:hidden;" <?php } ?> type="submit" name="submitBtn"class="subbtn" value="Send!" multiple="multiple">
                    </div>
                  </form>

                    <h2> Course introduction</h2>
                    <ul id="demo">
                           <?php
                             $sql="SELECT FileName,Destination,ID
                                   FROM Material M
                                   WHERE M.ClassCode='$DClass'AND M.Semester='$Semester' AND M.ClassGroup='$Group'
                                   ORDER BY FileName";
                             $params=array();
                             $option=array("Scrollable" => SQLSRV_CURSOR_KEYSET);
                             $result = sqlsrv_query($conn,$sql,$params,$option);
                             $count= sqlsrv_num_rows($result);
                             if($count>0)
                             {
                               while($row=sqlsrv_fetch_array($result,SQLSRV_FETCH_NUMERIC))
                               {
                                 ?>
                                 <li>
                                     <form action="DeleteFile.php" method="post">
                                       <span> <a style="display:inline-block;"href=" <?php echo $row[1]; ?> " download><?php echo $row[0]; ?> </a></span>
                                        <label style="display:inline-block;" class="container" >
                                           <input type="checkbox" name="<?php echo "deleteFile".$row[2];?>" >
                                           <span class="checkmark"></span>
                                         </label>
                                 </li>
                                 <?php
                               }
                             }
                            ?>
                    </ul>
                  </ul>
                  <input <?php if($LoginType=='student'){ ?> style="visibility:hidden;" <?php } ?>type="submit"class="delbtn" id="Delsubmit" name="Delsubmit" value="Delete!!!">
                  </form>
                </td>
              </tr>
            <!--    <tr>
                <td>
                <ul class="List_CourseMaterial">
                    <div class="upload-btn-wrapper">
                      <button class="btnadd"type="button" name="AddMaterial" onclick="Addlink()">Add</button>
                      <input type="file" type="button" class="btnadd"name="AddMaterial">
                    </div>
                    <h2>Course Material</h2>
                    <li>
                      <p > <a target="_blank"href="https://youtube.com">Youtube</a> </p>
                      <button  class="btnremove" type="button" name="btnRemoveMarerial">
                        <img class="imgMaretial"
                        src=".\resources\imagine\RemoveMaterial.png" alt="RemoveLogo"></button></li>
                      </li>
                    </ul>

                  </td>
                </tr>
-->
            </tbody>
          </table>
        </div>


        <!-- ADD more link for material here plzzzzzzzz-->
          </ul>
      </div>
    </main>
    <footer>

    </footer>
  </body>
</html>
