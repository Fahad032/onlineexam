<?php

include_once('../repository/subject.php');

$subjects = new Subject();



if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){

    $_POST = json_decode(file_get_contents('php://input'), true);

}

if( isset($_POST['_caller']) == 'insert'){

    $subject = [
        'title' => $_POST['title'],
        'test_duration' => $_POST['test_duration'],
        'scale' => $_POST['scale'],
        'total_question' => $_POST['total_question']
    ];

   if($subjects->store($subject)){

       exit(json_encode(['success' => TRUE]));

   }

    exit(json_encode(['success' => FALSE]));

}

exit($subjects->index());

//return $subjects->index();

