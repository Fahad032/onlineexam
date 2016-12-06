<?php

include_once('MysqlConnection.php');

/**
 * Created by PhpStorm.
 * User: Fahad
 * Date: 10/18/2016
 * Time: 11:39 PM
 */
class Exam extends MysqlConnection
{

    protected $table = "user_test";

    /**
     * Get all the tests for the logged in user
     */

    public function index(){

        $subjects = $this->getAll($this->table);

        //echo json_encode($subjects);

        return json_encode($subjects);


    }

    /**
     *
     * show create subject form
     */
    public function create(){



    }


    /**
     *
     * create a new test record
     * @param $testProp , properties of a test
     * @return boolean
     *
     */
    public function store($testProp){

        if(!is_array($testProp)){

            die(" $testProp should be an array of col, value pair");
        }

        return $this->addNew($testProp, $this->table);


    }


    /**
     *
     * Find a subject to edit
     */
    public function edit($id){


    }



    /**
     *
     * Update a Exam record
     */
    public function update($id, $update_array){

        /* if(parent::updateRow($id, $update_array, $this->table)){

            // return json_encode($this->get($id, $this->table));
             return true;

         }
        */

        return parent::updateRow($id, $update_array, $this->table);

    }


    /**
     *
     * Delete an Exam record
     */
    public function destroy($id){

        return $this->delete($id, $this->table);

    }


}

/*
echo (new DateTime("now", new DateTimeZone('Asia/Dhaka')))->format('Y-m-d H:i:s');

$test = new Exam();

$myTest = [
    'user_id' => 2,
    'subject_id' => 30,
    'score'=> 0,
    'total_correct_answer' => 20,
    'total_wrong_answer' => 10
];
$test->store($myTest);

$insert_id = $test->mysqli->insert_id;

var_dump( $test->get($insert_id, 'user_test') );

echo "<br />";
*/
//var_dump( $subjects->update($insert_id, ['title' => 'Software Engineering V2']) );


//$subjects->destroy($insert_id);
