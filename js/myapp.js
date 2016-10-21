var app = angular.module('MyApp', ["ngRoute", "ngMessages"]);

/*
app.controller('loginRegisterController', ["$scope", function($scope){

    $scope.logIn = function(){

        


    };



}]);
*/

app.controller('subjectArea',["$scope","$http", "$q", function($scope, $http, $q){

    $scope.showEditForm = false;
    $scope.message = {
        success: false,
        error: false,
        text: ''
    };


    /******************************************************/
    /*	SOME HELPER FUNCTION  */
    /******************************************************/


    $scope.resetFormFields = function(){

        $scope.subject_name = '';
        $scope.subject_scale = '';
        $scope.test_duration = '';
        $scope.total_question = '';

    };

    $scope.messageSuccess = function(successMessage){
        $scope.message.success = true;
        $scope.message.text = successMessage;
    };

    $scope.messageError = function(){
        $scope.message.error = true;
        $scope.message.text = 'Sorry, Error Occurred !';

    };


    // initial values, works when there is no record set in the database

    $scope.subjects = [
        {
            title: "Software Engineering",
            test_duration: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        },
        {
            title: "Neural Network",
            test_duration: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        }
    ];


    // will get the subject from database

    var defObj = $q.defer();

    $http.get('subject_management.php').success(function(data){

        if(data.length > 0){
            $scope.subjects = data;
        }

        defObj.resolve({
           data:data
        });


    }).error(function(error){
        console.log(error);
    });

//    console.log(defObj.promise);



    /* Subjects functions */

    $scope.abc = function(){
        console.log('abc called');
    }

    $scope.addSubject = function(){

        //push to the database first
        var newSubject = {
            title: $scope.subject_name,
            test_duration: $scope.test_duration,
            scale: $scope.subject_scale,
            total_question: $scope.total_question,
            _caller : 'insert'
        };

        $http.post('subject_management.php', newSubject).success(function(data){

            if(data.success){
                $scope.subjects.push(newSubject);
                $scope.resetFormFields();
                $scope.messageSuccess('Successfully Added !');
            }else{
                $scope.messageError();
            }

        }).error(function(err){

            console.log(err);

        });

    };

    $scope.editSubject = function($index){

        $scope.showEditForm = true;
        $scope.updateIndex = $index;
        $scope.subject_name = $scope.subjects[$index].title;
        $scope.test_duration = $scope.subjects[$index].test_duration;
        $scope.subject_scale = $scope.subjects[$index].scale;
        $scope.total_question = $scope.subjects[$index].total_question;

    };


    $scope.updateSubject = function($index){

        var subject = {
            id: $scope.subjects[$index].id,
            title: $scope.subject_name,
            test_duration: $scope.test_duration,
            scale: $scope.subject_scale,
            total_question: $scope.total_question,
            _caller: 'update'

        };

        $http.post('subject_management.php', subject ).success(function(data){

            if(data.success){

                $scope.subjects[$index] = subject;

                $scope.showEditForm = false;
                $scope.messageSuccess('Successfully Updated !');
                $scope.resetFormFields();

            }else{

                $scope.showEditForm = false;
                $scope.resetFormFields();
                $scope.messageError();

            }

        }).error(function(err){

        });

    };



    $scope.deleteSubject = function($index){

        var deleteSubject = {
            id: $scope.subjects[$index].id,
            _caller: 'delete'
        }

        console.log($scope.subjects[$index].id);

        $http.post('subject_management.php', deleteSubject).success(function(data){

            if(data.success){

                $scope.subjects.splice($index, 1);
              //  $scope.message.success = true;
              //  $scope.message.text = "Successfully Deleted !";

                $scope.messageSuccess('Successfully Deleted !');

            }else{
                $scope.messageError();
            }

        }).error(function(err){
            console.log(err);

        });

    };



    /* Questions */



    $scope.questions = [
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

    $scope.addQuestion = function(){

        $scope.questions.push({
            subject_id: 1,
            question_id: 1,
            title: $scope.question_title
        });

        $scope.question_title = '';

        $scope.message.success = true;
        $scope.message.text = "Successfully Added !";

       // messageSuccess();

    };

    $scope.editQuestion = function($index){

        $scope.questionIndex = $index;
        $scope.showEditForm = true;
        $scope.question_title = $scope.questions[$index].title;

    };

    $scope.updateQuestion = function($index){

        $scope.questions[$index] = {
            subject_id: $scope.questions[$index].subject_id,
            question_id: $scope.questions[$index].question_id,
            title: $scope.question_title

        };

        $scope.showEditForm = false;
        $scope.question_title = '';

        $scope.message.success = true;
        $scope.message.text = "Successfully Updated !";

        // messageSuccess();

    };

    $scope.deleteQuestion = function($index){

        $scope.questions.splice($index, 1);

    };









}]);





app.config(function($routeProvider){

    $routeProvider.when('/register', {
        templateUrl: 'registration-from.html'
    });

});