<?php

include_once('../repository/Exam.php');

$test = new Exam();



if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){

    $_POST = json_decode(file_get_contents('php://input'), true);

}

// INSERT A NEW TEST RECORD

if( isset($_POST['_caller']) && $_POST['_caller'] == 'insert'){

    $initial_test_record = [
        'user_id' => $_POST['user_id'],
        'subject_id' => $_POST['subject_id'],
        'score' => $_POST['score'],
        'total_correct_answer' => 0,
        'total_wrong_answer' => 0
    ];

    if($test->store($initial_test_record)){

        exit(json_encode(['success' => TRUE, 'id' => $test->mysqli->insert_id]));

    }

    exit(json_encode(['success' => FALSE]));

}



// UPDATE AN EXISTING SUBJECT RECORDS

if(isset($_POST['_caller']) && $_POST['_caller'] == 'update'){

    $test_record = [
        'total_correct_answer' => $_POST['total_correct_answer'],
        'total_wrong_answer' => $_POST['total_wrong_answer'],
        'updated_at' => $time = (new DateTime())->format('Y-m-d H:i:s')
    ];

    if($test->update($_POST['testId'], $test_record)){

        exit(json_encode(['success' => TRUE]));

    }

    exit(json_encode(['success' => FALSE]));


}
