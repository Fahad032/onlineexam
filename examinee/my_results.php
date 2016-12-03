<?php

include_once('../repository/Results.php');

$results = new Results();



if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){

    $_POST = json_decode(file_get_contents('php://input'), true);

}

// GET ALL OF THE USER RESULTS

if( isset($_POST['_caller']) && $_POST['_caller'] == 'get_results'){

    $user_id = $_POST['user_id'];

    if($results->myResults($user_id)){

        exit(json_encode($results->myResults($user_id)));

    }

    return false;

}


