<?php 
 class Index extends CI_Controller{
    public  function __construct()
    {
       parent::__construct();
       $this->load->helper('cookie');
       $this->load->model('auth_model');
       $this->load->library('session');
   }
    public function index(){
        $mini_ses_id=$this->session->userdata("mini_ses_id");
       
        if($mini_ses_id!=null)
        {
            $data['user']=$mini_ses_id;
            $data['email']=$this->session->userdata("mini_ses_email");
        }
        else {
            $data['user']=null;
            $data['email']=null;
            
        }
        $this->load->view('index',$data);
    }
}