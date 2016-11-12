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

    public function login($login_credentials){

        $user_email = addslashes($login_credentials['user_email']);
        $psw = md5($login_credentials['password']);

        $query = $this->mysqli->query("SELECT `u`.*, `ru`.*, `r`.*  
                                       FROM `users` u
                                       JOIN  `role_user` ru ON u.`id` = ru.`user_id`
                                       JOIN `roles` r ON  ru.`role_id` = r.`id`
                                       WHERE email = '{$user_email}'
                                       ");


        if($query->num_rows > 0){
            return $query->fetch_object();
        }


        return false;

        //die($this->mysqli->error);


    }

}


//$user = new User();
//var_dump($user->login([]));