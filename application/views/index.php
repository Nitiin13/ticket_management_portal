<html ng-app="myApp">
    <head>
        <title>Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script>
             window.session="<?php echo $session;?>";
  window.userid="<?php echo $user; ?>";
window.user_role="<?php echo $role;?>";
window.user_name="<?php echo $name;?>";
  window.mini_user_id="<?php echo $mini_user_id; ?>";
window.mini_user_email="<?php echo $mini_user_email;?>";
 </script>    
 <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.2/angular-ui-router.min.js"></script>
 <base href="http://localhost/TMS/">
 <script src="angular/js/service.js"></script>       
<script src="angular/js/script.js"></script> 
<!-- <script src="angular/library/angular-modal-service.js"></script>  -->
<script src="angular/node_modules/angular-modal-service/dst/angular-modal-service.min.js"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
<script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
<link href='https://fonts.googleapis.com/css?family=Open Sans' rel='stylesheet'>
<!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /> -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" href="angular/css/dashboard_view.css">
<link rel="stylesheet" href="angular/css/signin.css">
<link rel="stylesheet" href="angular/css/filter_modal.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<!-- <link rel="stylesheet" href="angular/css/login-page.css">
 <link rel="stylesheet" href="angular/css/nav.css">
 <link rel="stylesheet" href="angular/css/register.css">
 <link rel="stylesheet" href="angular/css/ticket_portal.css"> -->

 <link rel="stylesheet" href="./css/style.css">
        </head>
        <body ng-app="myApp" >
            <header>
                <div class="" >
            <header class="mdl-layout__header mdl-layout--large-screen-only">
                <div class="mdl-layout__header-row">
                <!-- Title -->
                <span class="mdl-layout-title">NAV</span>
                <!-- Add spacer, to align navigation to the right -->
                <div class="mdl-layout-spacer"></div>
                <!-- Navigation. We hide it in small screens. -->
                </div>
            </header>
            </div>
            </header>
            <ui-view></ui-view>
            <!-- <footer>Something</footer> -->
        </body>
</html>