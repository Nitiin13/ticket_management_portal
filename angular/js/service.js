var serviceModule=angular.module("ServiceModule",[]);
serviceModule.factory('serviceApi',function($http,$rootScope){
    var serviceApi = {};
    baseUrl="http://localhost/TMS/"
    serviceApi.signup=function(data){
        var request =$http({
            method:'POST',
            url:baseUrl+'auth/customer_signup',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        });
        
        return request;
    }
    serviceApi.otp=function(data){
        var request =$http({
                method: 'POST',
                url : 'auth/send_otp',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            });
        
        return request;

    }
    serviceApi.resetpassword=function(data){
        var request =$http({
                method: 'POST',
                url : 'auth/reset_password',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            });
        
        return request;

    }
    // serviceApi.check_email=function(data){
    //     var request =$http({
    //         method:'POST',
    //         url:baseUrl+'auth/check_email',
    //         headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    //         data:data
    //     });
        
    //     return request;
    // }
    return serviceApi;}
    );