<?php
include_once("MysqlConnection.php");

/**
 * Created by PhpStorm.
 * User: Fahad
 * Date: 11/1/2016
 * Time: 12:27 AM
 */
class User extends MysqlConnection
{


    protected $table = "users";

    public function allAccounts(){
        return $this->getAll($this->table);
    }


    public function getProfileData($id){
        return $this->get($id, $this->table);
    }


    public function update($id, $data_arr){

        return $this->updateRow($id, $data_arr, $this->table);

    }


    public function destroy($id){

        return $this->delete($id, $this->table);

    }
    
    

    public function login($login_credentials){

        $user_email = addslashes($login_credentials['user_email']);
        $psw = md5($login_credentials['password']);

        $query = $this->mysqli->query("SELECT `u`.*, `ru`.*, `r`.*  
                                       FROM `users` u
                                       JOIN  `role_user` ru ON u.`id` = ru.`user_id`
                                       JOIN `roles` r ON  ru.`role_id` = r.`id`
                                       WHERE email = '{$user_email}' && password = '{$psw}'
                                       ");


        if($query->num_rows > 0){
            return $query->fetch_object();
        }


        return false;

        //die($this->mysqli->error);


    }


    public function register($user_info){

        if (!is_array($user_info)) {

            exit("Registration operation expects an array of user information !");

        }


        if ($this->addNew($user_info, $this->table)) {

            $user_role = [
                'user_id' => $this->mysqli->insert_id,
                'role_id' => 2
            ];

            $this->addNew($user_role, 'role_user');

            return true;

        }

        return false;

    }

}

/*
$user = new User();
var_dump($user->getUserData(2));

$user_info = [
    'name' => 'Golam Kibrea',
    'email' => 'gk_kibrea@gmail.com',
    'phone' => '01672316448',
    'password' => md5('member')
];
*/
//echo $user->register($user_info);


//var_dump($user->login([]));