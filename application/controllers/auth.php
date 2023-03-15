<?php 
 class Auth extends CI_Controller{
    var $email;
    public  function __construct()
    {
       parent::__construct();
       $this->email = "example@example.com";
       
    }
    public function mini_start_Session($user_id)
    {
        $user_array = $this->auth_model->getUserDetails($user_id);
        foreach ($user_array as $user) {
            $user_id = $user['user_id'];
            $user_email = $user['email'];
            $user_name = $user['name'];
        }
        $session_array = array(
            'mini_ses_id' => $user_id,
            'mini_ses_email' => $user_email,
            'mini_ses_name' => $user_name
        );
        $this->session->set_userdata($session_array);
    }
    public function customer_signup()
    {
        $this->load->model('auth_model'); 
        if($_POST['myData']){

            $myData = json_decode($_POST['myData']);
            $c_email = $myData->email;
            $c_name = $myData->name;
            $c_pass = $myData->password;
            if($c_email && $c_name && $c_pass){
                
                $data = $this->auth_model->check_email($c_email);
                if($data){
                    $myObj = new stdClass();

                    $myObj->success = 0;
                    $myObj->data = null;

                    $myJSON = json_encode($myObj);
                    echo $myJSON;
                }
                else{
                    $hashed_password = md5($c_pass);
                    $id = $this->auth_model->customer_signup($c_name,$c_email,$hashed_password);
                    $myObj = new stdClass();

                    $myObj->success = 1;
                    $myObj->data = new stdClass();
                    $myObj->data->user_id = $id;
                    $myJSON = json_encode($myObj);
                    echo $myJSON; //Only True Condition
                }
            }
            else{
                $myObj = new stdClass();

                    $myObj->success = 0;
                    $myObj->data = null;

                    $myJSON = json_encode($myObj);
                    echo $myJSON;
            }
        }
        else{
            $myObj = new stdClass();

                    $myObj->success = 0;
                    $myObj->data = null;

                    $myJSON = json_encode($myObj);
                    echo $myJSON;
        }
    }
    public function check_email()
    {
        $this->load->model('auth_model');
        if($_POST['myData']){

            $myData = json_decode($_POST['myData']);
            $c_email = $myData->email;
            if($c_email){
                
                $data = $this->auth_model->check_email($c_email);
                if($data){
                    // echo TRUE;
                    $myObj = new stdClass();

                    $myObj->success = 1;
                    $myObj->data = null;

                    $myJSON = json_encode($myObj);
                    echo $myJSON;
                }
                else{
                    $myObj = new stdClass();

                    $myObj->success = 0;
                    $myObj->data = null;

                    $myJSON = json_encode($myObj);
                    echo $myJSON;
                }
            }
            else{
                echo FALSE;
            }
        }
        else{
            echo FALSE;
        

        }
    }
    public function send_otp()
    {
        $this->load->model('auth_model');
        if($_POST['myData']){

            $myData = json_decode($_POST['myData']);
            $c_email = $myData->email;
            if($c_email){
                
                $data = $this->auth_model->check_email($c_email);
                if($data){
                    // echo TRUE;
                    //Send Otp code here to user
                    $this->load->model('auth_model');
                    $data = $this->auth_model->get_otp($c_email);
        
                    $this->email = $c_email;
                    $data['email'] = $c_email;
                    $myObj = new stdClass();

                    $myObj->success = 1;
                    $myObj->data =null;
                    
                    $myJSON = json_encode($myObj);
                    echo $myJSON;
                    $this->mini_start_Session($data['id']);
                    $this->load->helper('sendotp');
                    email($data['name'],$c_email,$data['otp']);
                    
                }
                else{
                    $myObj = new stdClass();

                    $myObj->success = 0;
                    $myObj->data = null;

                    $myJSON = json_encode($myObj);
                    echo $myJSON;
                }
            }
            else{
                echo FALSE;
            }
        }
        else{
            echo FALSE;
        

        }
    }
    public function check_otp()
    {
        $this->load->model('auth_model');
        if($_POST['myData']){

            $myData = json_decode($_POST['myData']);
            $c_email = $myData->email;
            $otp = $myData->otp;
            if($c_email && $otp){
                
                $data = $this->auth_model->check_email($c_email);
                if($data){
                    // echo TRUE;
                    //Send Otp code here to user
                    $this->load->model('auth_model');
                    $data = $this->auth_model->check_otp($c_email,$otp);
                    
                    if($data){

                        $myObj = new stdClass();
    
                        $myObj->success = 1;
                        $myObj->data = null;
    
                        $myJSON = json_encode($myObj);
                        echo $myJSON;
                    }
                    else
                    {
                        $myObj = new stdClass();

                        $myObj->success = 0;
                        $myObj->data = null;

                        $myJSON = json_encode($myObj);
                        echo $myJSON;
                    }
                    
                }
                else{
                    $myObj = new stdClass();

                    $myObj->success = 0;
                    $myObj->data = null;

                    $myJSON = json_encode($myObj);
                    echo $myJSON;
                }
            }
            else{
                echo FALSE;
            }
        }
        else{
            echo FALSE;
        

        }
    }
    public function reset_password(){
        $this->load->model('auth_model');
        if($_POST['myData']){

            $myData = json_decode($_POST['myData']);
            $password = $myData->password;
            $email = $myData->email;
            if($password && $email)
            {
                $password = md5($password);
                if($this->auth_model->resetpassword($email,$password)){

                    $myObj = new stdClass();
        
                    $myObj->success = 1;
                    $myObj->data = null;
    
                    $myJSON = json_encode($myObj);
                    echo $myJSON;
                }
                else{
                    $myObj = new stdClass();

                    $myObj->success = 0;
                    $myObj->data = null;

                    $myJSON = json_encode($myObj);
                    echo $myJSON;
                }
                
            }
            else
            {
                $myObj = new stdClass();

                $myObj->success = 0;
                $myObj->data = null;

                $myJSON = json_encode($myObj);
                echo $myJSON;
            }
        }
        else{
            $myObj = new stdClass();

            $myObj->success = 0;
            $myObj->data = null;

            $myJSON = json_encode($myObj);
            echo $myJSON;

        }

    }
    public function which_email(){
        $myObj = new stdClass();

        $myObj->success = 1;
        $myObj->data = new stdClass();
        $myObj->data->email = $data['email'];

        $myJSON = json_encode($myObj);
        echo $myJSON;
    }
    public function send_otp_test()
    {
        $c_email = 'test@example.com';
        $this->load->helper('sendotp');
        email('Gagan',$c_email,'234567');
    }
    public function get_otp_test()
    {
        $this->load->model('auth_model');
        $data = $this->auth_model->get_otp('thgagan007@gmail.com');
        var_dump($data) ;
    }
    function logout()
    {
         $this->session->unset_userdata();
         $this->session->sess_destroy();
         
    }
}
?>