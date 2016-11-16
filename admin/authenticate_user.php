<?php

include_once('../repository/User.php');

$user = new User();



if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){

    $_POST = json_decode(file_get_contents('php://input'), true);

}

// LOGIN REQUEST

if( isset($_POST['__caller']) && $_POST['__caller'] == 'login'){
      $user_data = [
          'user_email' => $_POST['username'],
          'password' => $_POST['password']
      ];
   // exit(json_encode(['success' => false]));

    //var_dump($user_data);
//    exit(json_encode(['count' => $user->login($user_data) ])); // return an empty string

    if($user->login($user_data)){

        exit(json_encode(['success' => true, 'data' => $user->login($user_data)]));

    }

    exit(json_encode(['success' => false]));

}


// Register new user

if( isset($_POST['_caller']) && $_POST['_caller'] == 'insert'){

    $user_info = [
        'name' => addslashes($_POST['username']),
        'email' => $_POST['email'],
        'phone' => $_POST['phone'],
        'password' => md5($_POST['password'])
    ];


    if($user->register($user_info)){

        exit(json_encode(['success' => TRUE, 'id' => $user->mysqli->insert_id]));

    }

    exit(json_encode(['success' => FALSE]));

}


exit("From Outer Block");

/*

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

return $subjects->index();

*/

//return $user->login();
