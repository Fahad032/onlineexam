<?php
include_once("MysqlConnection.php");

/**
 * Created by PhpStorm.
 * User: Fahad
 * Date: 11/1/2016
 * Time: 12:27 AM
 */
class Answer extends MysqlConnection
{

    protected $table = "answer_options";

    /*
     * Get all the answer with the question using a given question id
     * @param $question_id
     * @return array of object, containing the question & all of it's possible answer
     *
     * */


    public function getQuestionWithAnswers($question_id){

        $query = $this->mysqli->query("SELECT `q`.*, `ans`.*
                                       FROM `questions` q
                                       LEFT JOIN  `answer_options` ans ON q.`id` = ans.`question_id`
                                       WHERE q.`id` = '{$question_id}'
                                       ");

        if($query->num_rows > 0){

           $results = [];
            while($fetched_row = $query->fetch_object()){
                $results[] = $fetched_row;
            }

            return $results;
        }

        return false;

    }



    /**
     *
     * create a new answer
     * @param $answerArr, Property of the answer to store.
     * @return boolean
     *
     */

    public function store($answerArr){

        if(!is_array($answerArr)){

            die(" $answerArr should be an array of col, value pair");
        }

        return $this->addNew($answerArr, $this->table);

    }


    /**
     * Update the answer which has the given id
     * @param $id, id of the answer
     * @param $answer_array, property of the answer to update
     * @return boolean
     *
     */

    public function update($id, $answer_array){

        return parent::updateRow($id, $answer_array, $this->table);

    }



    /**
     * Delete an answer which has the given id
     * @param $id
     * @return boolean
     *
     */

    public function destroy($id){

        return $this->delete($id, $this->table);

    }


}


//$answers = new Answer();

//var_dump($answers->update(4, ['details' => 'Software Design Life Cycle']));
//$answers->store(['question_id' => 1, 'details' => 'System Design Life Cycle', 'correct' => 0]);
//var_dump($answers->getQuestionWithAnswers(1));
