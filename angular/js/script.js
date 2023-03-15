var app=angular.module("myApp", ["ui.router","ServiceModule"]);
app.run(function ($rootScope,$timeout,$window) {
    $rootScope.session=$window.session;
                    $rootScope.isLoggedIn=null;
                    $rootScope.userid=$window.user;
                    $rootScope.role=$window.user_role;
                    $rootScope.name=$window.user_name;
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
        templateUrl:'angular/templates/register.html',
        controller:'signupController'
    }).state('Ticket',{
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
        controller:'logoutController'
    })
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
                
                $rootScope.isLoggedIn=null;
               $rootScope.userid=null;
                $state.go('Home');
            }
            
        },function(response){

            return false;
        })
    }


    
});
app.controller('loginController',function($scope,serviceApi,$rootScope,$window,$state){

if(($rootScope.session!='0' && $rootScope.session!=undefined && $rootScope.session!=null)|| ($rootScope.isLoggedIn!=null && $rootScope.isLoggedIn!=undefined))
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
    $rootScope.isLoggedIn = null;
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
                    $rootScope.isLoggedIn=true;
                    $rootScope.userid=user_info['user_id'];
                    $rootScope.role=user_info['role'];
                    console.log($rootScope.role);
                    $rootScope.name=user_info['name'];
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
   
    if($rootScope.session!='0' || $rootScope.isLoggedIn!=null)
    {
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