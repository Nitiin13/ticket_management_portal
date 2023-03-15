<?php 
 class Auth extends CI_Controller{
    public  function __construct()
    {
       parent::__construct();
       $this->load->model('auth_model');
    }
    public function start_Session($user_id)
    {
      $user_array=$this->auth_model->getUserDetails($user_id);
      foreach($user_array as $user)
      {
          $user_id=$user['user_id'];
          $user_email=$user['email'];
          $user_role=$user['role'];
          $user_name=$user['name'];
      }
      $session_array=array(
         'ses_id'=>$user_id,
         'ses_email'=>$user_email,
         'ses_name'=>$user_name,
         'ses_role'=>$user_role);
      $this->session->set_userdata($session_array);
         return $session_array;
      
    }
    function logout()
    {
      $this->load->helper('cookie');
      $u_id=$this->session->userdata('ses_id');
      if($this->input->cookie('login'))
      {
         $cid=$this->input->cookie('login');
            if($cid==$u_id)
            {
               $token =$this->input->cookie($cid);
               delete_cookie($cid);
               delete_cookie('login');
               $this->auth_model->update_token($cid,$token);
            }
            $this->session->unset_userdata('ses_id');
            $this->session->unset_userdata();
            $this->session->sess_destroy();
            echo true;
      }
      else{
         $this->session->unset_userdata();
         $this->session->sess_destroy();
         echo true;
      }
    
      
    }
      function getRandomStringRand($length = 16)
      {
         $stringSpace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
         $stringLength = strlen($stringSpace);
         $randomString = '';
         for ($i = 0; $i < $length; $i ++) {
            $randomString = $randomString . $stringSpace[rand(0, $stringLength - 1)];
         }
         return $randomString;
      }
    public function login(){
      $myData = json_decode($_POST['myData']);
      
        $email = $myData->email;
        $pass = $myData->pass;
        $rememberme=$myData->rememberme;
     
      if($email!='' && $pass!='' )
      {
      if($this->auth_model->check_email($email))
      {
         
         if($this->auth_model->checkCred($email,$pass))
         {
            $user_array=$this->auth_model->checkCred($email,$pass);
            foreach($user_array as $user)
            {
               $user_id=$user['user_id'];
               $name=$user['name'];
               $role=$user['role'];
               $email=$user['email'];
            }
            $req_info=array(
               'user_id' => $user_id,
               'name' => $name,
               'role' => $role,
               'email' => $email,
               'error'=>false
            );
          
           
            if($rememberme==true)
            {
               $this->start_Session($user_id);
               $value=$this->getRandomStringRand();
               
               $cookie= array(
                  'name'   => 'login',
                  'value'  => $user_id,
                  'expire' => '259200'
              );
              $auth_cookie=array(
               'name'=>$user_id,
               'value'=>$value,
               'expire'=>'259200'
              );
               $this->input->set_cookie($cookie);
               $this->input->set_cookie($auth_cookie);
               $this->auth_model->set_usertokens($user_id,$value);
               $this->output->set_content_type('application/json')->set_output(json_encode($req_info));        
             
            }
            else
            {
               $this->start_Session($user_id);
               $this->output->set_content_type('application/json')->set_output(json_encode($req_info));    
               
            }
         }
         else{
            $req_info=array('error'=>true);
            $this->output->set_content_type('application/json')->set_output(json_encode($req_info)); 
         }
         
      }
      else{
         $req_info=array('error'=>true);
         $this->output->set_content_type('application/json')->set_output(json_encode($req_info)); 
      }
   }
   else{
      $req_info=array('error'=>true);
      $this->output->set_content_type('application/json')->set_output(json_encode($req_info));  
   }
    }
}