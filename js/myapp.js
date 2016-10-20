var app = angular.module('MyApp', ["ngRoute", "ngMessages"]);

/*
app.controller('loginRegisterController', ["$scope", function($scope){

    $scope.logIn = function(){

        


    };



}]);
*/

app.controller('subjectArea',["$http", "$q", function($http, $q){

    var scope = this;

    this.showEditForm = false;
    this.message = {
        success: false,
        error: false,
        text: ''
    };


    function messageSuccess(){
        this.message.success = true;
        this.message.text = 'Successfully Added !';
    };

    this.messageError = function(){
        this.message.error = true;
        this.message.text = 'Sorry, Error Occurred !';

    };



    this.subjects = [
        {
            title: "Software Engineering",
            test_duration: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        },
        {
            title: "Nural Network",
            test_duration: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        },
        {
            title: "System Analysis & Design",
            test_duration: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        },
        {
            title: "Data Structure & Algorithm",
            test_duration: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        },
        {
            title: "Java Programming",
            test_duration: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        }

    ];

    // will get the subject from database

    var defObj = $q.defer();

    $http.get('subject_management.php').success(function(data){

        if(data.length > 0){
            scope.subjects = data;
        }

        defObj.resolve({
           data:data
        });


    }).error(function(error){
        console.log(error);
    });

    console.log(defObj.promise);

    /* Subjects functions */

    this.addSubject = function(){

        //console.log(this.subject_name);

        //push to the database first

        var newSubject = {
            title: this.subject_name,
            test_duration: this.test_duration,
            scale: this.subject_scale,
            total_question: this.total_question,
            _caller : 'insert'
        };

        $http.post('subject_management.php', newSubject).success(function(data){

            if(data.success){
                this.subjects.push(newSubject);

                // this.resetFormFields(); //not working
                // messageSuccess();


                this.message.success = true;
                this.message.text = "Successfully Added !";

                //working

                this.subject_name = '';
                this.subject_scale = '';
                this.test_duration = '';
                this.total_question = '';

            }else{
                scope.message.error = true;
                scope.message.text = "Sorry, Something went wrong !";

            }


        }).error(function(err){

            console.log(err);
        });


    };

    this.editSubject = function($index){

        this.showEditForm = true;
        this.updateIndex = $index;

        this.subject_name = this.subjects[$index].title;
        this.test_duration = this.subjects[$index].test_duration;
        this.subject_scale = this.subjects[$index].scale;
        this.total_question = this.subjects[$index].total_question;

    };


    this.updateSubject = function($index){

        this.subjects[$index] = {

            name: this.subject_name,
            test_duration: this.test_duration,
            scale: this.subject_scale,
            total_question: this.total_question

        };

        this.showEditForm = false;
       // this.messageError();

        this.message.success = true;
        this.message.text = "Successfully updated !";

       // this.resetFormFields();  // not working

       //working

        this.subject_name = '';
        this.subject_scale = '';
        this.test_duration = '';
        this.total_question = '';


    };



    this.deleteSubject = function($index){

        /*

        var deleteSubject = {
            id: $index,
            _caller: 'delete'
        }

        $http.post('subject_management.php', deleteSubject).success(function(data){

        }).error(function(err){

        });
        */

        this.subjects.splice($index, 1);
    };

    var $this = this;
    this.resetFromFields = function(){

        $this.subject_name = '';
        $this.subject_scale = '';
        $this.test_duration = '';
        $this.total_question = '';

    };




    /* Questions */



    this.questions = [
        {
            subject_id: 1, // will retrive the questions using the subject id later on
            question_id: 1,
            title: "What Does SDLC Mean"
        },
        {
            subject_id: 1,
            question_id: 1,
            title: "How much steps are there in a SDLC"
        },
        {
            subject_id: 1,
            question_id: 1,
            title: "What is the largest step in SDLC"
        },
        {
            subject_id: 1,
            question_id: 1,
            title: "What is the most important step in SDLC"
        }

    ];

    this.addQuestion = function(){

        this.questions.push({
            subject_id: 1,
            question_id: 1,
            title: this.question_title
        });

        this.question_title = '';

        this.message.success = true;
        this.message.text = "Successfully Added !";

       // messageSuccess();

    };

    this.editQuestion = function($index){

        this.questionIndex = $index;
        this.showEditForm = true;
        this.question_title = this.questions[$index].title;

    };

    this.updateQuestion = function($index){

        this.questions[$index] = {
            subject_id: this.questions[$index].subject_id,
            question_id: this.questions[$index].question_id,
            title: this.question_title

        };

        this.showEditForm = false;
        this.question_title = '';

        this.message.success = true;
        this.message.text = "Successfully Updated !";

        // messageSuccess();

    };

    this.deleteQuestion = function($index){

        this.questions.splice($index, 1);

    };









}]);





app.config(function($routeProvider){

    $routeProvider.when('/register', {
        templateUrl: 'registration-from.html'
    });

});