<?php
class User_model extends CI_Model
{
   public  function __construct()
   {
      parent::__construct();
      $this->load->database();
   }
   public function get_Admins($userid)
   {
      $this->db->select('users.name');
      $this->db->from('users');
      $this->db->where('user_id', $userid);
      $query = $this->db->get();
      if ($query->num_rows > 0) {
         $results = $query->result_array();
         return $results;
      } else {
         return false;
      }
   }
   public function filter_ticket($myData,$userid)
   {
      
      if($userid!=false)
      {
         $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,users.name');
         $this->db->from('tickets');
         $this->db->join('users', 'users.user_id=tickets.assigned_to');
         $this->db->where('tickets.user_id', $userid);
      }
      else{
         $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,a.name as user_name,b.name as admin_name');
         $this->db->from('tickets');
         $this->db->join('users as a', 'a.user_id = tickets.user_id');
         $this->db->join('users as b', 'tickets.assigned_to=b.user_id');
         
      }

      if(property_exists($myData,'status')){
         $this->db->where('tickets.status', $myData->status);
      }
      
      if(property_exists($myData,'keyword')){
         $where= "tickets.subject LIKE '%".$myData->keyword."%' OR tickets.ticket_id= '".$myData->keyword."'";
         // $this->db->or_like('tickets.subject', $myData->keyword);
         $this->db->where($where);
      }
      if(property_exists($myData,'priority')){
         $this->db->where('tickets.priority', $myData->priority);
      }
      if(property_exists($myData,'assistance_process')){
         $this->db->where('tickets.assistance_process', $myData->assistance_process);
      }
      if(property_exists($myData,'internal_department')){
         $this->db->where('tickets.internal_department', $myData->internal_department);
      }
      if(property_exists($myData,'assigned_to')){
         $this->db->where('tickets.assigned_to', $myData->assigned_to);
      }
      if(property_exists($myData,'email')){
         $this->db->where('a.email', $myData->email);
      }
      if(property_exists($myData,'account_number')){
         $this->db->where('tickets.account_number', $myData->account_number);
      }
      if(property_exists($myData,'ticket_owner')){
         $this->db->like('a.name', $myData->ticket_owner);
      }
      
      if(property_exists($myData,'sortby')){

         if($myData->sortby==0)
         {
            $this->db->order_by("tickets.genration_time", "desc");
         }
         else{
            $this->db->order_by("tickets.updation_time", "desc");
         }
      }
      
      $this->db->limit(10);
      $query = $this->db->get();

      if ($query->num_rows > 0) {
         $results = $query->result_array();
         return $results;
      } else {
         return false;
         // return $this->db->last_query();
      }

   }
   public function populate_filter()
   {
      $this->db->select('users.user_id,users.name');
      $this->db->distinct('users.user_id');
      $this->db->from('users');
      $this->db->join('tickets','tickets.assigned_to=users.user_id');
      $query = $this->db->get();
      $assigned_to = $query->result_array();
      // return $assigned_to;
      // $this->db->select('users.user_id,users.name');
      // $this->db->distinct('users.user_id');
      // $this->db->from('users');
      // $this->db->join('tickets','tickets.user_id=users.user_id');
      // $query = $this->db->get();
      // $ticket_owner = $query->result_array();

      // $this->db->select('tickets.assistance_process');
      // $this->db->distinct('tickets.assistance_process');
      // $this->db->from('tickets');
      // $query = $this->db->get();
      // $assistance_process = $query->result_array();

      // $this->db->select('tickets.internal_department');
      // $this->db->distinct('tickets.internal_department');
      // $this->db->from('tickets');
      // $query = $this->db->get();
      // $internal_department = $query->result_array();
      // foreach ($internal_department as $i){
         
      // }

      $data = new stdClass();
      // $data->assistance_process = $assistance_process;
      // $data->internal_department = $internal_department;
      $data->assigned_to = $assigned_to;
      // $data->ticket_owner = $ticket_owner;

      return $data;
   }
   public function getTickets($userId)
   {
      if ($userId == false) {
         $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,a.name as user_name,b.name as admin_name');
         $this->db->from('tickets');
         $this->db->join('users as a', 'a.user_id = tickets.user_id');
         $this->db->join('users as b', 'tickets.assigned_to=b.user_id');
         $this->db->limit(10);
         $query = $this->db->get();

         if ($query->num_rows > 0) {

            $results = $query->result_array();

            return $results;
         } else {
            return false;
         }
      } else {
         $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,users.name');
         $this->db->from('tickets');
         $this->db->join('users', 'users.user_id=tickets.assigned_to');
         $this->db->where('tickets.user_id', $userId);
         $this->db->limit(10);
         $query = $this->db->get();

         if ($query->num_rows > 0) {
            $results = $query->result_array();
            return $results;
         } else {
            return false;
         }
      }
   }
   public function update_ticket_status($status, $ticket_id)
   {
      $data = array(
         'status' => $status
      );
      $this->db->where('ticket_id', $ticket_id);
      $query = $this->db->update('tickets', $data);
      if ($query) {
         return true;
      } else {
         return false;
      }
   }
   public function add_new_ticket($subject,$desc,$userid,$tags)
   {
      $data=array(
         'subject'=>$subject,
         'description'=>$desc,
         // 'account_number'=>$accno,
         'user_id'=>$userid
      );
      $query=$this->db->insert('tickets',$data);
      if($query)
      {
         $ticket_id = $this->db->insert_id();
         $this->addTags($ticket_id,$tags);
         return $ticket_id;
      }
      else{
         return false;
      }
   }
   public function edit_ticket($ticket_id,$subject,$desc,$tags,$assigned,$status,$priority,$process,$date,$department,$delete_file)
   {
      $data=array(
         'subject'=>$subject,
         'description'=>$desc,
         'status'=>$status,
         'priority'=>$priority,
         'assigned_to'=>$assigned,
         'internal_department'=>$department,
         'assistance_process'=>$process,
         'duedate' =>$date
      );
      $this->db->set('updation_time', 'NOW()', false);
      $this->db->where('ticket_id', $ticket_id);
      $query=$this->db->update('tickets', $data);
      if($query)
      {
         if (!empty($delete_file)) {
            $this->db->where_in('attachment', $delete_file);
            $this->db->update('attachment', array('is_deleted' => 1));
         }
         $this->updateTags($ticket_id, $tags);
         return $ticket_id;
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
   public function addTags($ticket_id,$tags){
      foreach($tags as $tag) {
         $data = array(
            'tag_name'=>$tag
         );
         $sql = $this->db->insert_string('tags', $data);
         $sql = str_replace('INSERT', 'INSERT IGNORE', $sql);
         $query = $this->db->query($sql);
         // $tagid = $this->db->insert_id();

         $query = $this->db->get_where('tags', array('tag_name' => $tag));
         if ($query->num_rows() == 1) {
            $tagid = $query->row()->tagid;
            $this->ticket_tag($ticket_id,$tagid);
         }

         // $query = $this->db->query("INSERT IGNORE INTO tags (tag_name) VALUES ('$data[tag_name]')");
         // $query=$this->db->insert('tags',$data);
      }
   }
   public function ticket_tag($ticket_id,$tag_id) {
         $data = array(
            'ticket_id' => $ticket_id,
            'tagid' => $tag_id
         );
         $query = $this->db->insert('ticket_tags',$data);
   }

   public function updateTags($ticket_id, $tags) {
      // First, delete all the existing tags associated with the ticket
      $this->db->delete('ticket_tags', array('ticket_id' => $ticket_id));
      foreach($tags as $tag) {
         $data = array(
            'tag_name'=>$tag
         );
         $sql = $this->db->insert_string('tags', $data);
         $sql = str_replace('INSERT', 'INSERT IGNORE', $sql);
         $query = $this->db->query($sql);
    
         $query = $this->db->get_where('tags', array('tag_name' => $tag));
         if ($query->num_rows() == 1) {
            $tagid = $query->row()->tagid;
            $this->ticket_tag($ticket_id,$tagid);
         };
      }
   }
}