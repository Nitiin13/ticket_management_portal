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
    
    public function add_Ticket()
    {
    
      $myData=json_decode($_POST["myData3"]);
      $subject=$myData->subject;
      $desc=$myData->description;
      $accno=$myData->accountno;
      $userid=$this->session->userdata("ses_id");
      $attachment=$myData->attachments;
      if($subject!='' && $desc!='')
      {
      if($attachment==false)
      {
        $ticket_id=$this->user_model->add_new_ticket($subject,$desc,$accno,$userid);
    if($ticket_id)
      {
         $add_status=array('error'=>false);
         $this->output->set_content_type('application/json')->set_output(json_encode($add_status)); 
      }
      else{
         $add_status=array('error'=>true);
         $this->output->set_content_type('application/json')->set_output(json_encode($add_status)); 
      }  
      }
      else{
         $ticket_id=$this->user_model->add_new_ticket($subject,$desc,$accno,$userid);
         if($ticket_id)
         {
         
            $add_status=array('ticket_id'=>$ticket_id,'error'=>false);
            
            $this->output->set_content_type('application/json')->set_output(json_encode($add_status)); 
         }
         else{
            $add_status=array('error'=>true);
            $this->output->set_content_type('application/json')->set_output(json_encode($add_status)); 
         } 
      }
   }
   else{
      $add_status=array('error'=>true);
            $this->output->set_content_type('application/json')->set_output(json_encode($add_status));
   }
      

            
    
   }
   public function user_image_upload()
{ 
  

   if($_GET['ticketid'])
   {
      $ticket_id=$_GET['ticketid'];
      $new_name = date('Y-m-d') . '-' . $_FILES['file']['name'];
      $type=0;
      if($this->user_model->upload_image($ticket_id,$type,$new_name))
      {
         $_FILES['file']['name'] = $new_name;
         $config['file_name']=$new_name;
        $config['upload_path']= './uploads/';
        $config['allowed_types']= 'gif|jpg|png';
        $config['max_size']=41943040;
      //   $config['encrypt_name']  = TRUE;
        
    
      //   $this->load->library('upload', $config);
    
        $this->upload->initialize($config);
    
        if ( ! $this->upload->do_upload('file') )
        {
            // $json = array('error' => true, 'message' => $this->upload->display_errors());
            return false;
        }
        else
        {
          
            $upload_details = $this->upload->data();
     
            return true;
            // $json = array('success' => true, 'message' => 'File transfer completed', 'newfilename' => $upload_details['file_name']);
         
         }
        return true;
      }
      else{
          return false;
      }
    
   //  $new_name = date('Y-m-d') . '-' . $_FILES['file']['name'];
    
   
    
}
else{
   return false;
}

   }
} 