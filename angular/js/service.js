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
    serviceApi.feedback=function(data){
        var request =$http({
                method: 'POST',
                url : 'getticket/send_feedback',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            });
        return request;
    }
    serviceApi.userfeedback=function(data){
        var request =$http({
                method: 'POST',
                url : 'getticket/get_feedback',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            });
        return request;
    }
    serviceApi.editfeedback=function(data){
        var request =$http({
                method: 'POST',
                url : 'getticket/edit_feedback',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            });
        return request;
    }
    serviceApi.deleteticket=function(data){
        var request =$http({
                method: 'POST',
                url : 'getticket/delete_ticket',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            });
        return request;
    }
    serviceApi.deletetickets=function(data){
        var request =$http({
                method: 'POST',
                url : 'getticket/delete_tickets',
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
            headers: {'Content-Type': 'application/json'},
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
    // serviceApi.filter_tickets_open_close=function(data)
    // {
    //     var filter=$http({
    //         method:'POST',
    //         url:'ticket/filter_ticket_open_close',
    //         headers: {'Content-Type': 'application/json'},
    //         data:data

    //     });
    //     return filter;
    // }
    serviceApi.getFilterData=function()
    {
        var filter=$http({
            method:'POST',
            url:'ticket/getFilterData',
            headers: {'Content-Type': 'application/json'},
        });
        return filter;
    }
    serviceApi.getDashboardData=function()
    {
        var filter=$http({
            method:'GET',
            url:'ticket/getDashboardData',
            headers: {'Content-Type': 'application/json'},
        });
        return filter;
    }
    serviceApi.getLineGraphData=function()
    {
        var filter=$http({
            method:'GET',
            url:'ticket/getLineGraphData',
            headers: {'Content-Type': 'application/json'},
        });
        return filter;
    }
    serviceApi.getBarGraphData=function()
    {
        var filter=$http({
            method:'GET',
            url:'ticket/getBarGraphData',
            headers: {'Content-Type': 'application/json'},
        });
        return filter;
    }
    serviceApi.getDashboardFilterData=function(data)
    {
        var filter=$http({
            method:'POST',
            url:'ticket/getDashboardFilterData',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        });
        return filter;
    }
    serviceApi.getLineGraphFilterData=function(data)
    {
        var filter=$http({
            method:'POST',
            url:'ticket/getLineGraphFilterData',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        });
        return filter;
    }
    serviceApi.getBarGraphFilterData=function(data)
    {
        var filter=$http({
            method:'POST',
            url:'ticket/getBarGraphFilterData',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        });
        return filter;
    }
    serviceApi.table_toExcel=function(id){
            var data = id;
            var excelFile = XLSX.utils.table_to_book(data, {sheet: "sheet1"});
            XLSX.write(excelFile, { bookType: 'xlsx', bookSST: true, type: 'base64' });
            XLSX.writeFile(excelFile, 'ExportedFile:TicketTableToExcel.' +"xlsx");
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