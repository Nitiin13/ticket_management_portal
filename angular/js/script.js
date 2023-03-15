
var app=angular.module("myApp", ["ui.router","ServiceModule"]);
app.run(function ($rootScope,$timeout) {
    $rootScope.$on('$viewContentLoaded', ()=> {
      $timeout(() => {
        componentHandler.upgradeAllRegistered();
        console.log('upgraded');
      })
    })
  });
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
        templateUrl:'angular/templates/signup.html',
        controller:'signupController'
    }).state('Ticket',{
        url:'/tickets',
        templateUrl:'angular/templates/ticket.html',
        // controller:'ticketController'
    }).state('logout',{
        url:'/home',
        templateUrl:'angular/templates/login.html',
        // controller:'logoutController'
    }).state('forgotpassword',{
        url:'/forgotpassword',
        templateUrl:'angular/templates/forgotpassword.html',
        controller:'forgotPasswordController'
    }).state('otp',{
        url:'/otp',
        params: {
            email:null
        },
        templateUrl:'angular/templates/otp.html',
        controller:'otpController'
    }).state('resetpassword',{
        url:'/resetpassword',
        params: {
            email:null
        },
        templateUrl:'angular/templates/resetpassword.html',
        controller:'resetpasswordController'
    }).state('test',{
        url:'/test',
        templateUrl:'angular/templates/test.html',
        controller:'testController'
    })
});
app.controller('testController',function($scope){
    
var snackbarContainer = document.getElementById('demo-snackbar-example');
var showSnackbarButton = document.getElementById('demo-show-snackbar');
console.log(showSnackbarButton);
var handler = function(event) {
showSnackbarButton.style.backgroundColor = '';
};
showSnackbarButton.addEventListener('click', function() {
showSnackbarButton.style.backgroundColor = '#' +
    Math.floor(Math.random() * 0xFFFFFF).toString(16);
var data = {
    message: 'Button color changed.',
    timeout: 2000,
    actionHandler: handler,
    actionText: 'Undo'
};
snackbarContainer.MaterialSnackbar.showSnackbar(data);
});

});
app.controller('signupController',function($scope,serviceApi){
    $scope.password = null;
    $scope.re_password = null;
    $scope.name = null;
    $scope.email = null;
    
    $scope.submitUserDetails = function(){
        if($scope.email!=null && $scope.name!=null && $scope.password!=null && $scope.re_password!=null){ 
            if($scope.password==$scope.re_password){
                var datap  = {
                    'name':$scope.name,
                    'email':$scope.email,
                    'password':$scope.password
                }
                var postData = 'myData='+JSON.stringify(datap);
                serviceApi.signup(postData).then(function(response){
                    if((response.data.success==1))
                    {
                        console.log(response.data);
                        alert('Sign Up Successful');
                        $scope.password = null;
                        $scope.re_password = null;
                        $scope.name = null;
                        $scope.email = null;
                    }
                    else
                    {
                        $scope.email_error=true;
                        $scope.email = null;
                    }
                },function(response){});
            }
            else{
                $scope.match_error=true;
                $scope.password = null;
                $scope.re_password = null;
            }
        }
    }
    $scope.show_password = function(){
        let input = document.getElementById('pass');
        let icon=document.getElementById('password_icon');
            if ( input.type === "password") {
                input.type = "text"
                icon.innerHTML="visibility_on"
            } else {
                input.type = "password"
                icon.innerHTML="visibility_off"
            }   
    }
    $scope.show_conf_password = function(){
        let input = document.getElementById('pass_conf');
        let icon=document.getElementById('password_icon_conf');
            if ( input.type === "password") {
                input.type = "text"
                icon.innerHTML="visibility_on"
            } else {
                input.type = "password"
                icon.innerHTML="visibility_off"
            }   
    }

});
app.controller('forgotPasswordController',function($scope,$http,$state,serviceApi){
    $scope.email = null;
    $scope.captcha = null;
    function GenerateCaptcha() {  
        var chr1 = Math.ceil(Math.random() * 10) + '';  
        var chr2 = Math.ceil(Math.random() * 10) + '';  
        var chr3 = Math.ceil(Math.random() * 10) + '';  

        var str = new Array(3).join().replace(/(.|$)/g, function () { return ((Math.random() * 36) | 0).toString(36)[Math.random() < .5 ? "toString" : "toUpperCase"](); });  
        var captchaCode = str + chr1 + chr2 + chr3;    
        return captchaCode;
    }
    function ValidateCaptcha(genrated_captcha,entered_captcha) {  
        entered_captcha = removeSpaces(entered_captcha);  

        if (genrated_captcha == entered_captcha) return true;  
        return false;  
    }  
    /* Remove spaces from Captcha Code */  
    function removeSpaces(string) {  
        return string.split(' ').join('');  
    } 
    $scope.gen_captcha = GenerateCaptcha();

    $scope.submitDetails = function(){
        if($scope.email!=null && $scope.captcha!=null && $scope.email!='' && $scope.captcha!=''){
            var captcha_status = ValidateCaptcha($scope.gen_captcha,$scope.captcha);
            if(captcha_status){
                console.log("Passed captcha");
                var datap  = {
                    'email':$scope.email
                }
                var postData = 'myData='+JSON.stringify(datap);
                serviceApi.otp(postData).then(function(response){
                    console.log(response.data);
                        if(response.data.success==1){

                            $state.go('otp',datap);
                            // location.replace("auth/which_email");
                        }
                        else{
                            alert("Email does not exist");
                            console.log(response.data);
                        }
                },function(response){});
            }
            else{
                console.log("Failed captcha");
            }
        }
    }
});
app.controller('otpController',function($scope,$http,$rootScope,$stateParams,$window,serviceApi,$state) {
    $scope.show_error=false;
    if($stateParams.email==null){
        $scope.email = $window.user_email;
    }
    else{
        $scope.email = $stateParams.email;
    }
    $scope.display_email='';
    let t=0;
    for (let i = 0; i < $scope.email.length; i++) {
        if($scope.email[i]=='@'){
            t=1;
        }
        if(i>2 && t==0){
            $scope.display_email=$scope.display_email + '*';
        }
        else{
            $scope.display_email=$scope.display_email +$scope.email[i];
        }
        
    }
    $scope.otp = null;
    $scope.submitotp = function(){
        if($scope.otp!=null && ($scope.email!=null)){
            
            var datap  = {
                'email':$scope.email,
                'otp':$scope.otp
            }
            
            var postData = 'myData='+JSON.stringify(datap);
            $http(
                {
                    method: 'POST',
                    url : 'auth/check_otp',
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                    data: postData
                }
                )
                .then(function(response) {
                    console.log(response.data);
                    if(response.data.success==1){
                        $rootScope.email = $scope.email;
                        $state.go('resetpassword',{'email':$scope.email});
                    }
                    else{
                        $scope.show_error=true;
                        $scope.otp=null;
                        var element = document.getElementById("e_otp");
                        element.classList.add('is-invalid');
                    }
                });
        }
    }
    $scope.resend = function(){
        if($scope.email!=null){
            var datap  = {
                'email':$scope.email
            }
            var postData = 'myData='+JSON.stringify(datap);
            serviceApi.otp(postData).then(function(response){
                console.log(response.data);
                    if(response.data.success==1){
                        var snackbarContainer = document.querySelector('#demo-toast-example');
                        var data = {message: 'OTP Sent Successfully'};
                        snackbarContainer.MaterialSnackbar.showSnackbar(data);
                    }
                    else{
                        var snackbarContainer = document.querySelector('#demo-toast-example');
                        var data = {message: 'Email Does Not Exists'};
                        snackbarContainer.MaterialSnackbar.showSnackbar(data);
                    }
            },function(response){});

        }
    }
});
app.controller('resetpasswordController', function($scope,$stateParams,$window,serviceApi){
    if($stateParams.email==null){
        $scope.email = $window.user_email;
    }
    else{
        $scope.email = $stateParams.email;
    }
    console.log($scope.email);
    $scope.new_pass = null;
    $scope.conf_pass = null;
    $scope.resetpassword = function(){

        if(($scope.new_pass!=null && $scope.conf_pass!=null &&($scope.new_pass==$scope.conf_pass) ))
        {
    
            var datap  = {
                'password':$scope.new_pass,
                'email':$scope.email
            }
            var postData = 'myData='+JSON.stringify(datap);
            serviceApi.resetpassword(postData).then(function(response){
                console.log(response.data);
                    if(response.data.success==1){
                        console.log('Password Reset Successfull');
                        // location.replace("auth/which_email");
                    }
                    else{
                        alert("Unsuccessfull");
                        console.log(response.data);
                    }
            },function(response){});
        }
        else
        {
            $scope.match_error = true;
            $scope.new_pass = null;
            $scope.conf_pass = null;

        }
    }
});