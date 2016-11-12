<?php

include_once("MysqlConnection.php");

/**
 * Created by PhpStorm.
 * User: Fahad
 * Date: 10/21/2016
 * Time: 8:31 PM
 */
class Question extends MysqlConnection
{

    protected $table = "questions";
    protected $subject_id;

    /**
     * Retrieve All the questions for a given subject id
     * @param $subjectId, the subject on which the question is related to.
     * @return QuestionObject
     * 
     */

    public function index($subject_id){

        $this->subject_id = $subject_id;

        $questions = $this->getAll($this->table, ['subject_id' => $this->subject_id]);

        return json_encode($questions);


    }


    /**
     *
     * create a new question
     * @param $questionProperty, Property of the question to store.
     * @return boolean
     *
     */

    public function store($questionProperty){

        if(!is_array($questionProperty)){

            die(" $questionProperty should be an array of col, value pair");
        }

        return $this->addNew($questionProperty, $this->table);


    }


    /**
     * Retrive the question which has the given id
     * @param $id, id of the question
     * @return object
     *
     */


    public function getById($id){

        return $this->get($id, $this->table);

    }



    /**
     * Update the question which has the given id
     * @param $id, id of the question
     * @param $question_array, property of the question to update
     * @return boolean
     * 
     */
    
    public function update($id, $question_array){

        return parent::updateRow($id, $question_array, $this->table);

    }



    /**
     * Delete a question which has the given id
     * @param $question_id
     * @return boolean
     *
     */

    public function destroy($id){

        return $this->delete($id, $this->table);

    }
    





}
/*
$questions = new Question(1);

//echo $questions->index();
var_dump($questions->getById(1));
*/