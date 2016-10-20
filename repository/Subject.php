<?php

include_once('MysqlConnection.php');

/**
 * Created by PhpStorm.
 * User: Fahad
 * Date: 10/18/2016
 * Time: 11:39 PM
 */
class Subject extends MysqlConnection
{

    protected $table = "subjects";

    /**
     * Get all the subjects from subject table
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
     * create a new subject
     * @param $subjectProp , properties of a subject
     * @return boolean
     *
     */
    public function store($subjectProp){

        if(!is_array($subjectProp)){

            die(" $subjectProp should be an array of col, value pair");
        }

        return $this->addNew($subjectProp, $this->table);


    }


    /**
     *
     * Find a subject to edit
     */
    public function edit($id){


    }



    /**
     *
     * Update a subject
     */
    public function update($id, $update_array){

        if(parent::updateRow($id, $update_array, $this->table)){

            return json_encode($this->get($id, $this->table));

        }


    }


    /**
     *
     * Delete a subject
     */
    public function destroy($id){

        $this->delete($id, $this->table);


    }


}

/*
$subjects = new Subject();
$subjects->index();

$mysubject = [
    'title' => "Software Engineering",
    'scale' => "4.00",
    'total_question' => 20,
    'test_duration' => '40min Max'
];
$subjects->store($mysubject);

$insert_id = $subjects->mysqli->insert_id;

var_dump( $subjects->get(1, 'subjects') );

echo "<br />";

var_dump( $subjects->update($insert_id, ['title' => 'Software Engineering V2']) );


//$subjects->destroy($insert_id);

*/