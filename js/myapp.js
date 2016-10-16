var app = angular.module('MyApp', ["ngRoute"]);

/*
app.controller('loginRegisterController', ["$scope", function($scope){

    $scope.logIn = function(){

        


    };



}]);
*/

app.controller('subjectArea', function(){

    this.subjects = [
        {
            name: "Software Engineering",
            test_time: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        },
        {
            name: "Nural Network",
            test_time: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        },
        {
            name: "System Analysis & Design",
            test_time: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        },
        {
            name: "Data Structure & Algorithm",
            test_time: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        },
        {
            name: "Java Programming",
            test_time: "40min Max",
            scale: "4.00",
            total_question: "20MCQ"
        },

    ];


    this.addSubject = function(){

        //console.log(this.subject_name);

        this.subjects.push({
            name: this.subject_name,
            test_time: this.test_time,
            scale: this.subject_scale,
            total_question: this.total_question
        });

        this.subject_name = '';
        this.subject_scale = '';
        this.test_time = '';
        this.total_question = '';

    };

    this.editSubject = function($index){

        this.subject_name = this.subjects[$index].name;
        this.test_time = this.subjects[$index].test_time;
        this.subject_scale = this.subjects[$index].scale;
        this.total_question = this.subjects[$index].total_question;

    };

    this.deleteSubject = function($index){

        this.subjects.splice($index, 1);
    };

});

app.config(function($routeProvider){

    $routeProvider.when('/register', {
        templateUrl: 'registration-from.html'
    });

});