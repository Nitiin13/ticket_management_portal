var app=angular.module("myApp", ["ui.router","ServiceModule","angularFileUpload","angularModalService"]);
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
          
           tickets: ['$stateParams', 'serviceApi', function ($stateParams, serviceApi)  {
                // $stateParams will contain any parameter defined in your url
                console.log($stateParams.userid);
               
                 var data1={
                    'userid':$stateParams.userid
                 }
                 var postData2 = 'myData1='+JSON.stringify(data1);
                
           return serviceApi.getTickets(postData2);
      
       
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
    .state('filter',{
        url:'/filter',
        templateUrl:'angular/templates/filter_modal.html',
        controller:'filterModalController',
        params: {
            filters_to_be_applied:null
        },
        resolve:{
         
            populate_data: ['serviceApi', function (serviceApi)  {
                 // $stateParams will contain any parameter defined in your url
                // serviceApi.populate_filter().then(function(response){
                //     return response.data;
                // },function(response){
            
                // });

                return serviceApi.populate_filter()
                
                
         }]}
    })
    .state('editTicket', {
        url:'/editticket',
        templateUrl:'angular/templates/editTicket.html',
        controller:'editticketController',
    })
    .state('viewTicket', {
        url:'/viewticket',
        templateUrl:'angular/templates/viewTicket.html',
        controller:'viewticketController',
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
                        console.log(response.data);
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
                // console.log("Passed captcha");
                var datap  = {
                    'email':$scope.email
                }
                var postData = 'myData='+JSON.stringify(datap);
                serviceApi.otp(postData).then(function(response){
                    console.log(response.data);
                        if(response.data.success==1){
                            datap.userid=response.data.data.userid;
                            $state.go('otp',datap);
                        }
                        else{
                            var snackbarContainer = document.querySelector('#demo-toast-example');
                            var data = {message: 'Email Does Not Exist'};
                            snackbarContainer.MaterialSnackbar.showSnackbar(data);
                            console.log(response.data);
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
                    console.log(response.data);
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
app.controller("ticketController",function($scope,tickets,$rootScope,$state,$window,serviceApi,ModalService,$stateParams){
   
    // if($rootScope.session!='0' || $rootScope.isLoggedIn!=null)
    if($rootScope.session!='0')
    {
        $scope.navigate=function(){
            $state.go('NewTicket');
        }
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
      if($stateParams.tickets_data==null){
        $scope.tickets=tickets.data;
      }
      else{
        $scope.tickets=$stateParams.tickets_data;
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
            id:0,name:'Open Tickets'
          },
        {
            id:1,name:'Closed Tickets'
        }];
        $scope.sort=[{
            id:-1,name:'None'
          },{
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
                            var snackbarContainer = document.querySelector('#demo-toast-example');
                            var data = {message: 'Updated'};
                            snackbarContainer.MaterialSnackbar.showSnackbar(data);
                        }
                    },function(response){

                    });
                }
        
        $scope.sortby = function(id){
            console.log(id);
            if(id>-1){
                $scope.filters_to_be_applied.sortby= id;
                $scope.tickets = '';
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }
            else{
                $scope.tickets = '';
                delete $scope.filters_to_be_applied.sortby;
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }

        }
        $scope.status_filter = function(id){
            console.log(id);
            
            if(id>-1){
                $scope.filters_to_be_applied.status = id;
                $scope.tickets = '';
                // var filter_tickets={
                //     'sortby':id
                // }
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }
            else{
                $scope.tickets = '';
                delete $scope.filters_to_be_applied.status;
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }

        }
        $scope.search = function(keyword){
            if(keyword!=null && keyword!=''){
                // console.log('Inside if ');
                $scope.filters_to_be_applied.keyword = keyword;
                $scope.tickets = '';
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }
            else{
                // console.log('Inside else ');
                $scope.tickets = '';
                delete $scope.filters_to_be_applied.keyword;
                var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
                serviceApi.filter_tickets(filter_data).then(function(response){
                    $scope.tickets=response.data;
                },function(response){

                });
            }
        }
        $scope.filtermodal = function(){
            console.log('Here');
            $state.go('filter',{'filters_to_be_applied':$scope.filters_to_be_applied});
            // ModalService.showModal({
            //     // templateUrl: "angular/templates/filter_modal.html",
            //     template:'<div class="modal" role="dialog" aria-hidden="true" >\
            //     <div class="modal__dialog style="maximize-width">\
            //     <div class="modal-invisible-class" ng-click="close($event)"></div>\
            //     <div class="modal__content adjust-modal-small modal__below_header mdl-shadow--2dp border-radius-4" style="padding: 0px; max-width: 600px;">\
            //                                                     <div>here</div>\
            //                                     </div>\
            //     </div>\
            //     </div>\
            //     </div>\
            //     </div>',
            //     controller: "filterModalController"
            //   }).then(function(modal) {
            //     // The modal object has the element built, if this is a bootstrap modal
            //     // you can call 'modal' to show it, if it's a custom modal just show or hide
            //     // it as you need to.
            //     // modal.element.modal();
            //     modal.close.then(function(result) {
            //       $scope.message = result ? "You said Yes" : "You said No";
            //     });
            //   });
        }
       
    }else{
        $state.go('Home');
    }
});

app.controller('filterModalController',function($scope,serviceApi,populate_data,$state,$stateParams){
    // $scope.dismissModal = function(result) {
    //     close(result, 200); // close, but give 200ms for bootstrap to animate
    // };
    console.log('Inside');
    $scope.discardfilter = function()
    {
        $scope.filters_to_be_applied = {};

        $scope.pr = "-1";
        $scope.ap = "-1";
        $scope.st = "-1";
        $scope.ind = "-1";
        $scope.at = "-1";
        $scope.email='';
        $scope.account_number='';
        $scope.ticket_owner='';
        
    }

    $scope.assigned_to = populate_data.data.assigned_to;
    if($stateParams.filters_to_be_applied!=null) {
        console.log($stateParams.filters_to_be_applied);
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
    $scope.internal_department = [
        { id: 0, name: 'none' },
        { id: 1, name: 'option1' },
        { id: 2, name: 'option2' },
        { id: 3, name: 'option3' }
    ]
    $scope.assistance_process = [
        { id: 0, name: 'none' },
        { id: 1, name: 'option1' },
        { id: 2, name: 'option2' },
        { id: 3, name: 'option3' }
    ]

    $scope.submitfilter = function(){
        console.log($scope.pr);
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
        var filter_data = 'myData='+JSON.stringify($scope.filters_to_be_applied);
        serviceApi.filter_tickets(filter_data).then(function(response){
            // $scope.tickets=response.data;
            // console.log(response.data);
            
            $state.go('Ticket',{'tickets_data':response.data,'filters_to_be_applied':$scope.filters_to_be_applied});
        },function(response){

        });
    }
    
});
app.controller("editticketController", function($scope, $http, FileUploader,$rootScope,$state, serviceApi){
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
    $scope.getTicketInfo = function() {
        $http ({
            method: 'GET',
            url: 'getticket'
        })
        .then(function(response) {
            $scope.ticketInfo = response.data;
            $scope.user = $scope.ticketInfo.users[0];
            $scope.ticket_id = $scope.ticketInfo.ticket[0].ticket_id;
            $scope.selectedAdmin = $scope.ticketInfo.ticket[0].assigned_to;
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
            $scope.statusOption = [
                { id: '0' , name: 'to be reviewed' },
                { id: '1' , name: 'In progress' },
                { id: '2' , name: 'on hold' },
                { id: '3' , name:'resolved'},
                { id: '4', name:'dropped'},
                { id : '5', name:'resolved and closed'}
            ];
            for (var i = 0; i < $scope.statusOption.length; i++) {
                if ($scope.statusOption[i].id === $scope.status_id) {
                $scope.selectedStatus = $scope.statusOption[i].id;
                break;
                }
            }
            // ASSISTANCE PROCESS
            $scope.process_id = $scope.ticketInfo.ticket[0].assistance_process;
            $scope.assistantProcess = [
                { id: '0', name: 'Tech Assistant' },
                { id: '1', name: 'Finance Assistant' },
                { id: '2', name: 'proces 3' }
            ];
            for (var i = 0; i < $scope.assistantProcess.length; i++) {
                if ($scope.assistantProcess[i].id === $scope.process_id) {
                $scope.selectedProcess = $scope.assistantProcess[i].id;
                break;
                }
            }
            // PRIORITY
            $scope.priorityOption = [
                { id: '0', name: 'none' },
                { id: '1', name: 'Low' },
                { id: '2', name: 'Medium' },
                { id: '3', name: 'High' },
            ];
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
        }, function(reason) {
            $scope.error = reason.data;
        })
    }
    $scope.getTicketInfo();
        
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
            uploader.uploadAll();    }
            else {            
            $state.go('Ticket',{'userid':$rootScope.userid});              
            }
            }
            else if(response.data['error']==true){
                var snackbarContainer = document.querySelector('#demo-toast-example');
                var data = {message: 'Failed to edit ticket'};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            }       
        },function(response){
        
        });
    }
    else{
        $scope.reqerror=true;
        uploader.clearQueue();
    }
    }

});
app.controller("newticketController",function($scope,FileUploader,$rootScope,serviceApi,$state,$http){
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
    console.log(formdata);
   
   
    
    var ticket_data = 'myData3='+JSON.stringify(formdata);
    serviceApi.addTicket(ticket_data).then(function(response){
        if(response.data['error']==false)
        {
            $scope.ticket_id=response.data['ticket_id'];
            formdata={
                'ticketid':$scope.ticket_id,
            }
            uploader['formData']=JSON.stringify(formdata);
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
app.controller("viewticketController",function($scope,$http,FileUploader) {
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
    $scope.getTicketInfo = function() {
        $http ({
            method: 'GET',
            url: 'getticket'
        })
        .then(function(response) {
            $scope.ticketInfo = response.data;
            $scope.user = $scope.ticketInfo.users[0];
            $scope.ticket_id = $scope.ticketInfo.ticket[0].ticket_id;
            if($scope.ticketInfo.feedback.length > 0) {
                $scope.feedback = 'TRUE';
            }
            // ASSIGNED TO
            $scope.selectedAdmin = $scope.ticketInfo.ticket[0].assigned_to;
            $scope.adminName = $scope.ticketInfo.admin.find(admin => admin.user_id === $scope.selectedAdmin).name;
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
            // TAGS
            $scope.tagNames = $scope.ticketInfo.tags.map(function(tag) {
                return tag.tag_name;
            });;
            // ATTACHMENTS
            $scope.files = $scope.ticketInfo.attachments.map(function(file) {
                return file.attachment;
            });
        }, function(reason) {
            $scope.error = reason.data;
        })
    }
    $scope.getTicketInfo();
    $scope.updateTicketStatus = function() {
        var data = {
            status: $scope.selectedStatus,
            ticketId: $scope.ticket_id
        };
        $http.post('getticket/updatestatus',data)
            .then(function(response) {
                swal({
                    title: "Ticket Status Updated!",
                    text: "The ticket status has been updated successfully.",
                    icon: "success",

                });
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
       
});