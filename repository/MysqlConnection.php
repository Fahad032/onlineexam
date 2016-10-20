<?php

/**
 * Created by PhpStorm.
 * User: Fahad
 * Date: 10/18/2016
 * Time: 11:10 PM
 */
class MysqlConnection
{
    public $mysqli;

    public function __construct(){

        $this->dbConnect();

    }

    protected function dbConnect($host = 'localhost', $user='root', $psw = '', $db = 'online_exam'){

        $this->mysqli = new mysqli();
        $this->mysqli->connect($host, $user, $psw ,$db);

        if($this->mysqli->connect_errno){
            die("Connection failed, " . $this->mysqli->connect_error);
        }

    }


    public function getAll($table){

        $query = $this->mysqli->query("SELECT * FROM $table");

        $results = [];

        while($fetched_row = $query->fetch_object()){
            $results[] = $fetched_row;
        }

        return $results;


    }


    public function get($id, $table){

        $query = $this->mysqli->query("SELECT * FROM $table WHERE id=$id");

        // print_r($query->fetch_object());

        return $query->fetch_object();

    }


    public function addNew($recordValue, $table){

        /*
        $recordValue = [
            'name' => 'Fahad',
            'email' => 'fhdplsh032@gmail.com'
        ];
        */

        //INSERT INTO user(name, email, password, contact_no, created_at, updated_at)
        // VALUES($name, $email, $password, $contact_no, $created_at, $updated_at);

        $time = (new DateTime())->format('Y-m-d H:i:s') ;
        $recordValue['created_at'] = $time;

        $cols = '';
        $values = '';

        $item = count($recordValue);

        foreach($recordValue as $col => $val){
            $cols .= $col;
            $values .= '"'. $val . '"';


            if(--$item != 0 ){
                $cols .= ', ';
                $values .= ', ';
            }

        }


        $sql = "INSERT INTO {$table}( ";

        $sql .= $cols . ") VALUES(" . $values .")";

        if($this->mysqli->query($sql) === TRUE){

            return true;

        }

        die("Query failed" . mysqli_error($this->mysqli));

    }


    public function updateRow($id, $array_values, $table){

        //UPDATE tablename
        // SET colkey_1 = colval_1, colkey_2 = colval_2
        // WHERE colkey=colval

        $sql = "UPDATE $table SET ";

        $key_count = count($array_values);

        foreach($array_values as $key => $val){


            $sql .= $key . ' = "' . $val . '"';

            (--$key_count > 0) ? ($sql .= ', ') : '';

        }

        $sql .= "WHERE id = $id";

        $this->mysqli->query($sql);

        if($this->mysqli->affected_rows > 0){

            return true;

        }

        die( 'Error: '. mysqli_error($this->mysqli));

    }



    public function delete($id, $table){

        $this->mysqli->query("DELETE FROM subjects WHERE id = 10");

        if($this->mysqli->affected_rows > 0){
            return true;
        }

        die("Oops! error occurred, it seems this record doesn't exists" . mysqli_error($this->mysqli) );

    }

}
