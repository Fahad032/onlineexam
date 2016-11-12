var app = angular.module('MyApp', ["ngRoute", "ngMessages"]);



/******************************************************/
/*	Custom Factory Provider */
/******************************************************/


app.factory('examListsFactory', ["$http", "$q", function ($http, $q) {

    return function () {

        var defObj = $q.defer();

        $http.get('admin/subject_management.php').success(function (data) {

            defObj.resolve({
                subjects: data
            });

        }).error(function (error) {
            defObj.resolve({
                subjects: false
            });
            console.log(error);
        });

        // return defObj.promise;

        return {

            /******************************************************/
            /*	SOME HELPER FUNCTION  */
            /******************************************************/

            defObj: defObj.promise,

            message: {
                error: '',
                success: '',
                text: ''

            },

            isLoggedIn: false,
            isAdmin: false,
            isUser: false,
            
            loggedInUser: {
                username: ''
            },

            messageSuccess: function (successMessage) {
                this.message.success = true;
                this.message.text = successMessage;
                return this.message;
            },

            messageError: function () {
                this.message.error = true;
                this.message.text = 'Sorry, Error Occurred !';
                return this.message;

            }

        }

    }


}]);


app.filter('filterById', function(){
    return function(objArr, id){
        for(var i=0; i< objArr.length; i++){
            if(objArr[i].id == id){
                return objArr[i];
            }
        }
    }
});





app.controller('LoginRegisterController', ["$scope","$http","$location","examListsFactory", function($scope, $http, $location, examListsFactory){


    $scope.loginFailed = false;

    $scope.logIn = function(){

        console.log('login called');

        var data = {
            username: $scope.user.username,
            password: $scope.user.password,
            __caller: 'login'
        };
        console.log(data);

        $http.post('admin/authenticate_user.php', data).success(function(data){

            if(data.success){

                console.log(data.data.role);
                examListsFactory().isLoggedIn = true;
                examListsFactory().loggedInUser.username = data.data.name;

                if(data.data.role.toLowerCase() == 'admin'){
                     $location.path('admin/subject-management');
                    examListsFactory.isAdmin = true;
                }else{
                    $location.path('dashboard/my-test');
                    examListsFactory.isUser = true;
                }

            }else{

                $scope.loginFailed = true;
            }
           console.log(data);
           // $location.path('admin/subject-management');
        }).error(function(err){
            console.log(err);
        });

        //e.preventDefault();


    };



}]);

/******************************************************/
/*	SubjectArea Controller */
/******************************************************/

