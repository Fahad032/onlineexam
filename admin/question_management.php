<?php

include_once('../repository/question.php');
$subject_id = 30;
$questions = new question($subject_id);



if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){

    $_POST = json_decode(file_get_contents('php://input'), true);

}

// INSERT A NEW QUESTION

if( isset($_POST['_caller']) && $_POST['_caller'] == 'insert'){

    $question = [
        'subject_id' => $subject_id,
        'title' => $_POST['title']
    ];

    if($questions->store($question)){

        exit(json_encode(['success' => TRUE, 'id' => $questions->mysqli->insert_id]));

    }

    exit(json_encode(['success' => FALSE]));

}


// DELETE A QUESTION RECORDS

if(isset($_POST['_caller']) && $_POST['_caller'] == 'delete'){

    if($questions->destroy($_POST['id'])){

        exit(json_encode(['success' => TRUE]));

    }

    exit(json_encode(['success' => FALSE]));


}

// UPDATE AN EXISTING QUESTION RECORDS

if(isset($_POST['_caller']) && $_POST['_caller'] == 'update'){

    $question = [
        'title' => $_POST['title'],
    ];

    if($questions->update($_POST['id'], $question)){

        exit(json_encode(['success' => TRUE]));

    }

    exit(json_encode(['success' => FALSE]));


}


exit($questions->index());

//return $questions->index();

