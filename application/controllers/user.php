<?php 
 class User extends CI_Controller{
    public  function __construct()
    {
       parent::__construct();
       $this->load->model('user_model');
       
    }
    public function getTickets()
    {
      $myData = json_decode($_POST["myData1"]);
      $userid = $myData->userid;
      $role=$this->session->userdata("ses_role");
     if($role=="0")
     {
      $tickets= $this->user_model->getTickets($userid);
   
     }
     else{
      $userid=false;
      $tickets=$this->user_model->getTickets($userid);
   
     }
            $this->output->set_content_type('application/json')->set_output(json_encode($tickets)); 
      
    }
    public function update_ticket_status()
    {
      $myData = json_decode($_POST["myData2"]);
      
      $status = $myData->status;
      $ticket_id=$myData->ticket;
      if($this->user_model->update_ticket_status($status,$ticket_id))
      {
         echo true;
      }
      else{
         echo false;
      }
     
    }
   }