<?php 
 class User_model extends CI_Model{
    public  function __construct()
    {
       parent::__construct();
       $this->load->database();
    }
    public function get_Admins($userid){
       $this->db->select('users.name');
       $this->db->from('users');
       $this->db->where('user_id', $userid);
       $query=$this->db->get();
       if($query->num_rows>0)
       {
         $results=$query->result_array();
         return $results;
       }
       else{
         return false;
       }

    }
    public function getTickets($userId){
      if($userId==false)
      {
         $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,a.name as user_name,b.name as admin_name');
$this->db->from('tickets');
$this->db->join('users as a', 'a.user_id = tickets.user_id');
$this->db->join('users as b','tickets.assigned_to=b.user_id');
$this->db->limit(10);
$query=$this->db->get();
         
         if($query->num_rows>0)
         {
           
            $results=$query->result_array();
      
				return $results;
         }
         else{
            return false;
         }
      }
      else{
         $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,users.name');
$this->db->from('tickets');
$this->db->join('users','users.user_id=tickets.assigned_to');
$this->db->where('tickets.user_id',$userId);
$this->db->limit(10);
 $query=$this->db->get();        
                  
      if($query->num_rows>0)
      {
         $results=$query->result_array();
				return $results;
      }
      else
      {
         return false;
      }
    }
   }
   public function update_ticket_status($status,$ticket_id)
   {
      $data=array(
         'status'=>$status
      );
      $this->db->where('ticket_id', $ticket_id);
      $query=$this->db->update('tickets', $data);
      if($query)
      {
         return true;
      }
      else{
         return false;
      }
   }
   public function add_new_ticket($subject,$desc,$accno,$userid)
   {
      $data=array(
         'subject'=>$subject,
         'description'=>$desc,
         'account_number'=>$accno,
         'user_id'=>$userid
      );
     $query=$this->db->insert('tickets',$data);
      if($query)
      {
         return $this->db->insert_id();
      }
      else{
         return false;
      }
   }
   public function upload_image($ticketid,$type,$image)
   {
      $data=array(
         'ref_id'=>$ticketid,
         'type'=>$type,
         'attachment'=>$image
      );
      $query=$this->db->insert('attachment',$data);
      if($query)
      {
         return true;
      }
      else{
         return false;
      }
   }
}