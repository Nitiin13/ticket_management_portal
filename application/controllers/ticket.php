<?php 
 class Ticket extends CI_Controller{
   public  function __construct()
   {
      parent::__construct();
      $this->load->model('user_model');
      
   }
   public function filter_tickets()
   {
      if($_POST['myData']){

         $role=$this->session->userdata("ses_role");
         if($role=="0")
         {
            $userid = $this->session->userdata("ses_id");
            $myData = json_decode($_POST['myData']);
            // echo $sortby;
            $data = $this->user_model->filter_ticket($myData,$userid);
            $this->output->set_content_type('application/json')->set_output(json_encode($data)); 
      
            
         }
         else{
            $userid=false;
            $myData = json_decode($_POST['myData']);
            // echo $sortby;
            $data = $this->user_model->filter_ticket($myData,$userid);
            $this->output->set_content_type('application/json')->set_output(json_encode($data)); 
      
         }


         
         // echo "Inside";
         
     }
   }
   public function populate_filter()
   {
      $data = $this->user_model->populate_filter();
      echo json_encode($data);
      // $this->output->set_content_type('application/json')->set_output(json_encode($data)); 
   }
}