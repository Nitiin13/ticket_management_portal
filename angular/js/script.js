var app=angular.module("myApp", ["ui.router","ServiceModule","angularFileUpload","infinite-scroll","angularModalService","zingchart-angularjs"]);
app.filter('stripTags', function() {
    return function(input) {
      if (input) {
        // Strip HTML tags using a regular expression
        return input.replace(/(<([^>]+)>)/ig,"");
      } else {
        return '';
      }
    };
});
app.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);  
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
var userid;
app.run(function ($rootScope,$timeout,$window) {
    // console.log(sessionStorage.getItem('isLoggedin'));    
    // if (localStorage.getItem('isLoggedin') === 'true') { $rootScope.isLoggedin = true; }
    // else { $rootScope.isLoggedin = false; }
        $rootScope.session=$window.session;
        // $rootScope.isLoggedIn=null;
        $rootScope.userid=$window.userid;
        $rootScope.role=$window.user_role;
        $rootScope.loggedname=$window.user_name;
        $rootScope.loggedemail=$window.user_email;
        userid==$rootScope.userid;
    $rootScope.$on('$viewContentLoaded', ()=> {
      $timeout(() => {
        componentHandler.upgradeAllRegistered(); 
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
        controller:'newticketController',
        // resolve:{
        // tags: ['serviceApi', function(serviceApi){
        //     return serviceApi.getTags();
        // }]
        // }
    })
    .state('Ticket',{
        url:'/ticket',
        templateUrl:'angular/templates/dashboard_view.html',
        controller:'ticketController',
        params: {
            userid:null,
            tickets_data:null,
            filters_to_be_applied:null
        },
        resolve:{
          
           tickets: ['$stateParams', 'serviceApi','$rootScope', function ($stateParams, serviceApi,$rootScope)  {
                // $stateParams will contain any parameter defined in your url
               
                 var data={
                    'userid':$rootScope.userid,
                    'limit':10,
                    'stream':1
                 }
           return serviceApi.getTickets(data);
        }]}

    }).state('dashboard',{
        url:'/dashboard',
        templateUrl:'angular/templates/dashboard.html',
        controller:'dashboardController',
        resolve:{
                averageRating: function($http) {
                    return $http.get('getticket/get_average_rating')
                        .then(function(response) {
                            return response.data;
                        });
                },
           dashboard_data: ['$stateParams', 'serviceApi','$rootScope', function ($stateParams, serviceApi,$rootScope)  {
           
           // result['1']=serviceApi.getLineGraphData().data;
                // $stateParams will contain any parameter defined in your url
           return serviceApi.getDashboardData();;
        }],
        line_data: ['$stateParams', 'serviceApi','$rootScope', function ($stateParams, serviceApi,$rootScope)  {
            return serviceApi.getLineGraphData();
         }],
         bar_data: ['$stateParams', 'serviceApi','$rootScope', function ($stateParams, serviceApi,$rootScope)  {
            return serviceApi.getBarGraphData();
         }]}
    })
    .state('logout',{
        url:'/home',
        templateUrl:'angular/templates/login.html',
        // controller:'logoutController'
    })
    .state('forgotpassword',{
        url:'/forgotpassword',
        templateUrl:'angular/templates/forgotpassword.html',
        controller:'forgotPasswordController'
    })
    .state('otp',{
        url:'/otp',
        params: {
            email:null,
            userid:null
        },
        templateUrl:'angular/templates/otp.html',
        controller:'otpController'
    })
    .state('resetpassword',{
        url:'/resetpassword',
        params: {
            email:null,
            userid:null
        },
        templateUrl:'angular/templates/resetpassword.html',
        controller:'resetpasswordController'
    })
    .state('test',{
        url:'/test',
        templateUrl:'angular/templates/test.html',
        controller:'testController'
    })
    .state('editTicket', {
        url:'/editticket/:ticketId',
        templateUrl:'angular/templates/editTicket.html',
        controller:'editticketController',
        resolve: {
            ticketInfo: function($http, $stateParams) {
                return $http.get('getticket/getticketinfo/' + $stateParams.ticketId)
                    .then(function(response) {
                        return response.data;
                    });
            }
        }
        
    })
    .state('viewTicket', {
        url:'/viewticket/:ticketId',
        templateUrl:'angular/templates/viewTicket.html',
        controller:'viewticketController',
        resolve: {
            ticketInfo: function($http, $stateParams) {
                return $http.get('getticket/getticketinfo/' + $stateParams.ticketId)
                    .then(function(response) {
                        return response.data;
                    });
            }
        }
    })
    .state('feedback', {
        url:'/feedback/:ticketId',
        templateUrl:'angular/templates/feedback.html',
        controller:'feedbackController',
        resolve: {
            ticketInfo: function($http, $stateParams) {
                return $http.get('getticket/getticketinfo/' + $stateParams.ticketId)
                    .then(function(response) {
                        return response.data;
                    });
            }
        }
    })
    // .state('viewFeedback', {
    //     // url:'/viewFeedback/:ticketId',
    //     // templateUrl:'angular/templates/viewFeedback.html',
    //     // controller:'viewFeedback',
    // })
    .state('editfeedback', {
        url:'/editFeedback/:ticketId',
        templateUrl:'angular/templates/editFeedback.html',
        controller:'editFeedback',
        resolve: {
            ticketInfo: function($http, $stateParams) {
                return $http.get('getticket/getticketinfo/' + $stateParams.ticketId)
                    .then(function(response) {
                        return response.data;
                    });
            }
        }
    })
});
app.controller('testController',function($scope){
    
var snackbarContainer = document.getElementById('demo-snackbar-example');
var showSnackbarButton = document.getElementById('demo-show-snackbar');
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
})});
app.controller('signupController',function($scope,serviceApi,$state,$rootScope){
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
                        var datap  = {
                            'userid':response.data.data.user_id
                        }
                        var postData = 'myData='+JSON.stringify(datap);
                        serviceApi.startsession(postData).then(function(response){
                            if(response.data.success==1)
                            {
                                $rootScope.session='1';
                                $rootScope.isLoggedIn=true;
                                $rootScope.userid=response.data.data.user_id;
                                $rootScope.role=response.data.data.user_role;
                                $rootScope.name=response.data.data.user_name;
                                localStorage.setItem('isLoggedin', true);
                                localStorage.setItem('userid',response.data.data.user_id);
                                $state.go('Ticket',datap);
                            }
                        },function(response){});
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
        }else{
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Please enter Email and Password'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
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
    $scope.captcha_error=false;
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
    var tCtx = document.getElementById('textCanvas').getContext('2d'), //Hidden canvas
    imageElem = document.getElementById('image');
    tCtx.font = "20px open sans";
    // tCtx.textAlign = "center";
    tCtx.fillText($scope.gen_captcha,128,48);
    
    // imageElem.src = tCtx.canvas.toDataURL();
    $scope.submitDetails = function(){
        if($scope.email!=null && $scope.captcha!=null && $scope.email!='' && $scope.captcha!=''){
            var captcha_status = ValidateCaptcha($scope.gen_captcha,$scope.captcha);
            if(captcha_status){
                var datap  = {
                    'email':$scope.email
                }
                var postData = 'myData='+JSON.stringify(datap);
                serviceApi.otp(postData).then(function(response){
                        if(response.data.success==1){
                            datap.userid=response.data.data.userid;
                            $state.go('otp',datap);
                        }
                        else{
                            var snackbarContainer = document.querySelector('#demo-toast-example');
                            var data = {message: 'Email Does Not Exist'};
                            snackbarContainer.MaterialSnackbar.showSnackbar(data);
                        }
                },function(response){});
            }
            else{
                var snackbarContainer = document.querySelector('#demo-toast-example');
                var data = {message: 'Wrong Captcha'};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
                $scope.captcha=null;
            }
        }else{
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Please enter Captcha and Email'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
    }
});
app.controller('otpController',function($scope,$http,$stateParams,$window,serviceApi,$state) {
    $scope.show_error=false;
    if($stateParams.email==null){
        $scope.email = $window.mini_user_email;
    }
    else{
        $scope.email = $stateParams.email;
    }
    if($stateParams.userid==null){
        $scope.userid = $window.mini_user_id;
    }
    else{
        $scope.userid = $stateParams.userid;
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
                    if(response.data.success==1){
                        // $rootScope.email = $scope.email;
                        datap={
                            'email':$scope.email,
                            'userid':$scope.userid
                        }
                        $state.go('resetpassword',datap);
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
app.controller('resetpasswordController', function($scope,$stateParams,$window,serviceApi,$rootScope,$state){
    if($stateParams.email==null){
        $scope.email = $window.mini_user_email;
    }
    else{
        $scope.email = $stateParams.email;
    }
    if($stateParams.userid==null){
        $scope.userid = $window.mini_user_id;
    }
    else{
        $scope.userid = $stateParams.userid;
    }
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
                    if(response.data.success==1){
                        var datap  = {
                            'userid':$scope.userid
                        }
                        var postData = 'myData='+JSON.stringify(datap);
                        serviceApi.startsession(postData).then(function(response){
                            if(response.data.success==1)
                            {
                                $rootScope.session='1';
                                // $rootScope.isLoggedIn=true;
                                $rootScope.userid=response.data.data.user_id;
                                $rootScope.role=response.data.data.user_role;
                                $rootScope.name=response.data.data.user_name;
                                $state.go('Ticket',datap);
                            }
                        },function(response){});
                        // location.replace("auth/which_email");
                    }
                    else{
                        alert("Unsuccessfull");
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
                $window.session='0';
                $rootScope.session=$window.session;
                localStorage.clear();
                $rootScope.isLoggedIn=false;
                $rootScope.userid=null;
                $rootScope.role=null;
                $rootScope.loggedname=null;
                console.log($rootScope);
                $state.go('Home');
            }
            
        },function(response){
            // login
            return false;
        })
    }


    
});
app.controller('loginController',function($scope,serviceApi,$rootScope,$state){
// if(($rootScope.session!='0' && $rootScope.session!=undefined && $rootScope.session!=null)|| ($rootScope.isLoggedIn!=null && $rootScope.isLoggedIn!=undefined))
if($rootScope.session!='0' && $rootScope.session!=undefined && $rootScope.session!=null)
{
  
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
            var postData = 'myData='+JSON.stringify(userdata);
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
app.controller("ticketController",function($scope,tickets,$rootScope,$state,serviceApi,$stateParams,ModalService,$window){
    $scope.deleteTickets = function() {
        alert("entered delete Ticket Function");
        var data = {
            tickets : $scope.lst
        }
        var postData = 'myData='+JSON.stringify(data); 
        serviceApi.deletetickets(postData).then(function(response){
        $window.location.reload();
        swal({
            title: "Success",
            text: "Ticket Deleted Successfully",
            type: "success",
            confirmButtonText: "Ok",
            closeOnConfirm: true
        })
        });
    }
    // if($rootScope.session!='0' || $rootScope.isLoggedIn!=null)
    if($rootScope.session!='0')
    {
        $scope.navigate=function(){
            $state.go('NewTicket');
        }
        $scope.it='-1';
        $scope.keyword = null;

     
      if($rootScope.role!="0"){
        $rootScope.admin=true;
      }
      else{
        $rootScope.admin=false;
      }
      if($stateParams.tickets_data==null){
        $scope.tickets=tickets.data;
      }
      else{
        $scope.tickets=$stateParams.tickets_data;
      }
      if($stateParams.filters_to_be_applied_user==null){
        $scope.filters_to_be_applied_user = {};
      }
      else{
        $scope.filters_to_be_applied_user=$stateParams.filters_to_be_applied_user;
      }
      if($stateParams.filters_to_be_applied==null){
        $scope.filters_to_be_applied = {};
      }
      else{
        $scope.filters_to_be_applied=$stateParams.filters_to_be_applied;
      }
     
      
        $scope.items = [
            { id: 0, name: 'to be reviewed' },
            { id: 1, name: 'In progress' },
            { id: 2, name: 'on hold' },
            {id:3,name:'resolved'},
            {id:4,name:'dropped'},
            {id:5,name:'resolved and closed'}
          ];
          $scope.status=[{
            id:-1,name:'None'
          },{
            id:0,name:'Open Tickets'
          },{
            id:1,name:'Closed Tickets'
        }];
        $scope.sort=[{
            id:-1,name:'None',dbname:'id'
          },{
            id:0,name:'New Tickets',dbname:'genrated_time'
          },
        {
            id:1,name:'Last Updated',dbname:'updation_time'
        }];
      
      
        $scope.Sglchk=false;
        $scope.delupdate=false;
        $scope.lst = [];
        $scope.checkAll = function() {
            angular.forEach($scope.tickets, function (ticket) {
                ticket.checkbox=$scope.selectAll;
                $scope.getChecked($scope.selectAll,ticket.ticket_id);
            })
        }
        $scope.viewTicket = function(ticketId) {
            window.location.href = 'viewticket/' + ticketId;
        };          
        $scope.getChecked = function(check,value){
            
            if(check){
                if(!$scope.lst.includes(value)){
                   $scope.lst.push(value);
                   $scope.goToEdit = $scope.lst[0];
                }
            }else{
                 $scope.lst.splice($scope.lst.indexOf(value), 1);
                 $scope.goToEdit = $scope.lst[0];
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

        }
        $scope.stream=1;
        $scope.fetching_tickets=false
        $scope.load = function() {
            if ($scope.fetching_tickets==false) {
                $scope.stream+=1;
                if($rootScope.filter==null){
                    $scope.filters_to_be_applied.limit= 10;
                    $scope.filters_to_be_applied.stream= $scope.stream;
                }else{
                    $scope.filters_to_be_applied=$rootScope.filter;
                    $scope.filters_to_be_applied.limit=10;
                    $scope.filters_to_be_applied.stream= $scope.stream;
                }
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    if(response.data!==false){
                    $scope.tickets = $scope.tickets.concat(response.data);
                    $scope.fetching_tickets = false;
                   }
                },function(response){
                    $scope.fetching_tickets = false;
                });
            }

        }
        $scope.export = function(){
            document.getElementById('heading').style.display='';
            serviceApi.table_toExcel(document.getElementById('tblticket'));
            document.getElementById('heading').style.display='none';
        }
         $scope.statusChanges = function(id){ 
            
            if(id>-1){
                $rootScope.filter=[];
                $scope.stream=1;
                if(id==0){
                    $scope.Heading=$scope.status[1].name;
                    $scope.filters_to_be_applied.statuschange= id;
                    $rootScope.filter=$scope.filters_to_be_applied;
                }else{
                    $scope.Heading=$scope.status[2].name;
                    $scope.filters_to_be_applied.statuschange= id;
                    $rootScope.filter=$scope.filters_to_be_applied;
                }
              
                $scope.filters_to_be_applied.limit=10;
                $scope.filters_to_be_applied.stream=1;
          
                $scope.tickets = [];
                // var filter_tickets={
                //     'sortby':id
                // }
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                    delete $scope.filters_Open_close;
                },function(response){

                });
            }
            else{
                $scope.tickets = [];
                delete $scope.filters_to_be_applied.statuschange;
                $rootScope.filter={}
                $scope.filters_to_be_applied.limit=10;
                $scope.filters_to_be_applied.stream=1;
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }
        } 
        $scope.due = function(id){ 
                $rootScope.filter=[];
                $scope.stream=1;
                if(id==0){
                    $scope.filters_to_be_applied.due= id;
                    $rootScope.filter=$scope.filters_to_be_applied;
                }else{
                    $scope.filters_to_be_applied.due= id;
                    $rootScope.filter=$scope.filters_to_be_applied;
                }
              
                $scope.filters_to_be_applied.limit=10;
                $scope.filters_to_be_applied.stream=1;
                $scope.tickets = '';
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                    delete $scope.filters_Open_close;
                },function(response){

                });
        }
        $scope.unassigned = function(id){ 
                $rootScope.filter=[];
                $scope.stream=1;
                $scope.filters_to_be_applied.unassigned= id;
                $rootScope.filter=$scope.filters_to_be_applied;
                $scope.filters_to_be_applied.limit=10;
                $scope.filters_to_be_applied.stream=1;
                $scope.tickets = [];
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                    delete $scope.filters_Open_close;
                },function(response){

                });
            }
        if($scope.filters_to_be_applied.openorClose !== undefined){
            $scope.statusChanges($scope.filters_to_be_applied.openorClose);
          }
          if($scope.filters_to_be_applied.due !== undefined){
            $scope.due($scope.filters_to_be_applied.due);
          }
          if($scope.filters_to_be_applied.unassigned !== undefined){
            $scope.unassigned($scope.filters_to_be_applied.unassigned);
          }
        $scope.sortby = function(id){
            $scope.stream=1;
            if(id>-1){
                $scope.filters_to_be_applied.sortby= id;
                $rootScope.filter=$scope.filters_to_be_applied;
                $scope.filters_to_be_applied.limit= 10;
                $scope.filters_to_be_applied.stream= 1;
                $scope.tickets = [];
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }
            else{
                $rootScope.filter={};
                $scope.tickets = [];
                delete $scope.filters_to_be_applied.sortby;
                $scope.filters_to_be_applied.limit= 10;
                $scope.filters_to_be_applied.stream= 1;
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }

        }
          $scope.statusChanged = function(item,t_id,user_name,subject,admin_name,email){       
                    var u_details={
                        'status':item,
                        'ticket':t_id,
                    }
                    // comment
                    var data2 = {
                        name: user_name,
                        subject: subject,
                        assigned: admin_name,
                        email : email,
                        ticketId: t_id
                    }
                    console.log(data2);
                    var postData = 'myData='+JSON.stringify(data2);
                    if(u_details.status == 3) {
                        serviceApi.feedback(postData).then(function(response){
                        });
                    }
                    // comment
                    var update_data = 'myData2='+JSON.stringify(u_details);
                    serviceApi.update_status(update_data).then(function(response){
                        if(response.data==1)
                        {
                            var snackbarContainer = document.querySelector('#demo-toast-example');
                            var data = {message: 'Updated'};
                            snackbarContainer.MaterialSnackbar.showSnackbar(data);
                        }
                    },function(response){

                    });
                }
        // $scope.status_filter = function(id){
            
        //     if(id>-1){
        //         $scope.filters_to_be_applied.status = id;
        //         $scope.tickets = '';
        //         // var filter_tickets={
        //         //     'sortby':id
        //         // }
        //         var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
        //         serviceApi.filter_tickets(filter_data).then(function(response){
        //             $scope.tickets=response.data;
        //         },function(response){

        //         });
        //     }
        //     else{
        //         $scope.tickets = '';
        //         delete $scope.filters_to_be_applied.status;
        //         var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
        //         serviceApi.filter_tickets(filter_data).then(function(response){
        //             $scope.tickets=response.data;
        //         },function(response){

        //         });
        //     }

        // }
        $scope.search = function(keyword){
            if(keyword!=null && keyword!=''){
                $scope.filters_to_be_applied.keyword = keyword;
                $scope.filters_to_be_applied.limit= 10;
                $scope.filters_to_be_applied.stream= 1;
                $scope.tickets = [];
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }
            else{
                $scope.tickets = [];
                
                delete $scope.filters_to_be_applied.keyword;
                $scope.filters_to_be_applied.limit= 10;
                $scope.filters_to_be_applied.stream= 1;
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }
        }
     
      $scope.showAModal = function() {
        
        // Just provide a template url, a controller and call 'showModal'.
      ModalService.showModal({
        templateUrl:'angular/templates/filter_modal.html',
        controller:'filterModalController',
        params: {
            filters_to_be_applied:null
        },
      }).then(function(modal) {
        modal.close.then(function(result) {
            close(result, 200);
        });
      });
  
    };
  
    }else{
        $state.go('Home');
    }
});
app.controller('filterModalController',function($scope,serviceApi,$state,$stateParams,close,$rootScope){
    $scope.dismissModal = function() {
        close(200); // close, but give 200ms for bootstrap to animate
    };
    $scope.filterData = function() {
       
            serviceApi.getFilterData().then(function(response){
                if(response.data!=null){
                    $scope.tag=response.data.tag;
                    $scope.department=response.data.department;
                    $scope.AssignedTo=response.data.user;
                }
            },function(response){
                $scope.fetching_tickets = false;
            });
        }
    $scope.filterData();
    $scope.discardfilter = function()
    {
        $scope.filters_to_be_applied = {};
        $rootScope.filters={};
        $scope.pr = "-1";
        $scope.tg = "-1";
        $scope.ap = "-1";
        $scope.st = "-1";
        $scope.ind = "-1";
        $scope.at = "-1";
        $scope.email='';
        $scope.account_number='';
        $scope.ticket_owner='';
        
    }

    if($stateParams.filters_to_be_applied!=null) {
        $scope.filters_to_be_applied = $stateParams.filters_to_be_applied;
        
        if($scope.filters_to_be_applied.email){

            $scope.email = $scope.filters_to_be_applied.email;
        }
        else{
            $scope.email = null;
        }
        if($scope.filters_to_be_applied.account_number){

            $scope.account_number = $scope.filters_to_be_applied.account_number;
        }
        else{
            $scope.account_number = null;
        }
        if($scope.filters_to_be_applied.ticket_owner){

            $scope.ticket_owner = $scope.filters_to_be_applied.ticket_owner;
        }
        else{
            $scope.ticket_owner = null;
        }
        if($scope.filters_to_be_applied.priority){

            $scope.pr = $scope.filters_to_be_applied.priority;
        }
        else{
            $scope.pr = "-1";
        }
        if($scope.filters_to_be_applied.assistance_process){

            $scope.ap = $scope.filters_to_be_applied.assistance_process;
        }
        else{
            $scope.ap = "-1";
        }
        if($scope.filters_to_be_applied.status){

            $scope.st = $scope.filters_to_be_applied.status;
        }
        else{
            $scope.st = "-1";
        }
        if($scope.filters_to_be_applied.internal_department){

            $scope.ind = $scope.filters_to_be_applied.internal_department;
        }
        else{
            $scope.ind = "-1";
        }
        if($scope.filters_to_be_applied.assigned_to){

            $scope.at = $scope.filters_to_be_applied.assigned_to;
        }
        else{
            $scope.at = "-1";
        }
    }
    else{
        $scope.discardfilter();
    }
    
    $scope.status = [
        { id: 0, name: 'to be reviewed' },
        { id: 1, name: 'In progress' },
        { id: 2, name: 'on hold' },
        {id:3,name:'resolved'},
        {id:4,name:'dropped'},
        {id:5,name:'resolved and closed'}
    ];
    $scope.priority = [
        { id: 0, name: 'none' },
        { id: 1, name: 'low' },
        { id: 2, name: 'medium' },
        { id: 3, name: 'high' }
    ]
    $scope.assistance_process = [
        { id: 0, name: 'none' },
        { id: 1, name: 'option1' },
        { id: 2, name: 'option2' },
        { id: 3, name: 'option3' }
    ]

    $scope.submitfilter = function(){
        if($scope.pr!="-1"){
            $scope.filters_to_be_applied.priority = $scope.pr;
        }

        if($scope.ap!="-1"){
            $scope.filters_to_be_applied.assistance_process = $scope.ap;
        }

        if($scope.st!="-1"){
            $scope.filters_to_be_applied.status = $scope.st;
        }else{
            delete $scope.filters_to_be_applied.status;
        }

        if($scope.ind!="-1"){
            $scope.filters_to_be_applied.internal_department = $scope.ind;
        }else{
            delete $scope.filters_to_be_applied.internal_department;
        }

        if($scope.at!="-1"){
            $scope.filters_to_be_applied.assigned_to = $scope.at;
        }
        else{
            delete $scope.filters_to_be_applied.assigned_to;
        }

        if($scope.email!=null && $scope.email!="")
        {
            $scope.filters_to_be_applied.email = $scope.email
        }
        else
        {
            delete $scope.filters_to_be_applied.email;

        }
        
        if($scope.ticket_owner!=null && $scope.ticket_owner!="")
        {
            $scope.filters_to_be_applied.ticket_owner = $scope.ticket_owner
        }

        if($scope.account_number!=null && $scope.account_number!="")
        {
            $scope.filters_to_be_applied.account_number = $scope.account_number
        }
       
        $scope.filters_to_be_applied.limit=10;
        $scope.filters_to_be_applied.stream=1;
        $rootScope.filter=$scope.filters_to_be_applied;
        var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
        serviceApi.filter_tickets(filter_data).then(function(response){
            $scope.dismissModal();
            $state.go('Ticket',{'tickets_data':response.data,'filters_to_be_applied':$scope.filters_to_be_applied});
        },function(response){

        });
    }
    
});
app.controller("editticketController", function($scope, $http, FileUploader,$rootScope,$state,ticketInfo, serviceApi,$stateParams){
    if($rootScope.session!='0')
    {
        $scope.it='-1';
        $scope.keyword = null;
        // console.log('logged in');
        // console.log($rootScope.role);
        if($rootScope.role!="0"){
            $rootScope.admin=true;
        }
        else{
            $rootScope.admin=false;
        }
    }
    
    $scope.reqerror=false;
    $scope.data='';
    $scope.attachments=false;
    $scope.selectedDate = null;
    var uploader = $scope.uploader = new FileUploader({
        url:'http://localhost/TMS/user/user_image_upload/?ticketid=',
        formData:""
    });
    $scope.selectedDepartment = '';
    $scope.selectedPriority = '';
    $scope.statusOption = [
        { id: '0' , name: 'to be reviewed' },
        { id: '1' , name: 'In progress' },
        { id: '2' , name: 'on hold' },
        { id: '3' , name:'resolved'},
        { id: '4', name:'dropped'},
        { id : '5', name:'resolved and closed'}
    ];
    $scope.assistantProcess = [
        { id: '0', name: 'Tech Assistant' },
        { id: '1', name: 'Finance Assistant' },
        { id: '2', name: 'proces 3' }
    ];
    $scope.priorityOption = [
        { id: '0', name: 'none' },
        { id: '1', name: 'Low' },
        { id: '2', name: 'Medium' },
        { id: '3', name: 'High' },
    ];
        // DATE PICKER
        flatpickr("#datepicker", {
            minDate: "today"
        });
    $scope.getTags = function() {
        $http ({
            method: 'GET',
            url: 'tags'
        })
        .then(function(response) {
            $scope.tagItems = response.data;  
        }, function(reason) {
            $scope.error = reason.data;
        })
    }
    $scope.ticketId = $stateParams.ticketId;
    $scope.ticketInfo = ticketInfo;
    if($scope.ticketInfo.ticket[0].length < 0) {
        swal({
            title: "Error",
            text: "user unauthorized",
            type: "error",
            confirmButtonText: "Ok"
        })
        $state.go('Ticket',$rootScope.userid);
    }
    $scope.userid = $scope.ticketInfo.users[0].user_id;
    if($rootScope.userid != $scope.userid && !$scope.admin) {
         $state.go('Ticket',$rootScope.userid);
    }
    else if( $rootScope.userid == $scope.userid || $scope.admin){
        $scope.user = $scope.ticketInfo.users[0];
        $scope.name = $scope.user.name;
        $scope.ticket_id = $scope.ticketInfo.ticket[0].ticket_id;
        $scope.selectedAdmin = $scope.ticketInfo.ticket[0].assigned_to;
        $scope.adminName = $scope.ticketInfo.admin.find(admin => admin.user_id === $scope.selectedAdmin).name;
        $scope.email = $scope.user.email;
        $scope.subject = $scope.ticketInfo.ticket[0].subject;
            // DEPARTMENT
            $scope.d_id = $scope.ticketInfo.ticket[0].internal_department;
            for (var i = 0; i < $scope.ticketInfo.department.length; i++) {
                if ($scope.ticketInfo.department[i].department_id === $scope.d_id) {
                $scope.selectedDepartment = $scope.ticketInfo.department[i].department_id;
                break;
                }
            }
            // STATUS  
            $scope.status_id = $scope.ticketInfo.ticket[0].status;
            for (var i = 0; i < $scope.statusOption.length; i++) {
                if ($scope.statusOption[i].id === $scope.status_id) {
                $scope.selectedStatus = $scope.statusOption[i].id;
                break;
                }
            }
            // ASSISTANCE PROCESS
            $scope.process_id = $scope.ticketInfo.ticket[0].assistance_process;
            for (var i = 0; i < $scope.assistantProcess.length; i++) {
                if ($scope.assistantProcess[i].id === $scope.process_id) {
                $scope.selectedProcess = $scope.assistantProcess[i].id;
                break;
                }
            }
            // PRIORITY
            $scope.priority_id = $scope.ticketInfo.ticket[0].priority;
            for (var i = 0; i < $scope.priorityOption.length; i++) {
                if ($scope.priorityOption[i].id === $scope.priority_id) {
                $scope.selectedPriority = $scope.priorityOption[i].id;
                break;
                }
            }
            // DUE DATE
            $scope.selectedDate = $scope.ticketInfo.ticket[0].duedate;
            $scope.tagNames = $scope.ticketInfo.tags.map(function(tag) {
                return tag.tag_name;
            });
            $scope.tagItems = []; // tag names from backend
            $scope.tagId = []; // tag ID to send it to backend ticket_tags table
            $scope.getTags();
            $scope.files_original = $scope.ticketInfo.attachments.map(function(file) {
                return file.attachment;
            });
        }
        // }, function(reason) {
        //     $scope.error = reason.data;
        // })
    // }
    // $scope.getTicketInfo();
        
    // TAGS
    $scope.addTag = function(tag) {
      if ($scope.tagNames.indexOf(tag) == -1) {
        if(!$scope.tagNames.includes(tag) && tag){
            $scope.tagNames.push(tag);
            console.log($scope.tagNames);
        }
      }
      $scope.tag='';
    }
    const inputElement = document.getElementById("tag-input");
    inputElement.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            $scope.addTag($scope.tag);
        }
    });
    $scope.removeTag = function(tag) {
      var index = $scope.tagNames.indexOf(tag);
      if (index !== -1) {       
        $scope.tagNames.splice(index, 1);      
      }
    }
    // ATTACHMENTS
    $scope.delete_files = [];
    $scope.delete_file = function(file) {
            if(!$scope.delete_files.includes(file) && file){
                $scope.delete_files.push(file);
            }
            var index = $scope.files_original.indexOf(file);
            if (index !== -1) {       
              $scope.files_original.splice(index, 1);     
            }
    }
    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1 && item.size  <= 41943040;}});
    
    uploader.onAfterAddingAll = function(addedFileItems) {
        $scope.files=addedFileItems;
        if($scope.files.length>0)
        {
            $scope.attachments=true;
        }
        else{
            
            $scope.attachments=false;
        }
    }
    $scope.Getforminfo=function(){
        $scope.desc=CKEDITOR.instances.editor1.getData();
        if($scope.subject!='' && $scope.desc!='')
        {
        subject=$scope.ticketInfo.ticket[0].subject;
        description=$scope.desc;
        var formdata={
            'ticketid': $scope.ticket_id,
            'subject':subject,
            'description':description,
            'attachments':$scope.attachments,
            'tags' : $scope.tagNames,
            'assigned' : $scope.selectedAdmin,
            'department': $scope.selectedDepartment,
            'status' : $scope.selectedStatus,
            'priority' : $scope.selectedPriority,
            'process' : $scope.selectedProcess,
            'duedate' : $scope.selectedDate,
            'delete_file' : $scope.delete_files
        }
        console.log(formdata);
        
        var ticket_data = 'myData3='+JSON.stringify(formdata);
        serviceApi.editTicket(ticket_data).then(function(response){
            
            var data2 = {
                name: $scope.name,
                subject: $scope.subject,
                assigned: $scope.adminName,
                email : $scope.email,
                ticketId: $scope.ticket_id
            }
            var postData = 'myData='+JSON.stringify(data2);
            if(formdata.status == 3) {
                serviceApi.feedback(postData).then(function(response){
                });
            }

            if(response.data['error']==false)
            {
                // $scope.ticket_id=response.data['ticket_id'];
                formdata={
                    'ticketid':$scope.ticket_id,
                }
                if (uploader.queue.length > 0) {
                uploader['formData']=JSON.stringify(formdata);
                console.log($scope.ticket_id);
                console.log(uploader);       
            
            uploader.onBeforeUploadItem = function(item){
                console.log(item);
                // console.log($scope.ticket_id);
                item.url='http://localhost/TMS/user/user_image_upload/?ticketid='+$scope.ticket_id;               
            }          
            uploader.uploadAll();
            $state.go('viewTicket',{'ticketId': $scope.ticket_id});
                }
            else {            
                $state.go('viewTicket',{'ticketId': $scope.ticket_id});               
            }
            }
            else if(response.data['error']==true){
                var snackbarContainer = document.querySelector('#demo-toast-example');
                var data = {message: 'Failed to edit ticket'};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
                $state.go('viewTicket',{'ticketId': $scope.ticket_id});  
            }       
        },function(response){
            $state.go('viewTicket',{'ticketId': $scope.ticket_id});
        });
    }
    else{
        $scope.reqerror=true;
        uploader.clearQueue();
    }
    }

});
app.controller("dashboardController",function($scope,averageRating,dashboard_data,line_data,bar_data,$state,$rootScope,$stateParams,serviceApi){
    if($rootScope.session!='0' && $rootScope.role == 1)
    {
    if(dashboard_data!=null){
        $scope.dashboard_data=dashboard_data.data;
      }
      delete $rootScope.day;
      $scope.linedate=[];
      if(line_data!=null){
        line_data.data.forEach(function(item){
            $scope.linedata=[];
            $scope.linedata.push(item.Date);
            $scope.linedata.push(item.Day);
            $scope.linedate.push($scope.linedata);
         });
      }
      $scope.bardate=[];
      if(bar_data!=null){
        bar_data.data.forEach(function(item){
            $scope.bardata=[];
            $scope.bardata.push(item.Date);
            $scope.bardata.push(item.Day);
            $scope.bardate.push($scope.bardata);
         });
      }
      $scope.linegraph=function(id){
        $scope.filters_to_be_applied={};
        if(id>-1){
            $scope.filters_to_be_applied.day= id;
            var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
            serviceApi.getLineGraphFilterData(filter_data).then(function(response){
                $scope.linedate=[];
                response.data.forEach(function(item){
                    $scope.linedata=[];
                    $scope.linedata.push(item.Date);
                    $scope.linedata.push(item.Day);
                    $scope.linedate.push($scope.linedata);
                 });
                 $scope.newTicket.series[0].values =$scope.linedate;
            },function(response){

            });
        }
        else{
            delete $scope.filters_to_be_applied;
            serviceApi.getLineGraphData().then(function(response){
                $scope.linedate=[];
                response.data.forEach(function(item){
                    $scope.linedata=[];
                    $scope.linedata.push(item.Date);
                    $scope.linedata.push(item.Day);
                    $scope.linedate.push($scope.linedata);
                 });
                 $scope.newTicket.series[0].values =$scope.linedate;
            },function(response){
            });
        }
      }
      $scope.bargraph=function(id){
        
        $scope.filters_to_be_applied={};
        if(id>-1){
            $scope.filters_to_be_applied.day= id;
            var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
            serviceApi.getBarGraphFilterData(filter_data).then(function(response){
                $scope.bardate=[];
                response.data.forEach(function(item){
                    $scope.bardata=[];
                    $scope.bardata.push(item.Date);
                    $scope.bardata.push(item.Day);
                    $scope.bardate.push($scope.bardata);
                 });
                 $scope.closed.series[0].values =$scope.bardate;
            },function(response){

            });
        }
        else{
            delete $scope.filters_to_be_applied;
            serviceApi.getBarGraphData().then(function(response){
                $scope.bardate=[];
                response.data.forEach(function(item){
                    $scope.bardata=[];
                    $scope.bardata.push(item.Date);
                    $scope.bardata.push(item.Day);
                    $scope.bardate.push($scope.bardata);
                 });
                 $scope.closed.series[0].values =$scope.bardate;
            },function(response){
            });
        }
      }
      $scope.averageRating = averageRating;
      console.log("average");
      console.log($scope.averageRating);
      $scope.day = [
        { id: -1, name: 'All Ticket'},
        { id: 0, name: 'Last 7 day' },
        { id: 1, name: 'Last 30 day' }
      ];
      $scope.newTicket = {  
        type : 'line' ,
        series : [  
            { values : $scope.linedate }
        ]
      };
      $scope.closed = {  
        type : 'bar' ,  
        series : [  
          { values : $scope.bardate },  
        ]  
      };
      $scope.filter_by_date = function(id){ 
        $scope.filters_to_be_applied={};
        if(id>-1){
            $rootScope.day=id;
            $scope.filters_to_be_applied.day= id;
            $scope.dashboard_data = [];
            var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
            serviceApi.getDashboardFilterData(filter_data).then(function(response){
                $scope.dashboard_data=response.data;
            },function(response){

            });
        }
        else{
            delete $rootScope.day;
            $scope.dashboard_data = [];
            delete $scope.filters_to_be_applied;
            serviceApi.getDashboardData().then(function(response){
                $scope.dashboard_data=response.data;
            },function(response){
            });
        }
    } 
      $scope.statusopenorclose = function(id){
        $scope.filters_to_be_applied={};
        $scope.filters_to_be_applied.openorClose = id;
        $scope.filters_to_be_applied.day = $rootScope.day;
        $state.go('Ticket',{'tickets_data':null,'filters_to_be_applied':$scope.filters_to_be_applied});
      }
      $scope.due = function(id){
        $scope.filters_to_be_applied={};
        $scope.filters_to_be_applied.due = id;
        $scope.filters_to_be_applied.day = $rootScope.day;
        $state.go('Ticket',{'tickets_data':null,'filters_to_be_applied':$scope.filters_to_be_applied});
      }
      $scope.unassigned = function(id){
        $scope.filters_to_be_applied={};
        $scope.filters_to_be_applied.unassigned = id;
        $scope.filters_to_be_applied.day = $rootScope.day;
        $state.go('Ticket',{'tickets_data':null,'filters_to_be_applied':$scope.filters_to_be_applied});
      }
     }else{
        $state.go('Home');
    }
});
app.controller("newticketController",function($scope,FileUploader,$rootScope,serviceApi,$state,$http){
    if($rootScope.session!='0')
    {
        $scope.it='-1';
        $scope.keyword = null;
        console.log('logged in');
        console.log($rootScope.role);
        if($rootScope.role!="0"){
            $rootScope.admin=true;
        }
        else{
            $rootScope.admin=false;
        }
    }
    else {
        $state.go("Home");
    }
    $scope.reqerror=false;
    $scope.subject='';
// $scope.accountno='';
$scope.data='';
$scope.attachments=false;
    var uploader = $scope.uploader = new FileUploader({
        url:'http://localhost/TMS/user/user_image_upload/?ticketid=',
        formData:""
    });
    // $scope.getTags = function() {
    //     serviceApi.getTags()
    //     .then(function(tagItems) {
    //         $scope.tagItems = tagItems;
    //         console.log($scope.tagItems);   
    //     }, function(error) {
    //         $scope.error = error;
    //     });
    // };
    $scope.tagNames = []; // tag name what user has entered
    $scope.tagItems = []; // tag names from backend
    
    $scope.tagId = []; // tag ID to send it to backend ticket_tags table
    $scope.getTags = function() {
        $http ({
            method: 'GET',
            url: 'tags'
        })
        .then(function(response) {
            $scope.tagItems = response.data;
            console.log($scope.tagItems);   
        }, function(reason) {
            $scope.error = reason.data;
        })
    }
    $scope.getTags();

    $scope.addTag = function(tag) {
      if ($scope.tagNames.indexOf(tag) == -1) {
        if(!$scope.tagNames.includes(tag)){
            $scope.tagNames.push(tag);
            console.log($scope.tagNames);
            // console.log($scope.tagItems);
            // $scope.tagId.push(tag.tagid);
            // console.log($scope.tagId);
        }
      }
      $scope.tag='';
    }
    const inputElement = document.getElementById("tag-input");
    inputElement.addEventListener("keydown", function(event) {
        // check if the "enter" key was pressed    
        if (event.key === "Enter") {
            $scope.addTag($scope.tag);
            // console.log("Enter key was pressed!");
        }
    });
    
    $scope.removeTag = function(tag) {
      var index = $scope.tagNames.indexOf(tag);
      if (index !== -1) {       
        $scope.tagNames.splice(index, 1);
        $scope.tagId.splice(index, 1);
        console.log($scope.tagId);       
      }
    }


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
    // $scope.accountno='';
    uploader.clearQueue();
    CKEDITOR.instances.editor1.setData( '<p></p>');
}
$scope.Getforminfo=function(){
    $scope.desc=CKEDITOR.instances.editor1.getData();
    if($scope.subject!='' && $scope.desc!='')
    {
    subject=$scope.subject;
    // accountno=$scope.accountno;
    description=$scope.desc;
    var formdata={
        'subject':subject,
        // 'accountno':accountno,
        'description':description,
        'attachments':$scope.attachments,
        'tags' : $scope.tagNames
        // 'tags' : $scope.tagId
    }
    
    var ticket_data = 'myData3='+JSON.stringify(formdata);
    serviceApi.addTicket(ticket_data).then(function(response){
        if(response.data['error']==false)
        {
            $scope.ticket_id=response.data['ticket_id'];
            formdata={
                'ticketid':$scope.ticket_id,
            }
            uploader['formdata']=JSON.stringify(formdata);
        uploader.onBeforeUploadItem = function(item){
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
app.controller("viewticketController",function($scope,$http,$stateParams,ticketInfo,$rootScope,serviceApi,$rootScope,ModalService,$state) {
    if($rootScope.session!='0')
    {
        $scope.it='-1';
        $scope.keyword = null;
        console.log('logged in');
        console.log($rootScope.role);
        if($rootScope.role!="0"){
            $rootScope.admin=true;
        }
        else{
            $rootScope.admin=false;
        }
    }
    $scope.toggleDrawer = function() {
        var drawer = angular.element(document.querySelector('.mdl-layout__drawer'));
        var obfuscator = angular.element(document.querySelector('.mdl-layout__obfuscator'));

        drawer.toggleClass('is-visible');
        obfuscator.toggleClass('is-visible');
    };
    $scope.openModal = function() {
        ModalService.showModal({
          templateUrl: 'angular/templates/viewFeedback.html',
          controller: 'viewFeedback'
        }).then(function(modal) {
            modal.close.then(function(result) {
                close(result, 200);
            });
        });
        $('.modal-backdrop').appendTo(document.body);
    };

        // $scope.selectedDate = null;   
        // DATE PICKER
    flatpickr("#datepicker", {
        minDate: "today"
    });
    $scope.statusOption = [
        { id: '0' , name: 'to be reviewed' },
        { id: '1' , name: 'In progress' },
        { id: '2' , name: 'on hold' },
        { id: '3' , name:'resolved'},
        { id: '4', name:'dropped'},
        { id : '5', name:'resolved and closed'}
    ];
    $scope.assistantProcess = [
        { id: '0', name: 'Tech Assistant' },
        { id: '1', name: 'Finance Assistant' },
        { id: '2', name: 'proces 3' }
    ];
    $scope.priorityOption = [
        { id: '0', name: 'none' },
        { id: '1', name: 'Low' },
        { id: '2', name: 'Medium' },
        { id: '3', name: 'High' },
    ];
    $scope.ticketId = $stateParams.ticketId;
    console.log($scope.ticketInfo);
    $scope.ticketInfo = ticketInfo;
    if($scope.ticketInfo.ticket.length == 0) {
        swal({
            title: "Error",
            text: "No Ticket Found",
            icon: "error"
        })
        $state.go('Ticket',$rootScope.userid);
    }else {
        $scope.userid = $scope.ticketInfo.users[0].user_id;
    }
    if($rootScope.userid != $scope.userid && !$scope.admin) {
        swal({
            title: "Error",
            text: "user unauthorized",
            icon: "error"
        })
         $state.go('Ticket',$rootScope.userid);
    }
    else if( $rootScope.userid == $scope.userid || $scope.admin){
    console.log($scope.ticketInfo);
    $scope.user = $scope.ticketInfo.users[0];
    $scope.name = $scope.user.name;
    $scope.email = $scope.user.email;
    $scope.ticket_id = $scope.ticketInfo.ticket[0].ticket_id;
    if($scope.ticketInfo.feedback.length > 0) {
        $scope.feedback = 'TRUE';
    }
    $scope.subject = $scope.ticketInfo.ticket[0].subject;
    // ASSIGNED TO
    $scope.selectedAdmin = $scope.ticketInfo.ticket[0].assigned_to;
    $scope.adminName = $scope.ticketInfo.admin.find(admin => admin.user_id === $scope.selectedAdmin).name;
    $scope.description = $scope.ticketInfo.ticket[0].description
    // DEPARTMENT
    $scope.d_id = $scope.ticketInfo.ticket[0].internal_department;
    for (var i = 0; i < $scope.ticketInfo.department.length; i++) {
        if ($scope.ticketInfo.department[i].department_id === $scope.d_id) {
        $scope.selectedDepartment = $scope.ticketInfo.department[i].department_id;
        break;
        }
    }
            // STATUS  
            $scope.status_id = $scope.ticketInfo.ticket[0].status;
            for (var i = 0; i < $scope.statusOption.length; i++) {
                if ($scope.statusOption[i].id === $scope.status_id) {
                $scope.selectedStatus = $scope.statusOption[i].id;
                break;
                }
            }
            // ASSISTANCE PROCESS
            $scope.process_id = $scope.ticketInfo.ticket[0].assistance_process;
            for (var i = 0; i < $scope.assistantProcess.length; i++) {
                if ($scope.assistantProcess[i].id === $scope.process_id) {
                $scope.selectedProcess = $scope.assistantProcess[i].id;
                break;
                }
            }
            // PRIORITY
            $scope.priority_id = $scope.ticketInfo.ticket[0].priority;
            for (var i = 0; i < $scope.priorityOption.length; i++) {
                if ($scope.priorityOption[i].id === $scope.priority_id) {
                $scope.selectedPriority = $scope.priorityOption[i].id;
                break;
                }
            }
            // DUE DATE
            $scope.selectedDate = $scope.ticketInfo.ticket[0].duedate;
            if($scope.selectedDate == null) {
                $scope.selectedDate = "Not Selected";
            }
            // TAGS
            $scope.tagNames = $scope.ticketInfo.tags.map(function(tag) {
                return tag.tag_name;
            });;
            // ATTACHMENTS
            $scope.files = $scope.ticketInfo.attachments.map(function(file) {
                return file.attachment;
            });
        }
    $scope.updateTicketStatus = function() {
        var data = {
            status: $scope.selectedStatus,
            ticketId: $scope.ticket_id
        };
        var data2 = {
            name: $scope.name,
            subject: $scope.subject,
            assigned: $scope.adminName,
            email : $scope.email,
            ticketId: $scope.ticket_id
        }
        var postData = 'myData='+JSON.stringify(data2);
        $http.post('getticket/updatestatus',data)
            .then(function(response) {         
                swal({
                    title: "Ticket Status Updated!",
                    text: "The ticket status has been updated successfully.",
                    icon: "success",

                });
                if(data.status == 3) {
                    serviceApi.feedback(postData).then(function(response){
                    });
                }
            }, function(error) {
                swal({
                    title: "Error",
                    text: "An error occurred while updating the ticket status.",
                    icon: "error",
                });
            });
    }
    $scope.updatepriority = function() {
        var data = {
            priority: $scope.selectedPriority,
            ticketId: $scope.ticket_id
        };
        $http.post('getticket/updatepriority',data)
            .then(function(response) {
                swal({
                    title: "Ticket Priority Updated!",
                    text: "The ticket Priority has been updated successfully.",
                    icon: "success",

                });
            }, function(error) {
                swal({
                    title: "Error",
                    text: "An error occurred while updating the ticket priority.",
                    icon: "error",
                });
            });
    }
    $scope.updateduedate = function() {
        var data = {
            duedate: $scope.selectedDate,
            ticketId: $scope.ticket_id
        };
        $http.post('getticket/updateduedate',data)
            .then(function(response) {
                swal({
                        title: "Ticket Due Date Updated!",
                        text: "The ticket Due Date has been updated successfully.",
                        icon: "success",

                    });
            }, function(error) {
                swal({
                        title: "Error",
                        text: "An error occurred while updating the ticket Due Date.",
                        icon: "error",
                    });
            });
    }
    $scope.showDeleteDialog = function() {
        var dialog = document.querySelector('dialog');
        dialog.showModal();
      };
    $scope.hideDeleteDialog = function() {
        var dialog = document.querySelector('dialog');
        dialog.close();
    };     
    $scope.deleteItem = function() {
        var data = {
            ticketId: $scope.ticket_id
        }
        var postData = 'myData='+JSON.stringify(data);       
        serviceApi.deleteticket(postData).then(function(response){
            swal({
                title: "Ticket Deleted!",
                text: "The ticket has been deleted successfully.",
                icon: "success",
            });
            $state.go('Ticket',$rootScope.userid);

        });
        $scope.hideDeleteDialog();
    };
       
});
app.controller('feedbackController', function($scope,serviceApi,$stateParams,$http,$state,$rootScope,ticketInfo) {
    if($rootScope.session!='0')
    {
        $scope.it='-1';
        $scope.keyword = null;
        // console.log('logged in');
        // console.log($rootScope.role);
        if($rootScope.role!="0"){
            $rootScope.admin=true;
        }
        else{
            $rootScope.admin=false;
        }
    }    
    if($rootScope.admin) {
        swal({
            title: "Error",
            text: "admin can't add feedback",
            icon: "error"
        })
        $state.go('Ticket',$rootScope.user_id);
    }
    $scope.ticketId = $stateParams.ticketId;
    $scope.userRating = 0;
    $scope.recommend = '';
    $scope.comments = '';
    $scope.ticketInfo = ticketInfo;
    // console.log($scope.ticketInfo);
    if($scope.ticketInfo.ticket.length == 0) {
        swal({
            title: "Error",
            text: "No ticket found",
            icon: "error"
        });
        $state.go('Ticket',$scope.user_id);
    }
    if($scope.ticketInfo.feedback.length > 0) {
        swal({
            title: "Error",
            text: "Feedback already submitted",
            icon: "error"
        });
        $state.go('Ticket',$scope.user_id);
    }
    if($scope.ticketInfo.ticket[0].status != 3) {
        swal({
            title: "Error",
            text: "Ticket is not resolved yet.",
            icon: "error"
        });
        $state.go('Ticket',$scope.user_id);
    }
    // $scope.getTicketInfo = function() {
    //     $http ({
    //         method: 'GET',
    //         url: 'getticket/getticketinfo/' + $scope.ticketId
    //     })
    //     .then(function(response) {
    //         $scope.ticketInfo = response.data;
            $scope.userid = $scope.ticketInfo.users[0].user_id;
            if( $rootScope.userid != $scope.userid ) {
                $state.go('Home');
            }
            else {
            $scope.subject = $scope.ticketInfo.ticket[0].subject;
            $scope.selectedAdmin = $scope.ticketInfo.ticket[0].assigned_to;
            $scope.adminName = $scope.ticketInfo.admin.find(admin => admin.user_id === $scope.selectedAdmin).name;
            $scope.updation_time= $scope.ticketInfo.ticket[0].updation_time;
            }
    //     });
    // }
    // $scope.getTicketInfo();

    $scope.rating = function(star) {
        $scope.star = star;
        $scope.ratingStars = document.querySelectorAll('.rating-star');
        for (var i = 0; i < $scope.ratingStars.length; i++) {
          $scope.starValue = parseInt($scope.ratingStars[i].getAttribute('data-value'));
          if ($scope.starValue <= star) {
            $scope.ratingStars[i].classList.add('checked');
          } else {
            $scope.ratingStars[i].classList.remove('checked');
          }
        }
        $scope.userRating = star;
    }

    $scope.submit = function() {
        var data = {
            rating: $scope.userRating,
            recommend: $scope.recommend,
            comments: $scope.comments,
            ticketId: $scope.ticketId
        }
        var postData = 'myData='+JSON.stringify(data);
        if(data.rating == 0) {
            $scope.errorrating = "Please enter a rating <br>";
            return false;
        }
        if(data.recommend == '') {
            $scope.errorsatisfactory = "Please answer this question <br>";
            return false;
        }  
      // TODO: submit the feedback to the server
      console.log({
        rating: $scope.userRating,
        recommend: $scope.recommend,
        comments: $scope.comments,
        ticketId: $scope.ticketId
      });
      serviceApi.userfeedback(postData).then(function(response){
        $scope.updateTicketStatus = function() {
            var data = {
                status: 5,
                ticketId: $scope.ticket_id
            };
            $http.post('getticket/updatestatus',data)
                .then(function(response) {         
                });
        }
        swal({
            title: "Feedback Submitted!",
            text: "Your Feedback has been submitted",
            icon: "success",

        });
      });
    };
});
app.controller('viewFeedback', function($scope,serviceApi,$stateParams,$http,$state,$rootScope,close) {
    $scope.closeModal = function() {
        close(); // close, but give 200ms for bootstrap to animate
    };
    $scope.ticketId = $stateParams.ticketId;
    $scope.userRating = 0;
    // $scope.recommend = '';
    $scope.comments = '';

    $scope.getTicketInfo = function() {
        $http ({
            method: 'GET',
            url: 'getticket/getticketinfo/' + $scope.ticketId
        })
        .then(function(response) {
            $scope.ticketInfo = response.data;
            console.log($scope.ticketInfo);
            $scope.userid = $scope.ticketInfo.users[0].user_id;
            console.log($rootScope.userid);
            console.log($rootScope.role);
            console.log($scope.userid)
            if($rootScope.userid != $scope.userid && $rootScope.role != 1) {
                $state.go('Ticket',$rootScope.userid);
            }
            else{
            // console.log($scope.ticketInfo);
            $scope.fsubject = $scope.ticketInfo.ticket[0].subject;
            $scope.selectedAdmin = $scope.ticketInfo.ticket[0].assigned_to;
            $scope.adminName = $scope.ticketInfo.admin.find(admin => admin.user_id === $scope.selectedAdmin).name;
            $scope.updation_time= $scope.ticketInfo.ticket[0].updation_time;
            $scope.submitted = $scope.ticketInfo.feedback[0].update_time;
            $scope.userRating = $scope.ticketInfo.feedback[0].rating;
            $scope.rating($scope.userRating);
            $scope.recommend = $scope.ticketInfo.feedback[0].satisfaction;
            $scope.comments = $scope.ticketInfo.feedback[0].comments;
            }
        });
    }
    $scope.getTicketInfo();

    $scope.rating = function(star) {
        $scope.star = star;
        $scope.ratingStars = document.querySelectorAll('.rating-star');
        for (var i = 0; i < $scope.ratingStars.length; i++) {
          $scope.starValue = parseInt($scope.ratingStars[i].getAttribute('data-value'));
          if ($scope.starValue <= star) {
            $scope.ratingStars[i].classList.add('checked');
          } else {
            $scope.ratingStars[i].classList.remove('checked');
          }
        }
        $scope.userRating = star;
    }
});
app.controller('editFeedback', function($scope, $http, $stateParams,$state,$rootScope,serviceApi,ticketInfo,$state) {
    if($rootScope.session!='0')
    {
        $scope.it='-1';
        $scope.keyword = null;
        // console.log('logged in');
        // console.log($rootScope.role);
        if($rootScope.role!="0"){
            $rootScope.admin=true;
        }
        else{
            $rootScope.admin=false;
        }
    }    
    if($rootScope.admin) {
        swal({
            title: "Error",
            text: "admin can't edit feedback",
            icon: "error"
        })
        $state.go('Ticket',$rootScope.user_id);
    }
        $scope.ticketId = $stateParams.ticketId;
        $scope.ticketInfo = ticketInfo;
        if($scope.ticketInfo.feedback.length ==  0) {
            swal({
                title: "No Feedback Found!",
                text: "No feedback found for this ticket or Your Ticket is not resolved",
                icon: "warning",
            });
            $state.go('Ticket',$rootScope.userid);
        }
        $scope.userid = $scope.ticketInfo.users[0].user_id;
        if( $rootScope.userid != $scope.userid ) {
             $state.go('Ticket',$rootScope.userid);
        }
        else {
            $scope.fsubject = $scope.ticketInfo.ticket[0].subject;
            $scope.selectedAdmin = $scope.ticketInfo.ticket[0].assigned_to;
            $scope.adminName = $scope.ticketInfo.admin.find(admin => admin.user_id === $scope.selectedAdmin).name;
            $scope.updation_time= $scope.ticketInfo.ticket[0].updation_time;
            $scope.submitted = $scope.ticketInfo.feedback[0].update_time;
            $scope.userRating = $scope.ticketInfo.feedback[0].rating;
            $scope.recommend = $scope.ticketInfo.feedback[0].satisfaction;
            $scope.comments = $scope.ticketInfo.feedback[0].comments;
        }

        //  Rating
        $scope.rating = function(star) {
            $scope.star = star;
            $scope.ratingStars = document.querySelectorAll('.rating-star');
            for (var i = 0; i < $scope.ratingStars.length; i++) {
              $scope.starValue = parseInt($scope.ratingStars[i].getAttribute('data-value'));
              if ($scope.starValue <= star) {
                $scope.ratingStars[i].classList.add('checked');
              } else {
                $scope.ratingStars[i].classList.remove('checked');
              }
            }
            $scope.userRating = star;
        }
        $scope.rating($scope.userRating);
    
        $scope.submit = function() {
            var data = {
                rating: $scope.userRating,
                recommend: $scope.recommend,
                comments: $scope.comments,
                ticketId: $scope.ticketId
            }
            var postData = 'myData='+JSON.stringify(data);
            if(data.rating == 0) {
                $scope.errorrating = "Please enter a rating <br>";
                return false;
            }
            if(data.recommend == '' || data.recommend == undefined) {
                $scope.errorsatisfactory = "Please answer this question <br>";
                return false;
            }  
          console.log({
            rating: $scope.userRating,
            recommend: $scope.recommend,
            comments: $scope.comments,
            ticketId: $scope.ticketId
          });
          serviceApi.editfeedback(postData).then(function(response){
            swal({
                title: "Feedback Submitted!",
                text: "Your Feedback has been submitted",
                icon: "success",
    
            });
            $state.go('viewTicket', { ticketId: $scope.ticketId });
          });
        };
});