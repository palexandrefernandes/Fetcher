<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    if(isset($_GET['image'])){
        $dir = "upload/";
        $file = substr($_GET['image'], strrpos($_GET['image'], '/') + 1);
        $path_filename = $dir.$file;
        
        if (file_exists($path_filename)) {
            echo json_encode(['image' => $path_filename]);
        }
        else {
            $file = file_get_contents($_GET['image']);
            if(file_put_contents($path_filename, $file)){
                echo json_encode(['image' => $path_filename]);
            } 
            else{
                echo json_encode(['error' => 'Error processing image']);
            }
        }
    } else 
        echo json_encode(['error' => 'No image provided']);
?>