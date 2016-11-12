<?php

include_once('../repository/Answer.php');
$answers = new Answer();
$question_id = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){

    $_POST = json_decode(file_get_contents('php://input'), true);

    if(isset($_POST['question_id'])){

        $question_id = $_POST['question_id'];

    }

}

// INSERT A NEW ANSWER

if( isset($_POST['_caller']) && $_POST['_caller'] == 'insert'){
    
    $answer = [
        'question_id' => $_POST['question_id'],
        'details' => $_POST['details'],
        'correct' => $_POST['correct']
    ];

    if($answers->store($answer)){

        exit(json_encode(['success' => TRUE, 'id' => $answers->mysqli->insert_id]));

    }

    exit(json_encode(['success' => FALSE]));

}


// DELETE A ANSWER RECORDS

if(isset($_POST['_caller']) && $_POST['_caller'] == 'delete'){

    if($answers->destroy($_POST['id'])){

        exit(json_encode(['success' => TRUE]));

    }

    exit(json_encode(['success' => FALSE]));


}

// UPDATE AN EXISTING ANSWER RECORDS

if(isset($_POST['_caller']) && $_POST['_caller'] == 'update'){

    $answer = [
        'details' => $_POST['details'],
        'correct' => $_POST['correct'],
        'updated_at' => (new DateTime())->format('Y-m-d H:i:s')
    ];

    if($answers->update($_POST['id'], $answer)){

        exit(json_encode(['success' => TRUE]));

    }

    exit(json_encode(['success' => FALSE]));


}


exit(json_encode($answers->getQuestionWithAnswers($question_id)));

