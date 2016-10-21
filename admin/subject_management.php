<?php

include_once('../repository/subject.php');

$subjects = new Subject();



if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){

    $_POST = json_decode(file_get_contents('php://input'), true);

}

// INSERT A NEW SUBJECT

if( isset($_POST['_caller']) && $_POST['_caller'] == 'insert'){

    $subject = [
        'title' => $_POST['title'],
        'test_duration' => $_POST['test_duration'],
        'scale' => $_POST['scale'],
        'total_question' => $_POST['total_question']
    ];

   if($subjects->store($subject)){

       exit(json_encode(['success' => TRUE, 'id' => $subjects->mysqli->insert_id]));

   }

    exit(json_encode(['success' => FALSE]));

}


// DELETE A SUBJECT RECORDS

if(isset($_POST['_caller']) && $_POST['_caller'] == 'delete'){

    if($subjects->destroy($_POST['id'])){

        exit(json_encode(['success' => TRUE]));

    }

    exit(json_encode(['success' => FALSE]));


}

// UPDATE AN EXISTING SUBJECT RECORDS

if(isset($_POST['_caller']) && $_POST['_caller'] == 'update'){

    $subject = [
        'title' => $_POST['title'],
        'test_duration' => $_POST['test_duration'],
        'scale' => $_POST['scale'],
        'total_question' => $_POST['total_question'],
        'updated_at' => $time = (new DateTime())->format('Y-m-d H:i:s')
    ];

    if($subjects->update($_POST['id'], $subject)){

        exit(json_encode(['success' => TRUE]));

    }

    exit(json_encode(['success' => FALSE]));


}


exit($subjects->index());

//return $subjects->index();

