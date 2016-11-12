<?php

include_once('../repository/question.php');
$questions = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){

    $_POST = json_decode(file_get_contents('php://input'), true);

    if(isset($_POST['subject_id'])){

        $subject_id = $_POST['subject_id'];
        $questions = new question();


    }

}


// GET A QUESTION BY ITS ID

if( isset($_POST['_caller']) && $_POST['_caller'] == 'get_by_id'){

    $questionId = $_POST['id'];
    $question = $questions->getById($questionId);
    exit(json_encode(['success' => TRUE, 'data' => $question ]));

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
        'updated_at' => (new DateTime())->format('Y-m-d H:i:s')
    ];

    if($questions->update($_POST['id'], $question)){

        exit(json_encode(['success' => TRUE]));

    }

    exit(json_encode(['success' => FALSE]));


}


exit($questions->index($subject_id));

//return $questions->index();

