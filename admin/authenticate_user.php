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



// Get Profile Data Of A User

if(isset($_POST['_caller']) && $_POST['_caller'] == 'user_profile'){

    $profile_data = $user->getProfileData($_POST['id']);

    if($profile_data){

        exit(json_encode(['success' => TRUE, 'profile_data' => $profile_data]));

    }

    exit(json_encode(['success' => FALSE]));


}


//exit("From Outer Block");


// UPDATE AN EXISTING SUBJECT RECORDS


if(isset($_POST['_caller']) && $_POST['_caller'] == 'update_profile'){

    $profile_data = [
        'name' => $_POST['name'],
        'email' => $_POST['email'],
        'phone' => $_POST['phone'],
        'updated_at' => $time = (new DateTime("now", new DateTimeZone('Asia/Dhaka')))->format('Y-m-d H:i:s')
    ];

    if(trim($_POST['psw']) != null && trim($_POST['psw']) != ''){

        $profile_data['password'] = md5($_POST['psw']);

    }

    if($user->update($_POST['id'], $profile_data)){

        exit(json_encode(['success' => TRUE]));

    }

    exit(json_encode(['success' => FALSE]));


}

// DELETE AN ACCOUNT

if(isset($_POST['_caller']) && $_POST['_caller'] == 'delete') {

    if($user->destroy($_POST['id'])){
        exit(json_encode(['success' => TRUE]));
    }
    
    exit(json_encode(['success' => FALSE]));
}

exit(json_encode($user->allAccounts()));

//return $subjects->index();



//return $user->login();
