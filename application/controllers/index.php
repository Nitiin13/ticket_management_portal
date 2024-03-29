<?php 
 class Index extends CI_Controller{
    public  function __construct()
    {
       parent::__construct();
       $this->load->helper('cookie');
       $this->load->model('auth_model');
   }
    public function index(){
        $mini_ses_id=$this->session->userdata("mini_ses_id");
       
        if($mini_ses_id!=null)
        {
            $data['mini_user_id']=$mini_ses_id;
            $data['mini_user_email']=$this->session->userdata("mini_ses_email");
        }
        else {
            $data['mini_user_id']=null;
            $data['mini_user_email']=null;
        }

        $ses_id=$this->session->userdata("ses_id");
        $ses_role=$this->session->userdata("ses_role");
        $ses_name=$this->session->userdata("ses_name");
         $ses_email=$this->session->userdata("ses_email");   
            // $is_login=$this->input->cookie("login",true);
            $id_auth=$this->input->cookie("login",true);
            $token=$this->input->cookie($id_auth,true);
            if($token)
            {
                // var_dump('checking existing');
                
                $user_id=$this->auth_model->get_token($token,$id_auth);
              
                    if($user_id!=null)
                    {
                        foreach($user_id as $user)
                        {
                            $u_id=$user['user_id'];
                           
                        }
                        require_once(APPPATH.'controllers/auth.php');
                        // var_dump($u_id);  
                       
                        //include controller
                        $auth=new Auth();
                    //   $data['role']=$role;
                      $a=$auth->start_Session($u_id);
                    //   var_dump($a);
                      $role=$a["ses_role"];
                        $name=$a["ses_name"];
                        $email=$a['ses_email'];
                      $data['user']=$u_id; 
                      $data['role']=$role;
                      $data['name']=$name;
                      $data['email']=$email;
                        $data['session']='1';
                        // var_dump()
                    }
                    else{
                        $data['user']=null;
                        $data['session']='0';
                        $data['role']=null;
                        $data['name']=null;
                        $data['email']=null;
                    }
            }
            else 
            {
                if($ses_id!=null)
                {
                $data['user']=$ses_id;
                $data['role']=$ses_role;
                $data['name']=$ses_name;
             $data['session']='1';
             $data['email']=$ses_email;
          
            }
            else{
                $data['user']=null;
            $data['session']='0';
            $data['role']=null;
            $data['name']=null;
            $data['email']=null;
            }
        }
        $this->load->view('index',$data);
    }
}