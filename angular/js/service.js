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
    serviceApi.startsession=function(data){
        var request =$http({
                method: 'POST',
                url : 'auth/start_Session_signup',
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
    serviceApi.getTags = function() {
        return $http({
            method: 'GET',
            url: 'tags'
        })
        .then(function(response) {
            return response.data;
        });
    };
    serviceApi.checkLogin=function(data){
        var request =$http({
            method:'POST',
            url:baseUrl+'auth/login',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        });
       
        return request;
    }
    serviceApi.logout=function(){
        var  logoutrequest=$http({
            method: 'POST',
            url: baseUrl+'auth/logout',
           
        });
        return logoutrequest;           
    }
    serviceApi.getTickets=function(data){
        
        var ticketrequest=$http({
            method:'POST',
            url: baseUrl+'user/getTickets',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        });
        return ticketrequest;

    }
    serviceApi.update_status=function(data)
    {
        var status=$http({
            method:'POST',
            url:baseUrl+'user/update_ticket_status',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data

        });
        return status;
    }
    serviceApi.addTicket=function(data){
        var ticket=$http({
            method:'POST',
            url:baseUrl+'user/add_Ticket',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            data:data
        });
        return ticket;
    }
    serviceApi.editTicket=function(data){
        var ticket=$http({
            method:'POST',
            url:baseUrl+'user/edit_Ticket',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            data:data
        });
        return ticket;
    }
    serviceApi.updateTicketStatut=function(data){
        var status=$http({
            method:'POST',
            url:baseUrl+'/getticket/updatetstatus',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            data:data
        });
        return status;
    }
    serviceApi.filter_tickets=function(data)
    {
        var filter=$http({
            method:'POST',
            url:'ticket/filter_tickets',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data

        });
        return filter;
    }
    serviceApi.populate_filter=function()
    {
        var populate=$http({
            method:'POST',
            url:'ticket/populate_filter',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        return populate;
    }
    return serviceApi;}
);
serviceModule.service('tagService', function($http) {
    this.getTags = function() {
      return $http ({
        method: 'GET',
        url: 'tags'
      });
    }
});