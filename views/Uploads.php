<?php
ob_start();
if(isset($_POST['submitBtn']))
  {
    include('Course_view.php');
    $total=count($_FILES['myFile']['name']);
    for($i=0; $i < $total; $i++)
  {
    $file=$_FILES['myFile'];
  $fileName= $file['name'][$i];
  $fileType=$file['type'][$i];
  $fileTempName=$file['tmp_name'][$i];
  $fileError=$file['error'][$i];
  $fileSize=$file['size'][$i] ;

  $fileExt=explode(".",$fileName);
  $fileActualExt=mb_strtolower(end($fileExt));

  $AllowedExt= array('png','jpg','jpeg','docx','pdf','xlsx','xls','zip','rar' );

  if(in_array($fileActualExt,$AllowedExt))
  {
    if($fileError===0)
    {
      if($fileSize<10000000)
      {

        $fileNameNew=uniqid($DClass.'_'.$Semester.'_'.$Group.'_'.$fileName.'_',True).".".$fileActualExt;
        $fileDestination='uploads/' .$fileNameNew;
        move_uploaded_file($fileTempName,$fileDestination);
        if($conn)
        {
          $sql= "INSERT INTO Material
                  VALUES ('$DClass','$Semester','$Group',N'$fileName',N'$fileDestination',CAST(GETDATE() AS DATETIME))";
          $params=array();
          $check=sqlsrv_query($conn,$sql,$params);
          header("Location: Course_view.php?UploadsSuccess!");
        }
      else {
        echo "File is too large (<10MB)";
      }
    }
    else {
//echo "There was a error occur";
    }
  }
  else{
  //  echo "Cannot upload this type of file!";
  }
}}
}
if(isset($_POST['checkjs']))
{

  header("Location: /Score");
}
?>
