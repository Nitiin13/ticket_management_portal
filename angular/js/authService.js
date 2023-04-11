// app.factory('authService', function($window) {
//     var session = {
//       isLoggedIn: function() {
//         return $window.sessionStorage.getItem('isLoggedin') === 'true';
//       },
//       setSessionVariables: function(userData) {
//         $window.sessionStorage.setItem('isLoggedin', true);
//         $window.sessionStorage.setItem('userid', userData.user_id);
//         $window.sessionStorage.setItem('user_role', userData.user_role);
//         $window.sessionStorage.setItem('user_name', userData.user_name);
//         $window.sessionStorage.setItem('user_email', userData.user_email);
//       },
//       clearSessionVariables: function() {
//         $window.sessionStorage.removeItem('isLoggedin');
//         $window.sessionStorage.removeItem('userid');
//         $window.sessionStorage.removeItem('user_role');
//         $window.sessionStorage.removeItem('user_name');
//         $window.sessionStorage.removeItem('user_email');
//       }
//     };
//     return session;
//   });
  