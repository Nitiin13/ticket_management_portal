var app=angular.module("myApp", ["ui.router","ServiceModule","angularFileUpload"]);
app.directive("ckeditor", [function(){
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            CKEDITOR.replace(elem[0], {
                autoParagraph:false,
                
                // configuration
            });
        }
    }
}]);
app.run(function ($rootScope,$timeout,$window) {
    $rootScope.session=$window.session;
                    // $rootScope.isLoggedIn=null;
                    $rootScope.userid=$window.userid;
                    $rootScope.role=$window.user_role;
                    $rootScope.loggedname=$window.user_name;
                    $rootScope.loggedemail=$window.user_email;
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
    }).state('NewTicket',{
        url:'/newticket',
        templateUrl:'angular/templates/newTicket.html',
        controller:'newticketController'
    }

    ).state('Ticket',{
        url:'/ticket/:userid',
        templateUrl:'angular/templates/dashboard_view.html',
        controller:'ticketController',
        resolve:{
          
           tickets: ['$stateParams', 'serviceApi', function ($stateParams, serviceApi)  {
                // $stateParams will contain any parameter defined in your url
                console.log($stateParams.userid);
               
                 var data1={
                    'userid':$stateParams.userid
                 }
                 var postData2 = 'myData1='+JSON.stringify(data1);
                 console.log(postData2);
                //  console.log($stateParams.userid);
           
      
            return serviceApi.getTickets(postData2);
               
               
        }]}
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
        $scope.email = $window.mini_user_email;
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
        $scope.email = $window.mini_user_email;
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
app.controller('logoutController',function($scope,serviceApi,$rootScope,$state,$window)
{
    
    $scope.logout=function(){
        serviceApi.logout().then(function(response){

            if(response.data==1)
            {
                console.log('loggedout');
                $window.session='0';
                $rootScope.session=$window.session;
                
                // $rootScope.isLoggedIn=null;
               $rootScope.userid=null;
                $state.go('Home');
            }
            
        },function(response){

            return false;
        })
    }


    
});
app.controller('loginController',function($scope,serviceApi,$rootScope,$window,$state){

// if(($rootScope.session!='0' && $rootScope.session!=undefined && $rootScope.session!=null)|| ($rootScope.isLoggedIn!=null && $rootScope.isLoggedIn!=undefined))
if($rootScope.session!='0' && $rootScope.session!=undefined && $rootScope.session!=null)
{
    $rootScope.userid=$window.userid;
    // $rootScope.role=$window.user_role;
    a2=$rootScope.userid;
   
    if($rootScope.role!='0')
    {
        $rootScope.admin=true;

    }
    else{
        $rootScope.admin=false;
    }
    var a1={
        'userid': $rootScope.userid
    }
    $state.go('Ticket',a1);
}
else{
    // $rootScope.session='0';
    // $rootScope.isLoggedIn = null;
    $scope.present=false;
    $scope.req_error=false;
    $scope.rememberme=false;
    $scope.authenticateUser=function(){
        
        console.log("Authentication");
        if($scope.email==null||$scope.email=='')
        {
            $scope.req_error=true;
        }
        else if($scope.pass==null||$scope.pass==''){
            $scope.req_error=true;
        }
        else{
            
            var userdata={
            'email':$scope.email,
            'pass':$scope.pass,
            'rememberme':$scope.rememberme
            }
            console.log(userdata);
            var postData = 'myData='+JSON.stringify(userdata);
            console.log(postData);
            serviceApi.checkLogin(postData).then(function(response){
              
                if(response.data['error']!=true)
                {
                    user_info=response.data;
                    $rootScope.session='1';
                    // $rootScope.isLoggedIn=true;
                    $rootScope.userid=user_info['user_id'];
                    $rootScope.role=user_info['role'];
                    $rootScope.loggedemail=user_info['email'];
                    $rootScope.loggedname=user_info['name'];
                   var a={
                    'userid':$rootScope.userid
                   }
                   console.log(a);
                    $state.go('Ticket',a);
                
                }
                else if(response.data['error']==true)
                {
                    $scope.req_error=false;
                    $scope.present=true;
                    $scope.pass='';
                }
                else{
                    $scope.present=true;
                }
            },function(response){});
        }
    }
    $scope.viewDetails=function(){
          let input = document.getElementById('pass');
          let icon=document.getElementById('icon');
              if ( input.type === "password") {
                  input.type = "text"
                 icon.innerHTML="visibility_off"
              } else {
                  input.type = "password"
                  icon.innerHTML="visibility"
              }
         
        
              }

}});
app.controller("ticketController",function($scope,tickets,$rootScope,$state,$window,serviceApi){
   
    // if($rootScope.session!='0' || $rootScope.isLoggedIn!=null)
    if($rootScope.session!='0')
    {
        $scope.navigate=function(){
            $state.go('NewTicket');
        }
        console.log('logged in');

      console.log($rootScope.role);
     
      if($rootScope.role!="0"){
        $rootScope.admin=true;
      }
      else{
        $rootScope.admin=false;
      }
        $scope.tickets=tickets.data;
       
        $scope.items = [
            { id: 0, name: 'to be reviewed' },
            { id: 1, name: 'In progress' },
            { id: 2, name: 'on hold' },
            {id:3,name:'resolved'},
            {id:4,name:'dropped'},
            {id:5,name:'resolved and closed'}
          ];
          $scope.status=[{
            id:0,name:'Open Tickets'
          },
        {
            id:1,name:'Closed Tickets'
        }];
        $scope.sort=[{
            id:0,name:'New Tickets'
          },
        {
            id:1,name:'Last Updated'
        }];
        $scope.Sglchk=false;
        $scope.delupdate=false;
        $scope.lst = [];
        $scope.getChecked = function(check,value){
            if(check){
                $scope.lst.push(value);
            }else{
                 $scope.lst.splice($scope.lst.indexOf(value), 1);
            }
            $scope.chklength=$scope.lst.length;
            if($scope.chklength!=0)
            {
                if($scope.chklength>1)
                {
                    $scope.Sglchk=true;
                }
                else{
                    $scope.Sglchk=false;
                }
                $scope.delupdate=true;
            }
            else{
                $scope.delupdate=false;
            }

        };
          $scope.statusChanged = function(item,t_id){       
                a=item;
                    ticket=t_id;
                    var u_details={
                        'status':a,
                        'ticket':ticket
                    }
                    var update_data = 'myData2='+JSON.stringify(u_details);
                    serviceApi.update_status(update_data).then(function(response){
                        if(response.data==1)
                        {
                            alert('updated');
                        }
                    },function(response){

                    });
                }
       
    }else{
        $state.go('Home');
    }
    
    
});
app.controller("newticketController",function($scope,FileUploader,$rootScope,serviceApi,$state){
    $scope.reqerror=false;
    $scope.subject='';
$scope.accountno='';
$scope.data='';
$scope.attachments=false;
    var uploader = $scope.uploader = new FileUploader({
        url:'http://localhost/TMS/user/user_image_upload/?ticketid=',
        formData:""
    });
  
uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/, options) {
        
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1 && item.size  <= 41943040;}});
// 


uploader.onAfterAddingAll = function(addedFileItems) {
    // console.log("upload",addedFileItems);
    // console.info('onAfterAddingAll', addedFileItems);
    
    $scope.files=addedFileItems;
    if($scope.files.length>0)
    {
        $scope.attachments=true;
    }
    else{
        
        $scope.attachments=false;
    }

}


$scope.discard=function(){
    $scope.subject='';
    $scope.reqerror=false;
    uploader.clearQueue();
    CKEDITOR.instances.editor1.setData( '<p></p>');
    
}
$scope.Getforminfo=function(){
    $scope.desc=CKEDITOR.instances.editor1.getData();
    if($scope.subject!='' && $scope.desc!='')
    {
    subject=$scope.subject;
    accountno=$scope.accountno;
    description=$scope.desc;
    var formdata={
        'subject':subject,
        'accountno':accountno,
        'description':description,
        'attachments':$scope.attachments
    }
    console.log(formdata);
   
   
    
    var ticket_data = 'myData3='+JSON.stringify(formdata);
    serviceApi.addTicket(ticket_data).then(function(response){
        if(response.data['error']==false)
        {
            $scope.ticket_id=response.data['ticket_id'];
            formData={
                'ticketid':$scope.ticket_id,
            }
            uploader['formData']=JSON.stringify(formData);
            console.log(uploader);
           
        
        
        uploader.onBeforeUploadItem = function(item){
            console.log(item);
            item.url='http://localhost/TMS/user/user_image_upload/?ticketid='+$scope.ticket_id;
            
        }
       
        uploader.uploadAll();
             
        $state.go('Ticket',{'userid':$rootScope.userid});    
        
         
        
        }
        else if(response.data['error']==true){
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Failed to add ticket'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
    
    
    },function(response){
    
    });
}
else{
    $scope.reqerror=true;
uploader.clearQueue();
}
}});