var app = angular.module('MyApp', ["ngCookies", "ngRoute", "ngMessages"]);


/******************************************************/
/*	Custom Factory Provider */
/******************************************************/


app.factory('examListsFactory', ["$cookies","$http", "$q", function ($cookies, $http, $q) {

    return function () {

        var defObj = $q.defer();

        var loggedInUser = {};

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

            setCookieData: function(username, userId, isAdmin) {
                userName = username;
                $cookies.put("userName", username);
                $cookies.put("userId", userId);
                $cookies.put("isAdmin", isAdmin);
            },
            getCookieData: function() {
                loggedInUser = {
                    userName: $cookies.get("userName"),
                    userId: $cookies.get("userId"),
                    isAdmin: $cookies.get("isAdmin")
                };
                return loggedInUser;
            },
            clearCookieData: function() {
                var userName = "";
                var userId = "";
                var isAdmin = "";
                $cookies.remove("userName");
                $cookies.remove("userId");
                $cookies.remove("isAdmin");
            },

            isLoggedIn: false,
            isAdmin: false,
            isUser: false,
            isRegisterSuccess: false,


        loggedInUser: {
                username: '',
                userId: 0
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





app.controller('LoginRegisterController', ["$rootScope", "$scope","$http","$location","examListsFactory", function($rootScope, $scope, $http, $location, examListsFactory){


    $rootScope.loggedInUser = {};

    $scope.loginFailed = false;
    $scope.isRegisterSuccess = examListsFactory.isRegisterSuccess;

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
                examListsFactory().loggedInUser.userId = data.data.id


                // or rootScope approach

                $rootScope.isLoggedIn = true;
                $rootScope.loggedInUser.username = data.data.name;
                $rootScope.loggedInUser.userId = data.data.id;

                console.log($rootScope.loggedInUser.userId);

                // lets set it in the cookie

                var isAdmin = false;

                if(data.data.role.toLowerCase() == 'admin'){
                    isAdmin = true;
                }

                examListsFactory().setCookieData(data.data.name, data.data.id, isAdmin);


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

    $scope.logout = function(){

        examListsFactory().clearCookieData();
        examListsFactory().isLoggedIn = false;

    };


    $scope.register = function(){
        var user_data = {
            _caller: 'insert',
            username: $scope.user.name,
            password: $scope.user.password,
            email: $scope.user.email,
            phone: $scope.user.phone
        };
        console.log("From Register function");
        console.log(user_data);

        $http.post('admin/authenticate_user.php', user_data).success(function(data){


            console.log(data);

            if(data.success){

                examListsFactory.isRegisterSuccess = true;
                $location.path('login');

            }else{

               // $scope.loginFailed = true;
            }
        }).error(function(err){
            console.log(err);
        });


    }



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

        $scope.question = '';

       // var defObj = $q.defer();
        $http.post('admin/answer_management.php', data).success(function(data){

                  $scope.questionObj = data;
                  $scope.question = data[0].title;
         //       defObj.resolve({ data: data });

           // $scope.questionObj = defObj.promise;
            console.log($scope.questionObj);

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
                    // check if it is the first answer option, that was blank earlier
                    if(!$scope.questionObj[0] || !$scope.questionObj[0].details){
                        $scope.questionObj[0] = answerObj;

                        //details = answerObj.details;
                        //$scope.questionObj[0].question_id = answerObj.question_id;
                        //$scope.questionObj[0].id = answerObj.id;
                    }else{
                        $scope.questionObj.push(answerObj);
                    }

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
/*	Exam Controller */
/******************************************************/

app.controller('examController', ["$rootScope", "$scope", "$http", "$q", "$routeParams", "examListsFactory", "$filter", "$timeout", "$location",
    function($rootScope, $scope, $http, $q, $routeParams, examListsFactory, $filter, $timeout, $location){

        //console.log(examListsFactory().loggedInUser.userId);
        //console.log($rootScope.loggedInUser);

        $scope.subjectId = $routeParams.subjectId;
        $scope.testData = {
            testId: 0,
            score: 0,
            total_correct_answer: 0,
            total_wrong_answer: 0,
            user_id: 0
        };



        var subjectLists = examListsFactory().defObj;
        $scope.subjects = subjectLists.then(function (output) {
            $scope.subject = $filter('filterById')(output.subjects, $scope.subjectId);
        });


        $scope.questionsList = '';
        $scope.question_answer_options = [];
        $scope.answers = [];
        var exam_questions = [];
        var q_ids = [];

      /*  var questionAnswer = [
            [
                {
                    "id": "1",
                    "subject_id": "30",
                    "title": "What does SDLC mean",
                    "created_at": "2016-11-05 00:00:00",
                    "updated_at": "2016-11-06 10:05:08",
                    "question_id": "1",
                    "details": "Software Development Life Cycle",
                    "correct": "1"
                },
                {
                    "id": "2",
                    "subject_id": "30",
                    "title": "What does SDLC mean",
                    "created_at": "2016-11-06 00:00:00",
                    "updated_at": "2016-11-06 10:18:03",
                    "question_id": "1",
                    "details": "System Development Life Cycle",
                    "correct": "0"
                },
                {
                    "id": "3",
                    "subject_id": "30",
                    "title": "What does SDLC mean",
                    "created_at": "2016-11-06 04:43:53",
                    "updated_at": "2016-11-06 10:43:53",
                    "question_id": "1",
                    "details": "System Design Life Cycle",
                    "correct": "0"
                },
                {
                    "id": "14",
                    "subject_id": "30",
                    "title": "What does SDLC mean",
                    "created_at": "2016-11-12 14:45:44",
                    "updated_at": "2016-11-12 15:59:22",
                    "question_id": "1",
                    "details": "Software Design Life Cycledfasdfas",
                    "correct": "0"
                },
                {
                    "id": "23",
                    "subject_id": "30",
                    "title": "What does SDLC mean",
                    "created_at": "2016-11-12 15:33:38",
                    "updated_at": "2016-11-12 16:01:19",
                    "question_id": "1",
                    "details": "Software Design Life Cycle",
                    "correct": "1"
                }
            ],
            [
                {
                    "id": "30",
                    "subject_id": "30",
                    "title": "What is software",
                    "created_at": "2016-11-13 03:30:18",
                    "updated_at": "2016-11-13 09:30:18",
                    "question_id": "2",
                    "details": "Software Design Life Cycle",
                    "correct": "1"
                },
                {
                    "id": "31",
                    "subject_id": "30",
                    "title": "What is software",
                    "created_at": "2016-11-13 03:30:21",
                    "updated_at": "2016-11-16 04:45:36",
                    "question_id": "2",
                    "details": "Software Design Life Cycle",
                    "correct": "0"
                },
                {
                    "id": "32",
                    "subject_id": "30",
                    "title": "What is software",
                    "created_at": "2016-11-13 03:30:22",
                    "updated_at": "2016-11-16 04:45:27",
                    "question_id": "2",
                    "details": "Software Design Life Cycle",
                    "correct": "0"
                },
                {
                    "id": "33",
                    "subject_id": "30",
                    "title": "What is software",
                    "created_at": "2016-11-13 03:30:22",
                    "updated_at": "2016-11-16 04:45:21",
                    "question_id": "2",
                    "details": "Software Design Life Cycle",
                    "correct": "0"
                }
            ]
        ];
*/


        var startTest = function(){

            console.log(examListsFactory().getCookieData().userId);
            console.log('startTest Fired : ' +(new Date()).getMilliseconds());

            var testData = {
                user_id: examListsFactory().getCookieData().userId,
                subject_id: $routeParams.subjectId,
                score:0,
                _caller: 'insert'
            };

            $http.post('examinee/exam_management.php', testData).success(function(data){

                if(data.success){
                    $scope.testData.testId = data.id;
                    console.log(data.success);

                }

               // console.log(data);

            }).error(function(err){
                console.log(err);
            });

        };

         if($scope.testData.testId === 0){
//             startTest();
         }

        var current_index = 0;
        $scope.time_count = 1;


        var showTimeCount = function(){


            $scope.time_count =  $scope.time_count+1;

           var promise =  $timeout(showTimeCount, 1000);

            if($scope.time_count == 60){

                $timeout.cancel(promise);
                $scope.time_count = 0;
            }


        };

        var showQuestion = function(){

            if(current_index < questionAnswer.length){

                $scope.current_question = questionAnswer[current_index];
                $scope.question = $scope.current_question[0].title;


                $scope.promise = $timeout(showQuestion,  1000*60);

                showTimeCount();

               // console.log($scope.question);
              current_index = current_index + 1;


                //if(current_index == questionAnswer.length){

                   // $timeout.cancel(promise);
                   // showQuestion(); // to fire the else statement


                //}


            }else{

                // if the last question has already shown
                $timeout.cancel($scope.promise);
                $location.path('/dashboard/my-result');

            }
        };




        $http.post('admin/question_management.php', {subject_id:$scope.subjectId}).success(function(data){

            $scope.questionsList = data;


            angular.forEach($scope.questionsList, function(value, key){

                   // $scope.exam_question_id = value.id;
                q_ids.push(value.id);


                    $http.post('admin/answer_management', { question_id: value.id }).success(function(questionWithAnswer){

                        exam_questions.push(questionWithAnswer);
                        $scope.exam_question = value.title;
                        $scope.question_answer_options.push(questionWithAnswer);

                         console.log($scope.exam_question);
                        // console.log(exam_questions);
                        // console.log(questionWithAnswer);





                    }).error(function(err){
                        console.log(err);
                    });

//                    console.log(i);

 //                   $scope.current_question = $scope.questions[0];
 //                   $scope.question = $scope.current_question[0].title;

 //                   i = ++i;


                   // $timeout(displayQuestion, 5000);

               // displayQuestion();
                // $timeout(displayQuestion, 500);






              //  console.log(key + ' : ' + value.id);

/*
                var question_answer_option = $scope.question_answer_options;


                var i = 0;


                $scope.displayQuestion = function(question_answer_option , i ){

                    $scope.exam_question = question_answer_option[i][0].title;

                    angular.forEach(question_answer_option, function(value, index){

                        $scope.answers.push(value.details);

                    });

                    console.log($scope.exam_question);


                };

                $scope.displayQuestion(question_answer_option, i);

*/
               // var displayQuestion = $scope.displayQuestion(question_answer_option, i);

              //  setTimeout($scope.displayQuestion(question_answer_option, i), 200);

               // function()

/*
                angular.forEach($scope.questions, function(value, index){

                    var answer_details = [];

                    setTimeout(function(){
                        var question = value[0].title;

                        angular.forEach(question, function(answer, ansIndex){

                            answer_details.push({details: answer.details});

                        });

                        $scope.exam_answer_option = answer_details;
                        $scope.exam_question = question;
                        console.log($scope.exam_question);

                    }, 60*1000);

                });

*/








            }, $scope.exam_questions);

            //console.log($scope.questionsList);
            //console.log(exam_questions);


        }).error(function(err){

        });



        $scope.questions = exam_questions;
        var questionAnswer = $scope.question_answer_options;
        //console.log($scope.question_answer_options);


        $timeout(showQuestion, 1200);

        $scope.reply = {
            givenAnswer: 0
        };

        $scope.answered = function(){


            $scope.testData._caller = 'update';

            if($scope.reply.givenAnswer == 1){
                $scope.testData.total_correct_answer = $scope.testData.total_correct_answer+1;
               // $scope.testData.score =  $scope.testData.score+1;

            }else{
                $scope.testData.total_wrong_answer = $scope.testData.total_wrong_answer+1;

            }

            $http.post('examinee/exam_management.php', $scope.testData).success(function(data){

                showQuestion();

             //   console.log(data);

            }).error(function(err){
               console.log(err);

            });

            console.log($scope.reply.givenAnswer);

        };









//console.log($scope.questions);

/*
        $scope.current_question = '';

        var i = 0;

       var displayQuestion = function(){

           console.log(i);

           $scope.current_question = $scope.questions[0];
           $scope.question = $scope.current_question[0].title;

           i = ++i;


           $timeout(displayQuestion, 5000);


       };

       displayQuestion();
      // $timeout(displayQuestion, 500);

*/



        }]);


    app.controller('resultController', ["$rootScope", "$scope", "$http", "examListsFactory", "$q",
        function($rootScope, $scope, $http, examListsFactory, $q){

            // will get the results list from database
            $scope.results = [];

           // var defObj = $q.defer();

        $http.post('examinee/my_results.php', {_caller: 'get_results', user_id: examListsFactory().getCookieData().userId})
            .success(function(data){


                console.log(data);

                $scope.results = data;
                /*

                if(data.length > 0){
                    $scope.results = data;
                }

                defObj.resolve({
                    data:data
                });

                */



                //var subjectLists = examListsFactory().defObj;
                //$scope.subjects = subjectLists.then(function (output) {
                //    $scope.subject = $filter('filterById')(output.subjects, subjectId);
                //});

        }).error(function(err){
           console.log(err);
        });

    }]);

app.controller('sidebarController', ["$scope", "examListsFactory",
    function($scope, examListsFactory){

        $scope.username =  examListsFactory().getCookieData().userName;  //examListsFactory().getCookieData().userName;

        console.log(examListsFactory().getCookieData().userName);
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
    }).when('/dashboard/my-test', {
            templateUrl: 'examinee/available-tests.html',
        controller: 'subjectArea'
    }).when('/dashboard/:subjectId/exam', {
        templateUrl: 'examinee/exam.html',
        controller: 'examController'
    }).when('/dashboard/my-result', {
        templateUrl: 'examinee/my-results.html',
        controller: 'resultController'
    }).when('/dashboard/edit-profile', {
        templateUrl: 'admin/edit-profile.html',
        controller: 'examController'
    }).when('/admin/manage-user', {
        templateUrl: 'admin/manage-user.html',
        controller: 'examController'
    });

});


