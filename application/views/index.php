<html ng-app="myApp">
    <head>
        <title>Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script>
  window.userid="<?php echo $user; ?>";
window.user_email="<?php echo $email;?>";
 </script>    
 <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.2/angular-ui-router.min.js"></script>

 <script src="angular/js/service.js"></script>       
<script src="angular/js/script.js"></script> 
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
<script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
<link href='https://fonts.googleapis.com/css?family=Open Sans' rel='stylesheet'>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
 <!-- <link rel="stylesheet" href="angular/css/login-page.css">
 <link rel="stylesheet" href="angular/css/nav.css">
 <link rel="stylesheet" href="angular/css/register.css">
 <link rel="stylesheet" href="angular/css/ticket_portal.css"> -->
 <base href="http://localhost/TMS/">
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