app.controller('subjectArea',["$scope","$http", "$q", "examListsFactory", function($scope, $http, $q, examListsFactory){

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

    $http.get('admin/subject_management.php').success(function(data){

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
            id: '',
            title: $scope.subject_name,
            test_duration: $scope.test_duration,
            scale: $scope.subject_scale,
            total_question: $scope.total_question,
            _caller : 'insert'
        };

        $http.post('admin/subject_management.php', newSubject).success(function(data){

            if(data.success){
                newSubject.id = data.id;
                $scope.subjects.push(newSubject);
                $scope.resetFormFields();
                $scope.message = examListsFactory().messageSuccess('Successfully Added !');
            }else{
                $scope.message = examListsFactory().messageError();
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

        $http.post('admin/subject_management.php', subject ).success(function(data){

            if(data.success){

                $scope.subjects[$index] = subject;

                $scope.showEditForm = false;
                $scope.message = examListsFactory().messageSuccess('Successfully Updated !');
                $scope.resetFormFields();
                //$scope.resetFormFields();

            }else{

                $scope.showEditForm = false;
                $scope.resetFormFields();
                $scope.message = examListsFactory().messageError();

            }

        }).error(function(err){

        });

    };



    $scope.deleteSubject = function($index){

        var deleteSubject = {
            id: $scope.subjects[$index].id,
            _caller: 'delete'
        };

        console.log($scope.subjects[$index].id);

        $http.post('admin/subject_management.php', deleteSubject).success(function(data){

            if(data.success){

                $scope.subjects.splice($index, 1);
              //  $scope.message.success = true;
              //  $scope.message.text = "Successfully Deleted !";

                $scope.message = examListsFactory().messageSuccess('Successfully Deleted !');

            }else{
                $scope.message = examListsFactory().messageError();
            }

        }).error(function(err){
            console.log(err);

        });

    };

}]);


/******************************************************/
/*	Question Operations */
/******************************************************/

app.controller('QuestionArea', ["$scope", "$http", "$q", "$routeParams", "examListsFactory", "$filter",

    function($scope, $http, $q, $routeParams, examListsFactory, $filter){


        //console.log($routeParams.subjectId);
        var subjectId = $routeParams.subjectId;

        var subjectLists = examListsFactory().defObj;
        $scope.subjects = subjectLists.then(function (output) {
            $scope.subject = $filter('filterById')(output.subjects, subjectId);
        });


        $scope.showEditForm = false;
        $scope.question_subject_id = subjectId; //30;
        $scope.questions = [];

        // get question from the database

        $http.post('admin/question_management.php', {subject_id: subjectId}).success(function (data) {

            if (data.length > 0) {

                $scope.questions = data;

            }

        }).error(function () {

        });



        $scope.addQuestion = function () {

            var questionObj = {
                id: '',
                subject_id: $scope.question_subject_id,
                title: $scope.question_title,
                _caller: 'insert'
            };

            // store in the database first

            $http.post('admin/question_management.php', questionObj).success(function (data) {

                if (data.success) {
                    questionObj.id = data.id;
                    $scope.questions.push(questionObj);
                    $scope.question_title = '';
                    $scope.message = examListsFactory().messageSuccess('Successfully Added !');

                } else {
                    $scope.message = examListsFactory.messageError();
                }

            }).error(function (err) {

            });

        };

     /* edit question */

        $scope.editQuestion = function ($index) {

            $scope.questionIndex = $index;
            $scope.showEditForm = true;
            $scope.question_title = $scope.questions[$index].title;

        };

        $scope.updateQuestion = function ($index) {

            var questionObj = {
                subject_id: subjectId,
                id: $scope.questions[$index].id,
                title: $scope.question_title,
                _caller: 'update'
            };

            $http.post('admin/question_management.php', questionObj).success(function (data) {

                if (data.success) {

                    $scope.questions[$index] = questionObj;
                    $scope.showEditForm = false;
                    $scope.question_title = '';
                    $scope.message = examListsFactory().messageSuccess("Successfully Updated !");

                } else {

                    $scope.message = examListsFactory().messageError();

                }


            }).error(function (err) {

            });


        };

        $scope.deleteQuestion = function ($index) {

            // delete the database record first

            var questionObj = {
                subject_id: subjectId,
                id: $scope.questions[$index].id,
                _caller: 'delete'
            };

            $http.post('admin/question_management.php', questionObj).success(function (data) {

                if (data.success) {
                    $scope.message = examListsFactory().messageSuccess('Successfully Deleted !');
                } else {
                    $scope.message = examListsFactory.messageError();
                }

            }).error(function (err) {

            });

            $scope.questions.splice($index, 1);
            $scope.showEditForm = false;

        };


}]);


/******************************************************/
/*	Answer Options */
/******************************************************/

app.controller("AnswerOptions", ["$scope", "$http", "$q", "$routeParams", "examListsFactory",
    function($scope, $http, $q, $routeParams, examListsFactory){

       //$scope.questionObj = {};
        var questionId = $routeParams.questionId;

        var data = {
            question_id: questionId,
        };

        $scope.questionObj = {
        };

       // var defObj = $q.defer();
        $http.post('admin/answer_management.php', data).success(function(data){

                  $scope.questionObj = data;
         //       defObj.resolve({ data: data });

           // $scope.questionObj = defObj.promise;

              }).error(function(err){

              });


        $scope.showEditForm = false;



        /* Add Answer */

        $scope.addAnswer = function(){
            var answerObj = {
                    _caller: 'insert',
                    question_id: questionId,
                    details: $scope.answer_details,
                    correct: ($scope.correct_answer === undefined) ? 0: $scope.correct_answer
            };

            $http.post('admin/answer_management.php', answerObj).success(function(data){

                if (data.success) {

                    answerObj['id'] = data.id;
                    $scope.questionObj.push(answerObj);
                    $scope.answer_details = '';
                    $scope.message = examListsFactory().messageSuccess('Successfully Added !');

                } else {
                    $scope.message = examListsFactory().messageError();
                }


            }).error(function(err){
                console.log(err);

            });


        };



        /*Edit Answer*/
        $scope.editAnswer = function(index){

            $scope.showEditForm = true;
            $scope.answerIndex = index;
            $scope.answer_details = $scope.questionObj[index].details;
            $scope.correct = $scope.questionObj[index].correct;
           // $scope.Incorrect = !$scope.questionObj[index].correct;


        };


        /* Update Answer */

        $scope.updateAnswer = function(answerIndex){

            var answerObj = {
                _caller: 'update',
                id: $scope.questionObj[answerIndex].id,
                details: $scope.answer_details,
                correct: $scope.correct
            };

            $http.post('admin/answer_management.php', answerObj).success(function(data){

                if (data.success) {

                    $scope.questionObj[answerIndex] = answerObj;
                    $scope.answer_details = '';
                    $scope.message = examListsFactory().messageSuccess('Successfully Updated !');

                } else {
                    $scope.message = examListsFactory().messageError();
                }

                $scope.showEditForm = false;

            }).error(function(err){

            });

            console.log(answerId);


        };



        /*delete answer*/

        $scope.deleteAnswer = function(answerIndex){

            var answerObj = {
                id: $scope.questionObj[answerIndex].id,
                _caller: "delete"
            };

            console.log($scope.questionObj);
            console.log(answerIndex);
            console.log(answerObj);


            $http.post('admin/answer_management.php', answerObj).success(function (data) {

                console.log(data);
                if (data.success) {
                    $scope.message = examListsFactory().messageSuccess('Successfully Deleted !');
                } else {
                    $scope.message = examListsFactory().messageError();
                }

            }).error(function (err) {

            });

            $scope.questionObj.splice(answerIndex, 1);
            $scope.showEditForm = false;
        };

        $scope.updateCorrectVal =  function(val){
            console.log(val);
            $scope.correct = val;
        }


    }]);


/******************************************************/
/*	Custom Route Definition */
/******************************************************/


app.config(function($routeProvider){

    $routeProvider.when('/', {
        templateUrl: 'partials/login-form.html',
        controller: 'LoginRegisterController',
        controllerAs: 'logCtrl'
    }).when('/login', {
        templateUrl: 'partials/login-form.html',
        controller: 'LoginRegisterController',
        controllerAs: 'logCtrl'
    }).when('/register', {
        templateUrl: 'partials/registration-from.html',
        controller: 'LoginRegisterController',
        controllerAs: 'logCtrl'
    }).when('/logout', {
        templateUrl: 'partials/login-form.html',
        controller: 'LoginRegisterController',
        controllerAs: 'logCtrl'
    }).when('/admin/subject-management', {
        templateUrl: 'admin/add-subject.html',
        controller: 'subjectArea'
    }).when('/admin/:subjectId/question-management', {
        templateUrl: 'admin/add-question.html',
        controller: 'QuestionArea'
    }).when('/admin/:questionId/answer-management', {
        templateUrl: 'admin/add-answer.html',
        controller: 'AnswerOptions'
    });

});