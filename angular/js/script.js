var app=angular.module("myApp", ["ui.router"]);
app.config(function($stateProvider, $urlRouterProvider,$urlMatcherFactoryProvider,$locationProvider)
{
    $urlRouterProvider.otherwise('Home');
    $locationProvider.html5Mode(true);
   $urlMatcherFactoryProvider.caseInsensitive(true);
    $stateProvider.state('Home',{
        url:'/home',
        templateUrl:'angular/templates/login.html',
        controller:'loginController'
    }).state('SignUp',{
        url:'/signup',
        templateUrl:'angular/templates/register.html',
        controller:'signupController'
    }).state('Ticket',{
        url:'/tickets',
        templateUrl:'angular/templates/ticket.html',
        controller:'ticketController'
    }).state('logout',{
        url:'/home',
        templateUrl:'angular/templates/login.html',
        controller:'logoutController'
    })
});
app.controller('loginController',function($scope){

});