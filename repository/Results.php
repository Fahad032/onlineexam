<?php
include_once("MysqlConnection.php");

/**
 * Created by PhpStorm.
 * User: Fahad
 * Date: 11/1/2016
 * Time: 12:27 AM
 */
class Results extends MysqlConnection
{


    protected $table = "user_test";


    public function myResults($user_id){

        $query = $this->mysqli->query("SELECT `ut`.*, `s`.id as sub_id,
                                          `s`.title,
                                    `s`.scale,
                                    `s`.total_question,
                                    `s`.test_duration
                                     
                                       FROM `user_test` ut
                                       JOIN  `subjects` s ON ut.`subject_id` = s.`id`
                                       WHERE user_id = '{$user_id}'
                                       ");

        if($query->num_rows > 0){

            $results = [];

            while($fetched_row = $query->fetch_object()){
                $results[] = $fetched_row;
            }

            return $results;

        }


        return false;


//        $results = $this->getAll($this->table, ['user_id' => $userId]);
//        return json_encode($results);

    }


}


/*
$results = new Results();
var_dump($results->myResults(2));
*/