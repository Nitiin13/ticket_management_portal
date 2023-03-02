<html ng-app="myApp">
    <head>
        <title>Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.2/angular-ui-router.min.js"></script>
<script src="angular/js/service.js"></script>
<script src="angular/js/script.js"></script> 
 <!-- <link rel="stylesheet" href="angular/css/login-page.css">
 <link rel="stylesheet" href="angular/css/nav.css">
 <link rel="stylesheet" href="angular/css/register.css">
 <link rel="stylesheet" href="angular/css/ticket_portal.css"> -->
 <base href="http://localhost/TMS/">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        </head>
        <body >
            <header>
                <div class="navbar">
                    <div class="logo-container"></div>
                    <div class="nav-links">
                    <!-- <ul class="navbar-nav"> -->
                    <a ui-sref="Home">Home</a>
                    <a ui-sref="#about">About</a>
                    <a ui-sref="#portfolio">Portfolio</a>
                    <a ui-sref="SignUp">SignUp</a>
                    <a ui-sref="Logout">Logout</a>
                    <!-- </ul> -->
                </div>
            </div>
            </header>
            <ui-view></ui-view>
            <!-- <footer>Something</footer> -->
        </body>
</html>