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
   public function filter_ticket($myData,$userid,$limit,$stream)
   {
     
      if($userid!=false)
      {
         $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,tickets.genration_time,users.name');
         $this->db->from('tickets');
         $this->db->join('users', 'users.user_id=tickets.assigned_to');
         $this->db->where('tickets.user_id', $userid);
      }
      else{
         $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,tickets.genration_time,a.name as user_name,b.name as admin_name');
         $this->db->from('tickets');
         $this->db->join('users as a', 'a.user_id = tickets.user_id');
         $this->db->join('users as b', 'tickets.assigned_to=b.user_id');
         
      }
      if(property_exists($myData,'status')){
         $this->db->where('tickets.status', $myData->status);
      }
      
      if(property_exists($myData,'keyword')){
         $where= "tickets.subject LIKE '%".$myData->keyword."%' OR tickets.ticket_id Like '%".$myData->keyword."%'";
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
      if(property_exists($myData,'statuschange')){

         if($myData->statuschange==0)
         {
            $this->db->having('tickets.status', '0');
            $this->db->or_having('tickets.status', '1');
            $this->db->or_having('tickets.status', '2');
         }
         else{
            $this->db->having('tickets.status', '3');
            $this->db->or_having('tickets.status', '4');
            $this->db->or_having('tickets.status', '5');
         }
      }
      if(property_exists($myData,'due')){

         if($myData->due==0)
         {
            $this->db->having('tickets.status', '0');
            $this->db->or_having('tickets.status', '1');
            $this->db->or_having('tickets.status', '2');
            $this->db->where('DATEDIFF(tickets.duedate,  CURRENT_TIMESTAMP) =', '0');
         }
         else{
            $this->db->having('tickets.status', '3');
            $this->db->or_having('tickets.status', '4');
            $this->db->or_having('tickets.status', '5');
            $this->db->where('DATEDIFF(tickets.duedate,  CURRENT_TIMESTAMP) >', '0');
         }
      }
      if(property_exists($myData,'unassigned')){
         $this->db->where('tickets.assigned_to','24');
      }
      if(property_exists($myData,'day')){
         if($myData->day=='0'){
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','7');
         }else{
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','30');
         }
        
      }
      //$this->db->limit(10);
       $this->db->limit($limit,($stream-1)*$limit);
      $query = $this->db->get();
      if ($query->num_rows > 0) {
         $results = $query->result_array();
           
         for($i=0;$i<count($results);$i++) {
            $tags=$this->get_tags($results[$i]['ticket_id']);
           
            $texttag='';
            foreach ($tags as $tag) {
              $texttag.=$tag['tag_name'].", ";
            }
            $results[$i]['tag']=$texttag;
          }
         return $results;
      } else {
         return false;
         // return $this->db->last_query();
      }

   }
   public function getFilterData(){
      $result=[];
      $this->db->select('tagid,tag_name');
      $this->db->from('tags');
      $query = $this->db->get()->result_array();
      $result['tag'] = $query;
      $this->db->select('department_id,department_name');
      $this->db->from('department');
      $query = $this->db->get()->result_array();
      $result['department'] = $query;
      $this->db->select('user_id,name');
      $this->db->from('users');
      $this->db->where('users.role', 1);
      $query = $this->db->get()->result_array();
      $result['user'] = $query;
      return $result;
   }
   public function getDashboardData(){
      $result=[];
      $this->db->select('count(*)');
      $this->db->from('tickets');
      $this->db->where('tickets.status', '0');
      $this->db->or_where('tickets.status', '1');
      $this->db->or_where('tickets.status','2');
      $query = $this->db->get()->result_array();
      $result['open']=$query['0']['count(*)'];
      $this->db->select('count(*)');
      $this->db->from('tickets');
      $this->db->where('tickets.status', '3');
      $this->db->or_where('tickets.status','4' );
      $this->db->or_where('tickets.status', '5');
      $query = $this->db->get()->result_array();
      $result['close']=$query['0']['count(*)'];
      $this->db->select('count(*)');
      $this->db->from('tickets');
      $this->db->where('tickets.status', '0');
      $this->db->or_where('tickets.status', '1');
      $this->db->or_where('tickets.status','2');
      $this->db->where('DATEDIFF(tickets.duedate,  CURRENT_TIMESTAMP) =', '0');
      $query = $this->db->get()->result_array();
      $result['duetoday']=$query['0']['count(*)'];
      $this->db->select('count(*)');
      $this->db->from('tickets');
      $this->db->where('tickets.status', '0');
      $this->db->or_where('tickets.status', '1');
      $this->db->or_where('tickets.status','2');
      $this->db->where('DATEDIFF(tickets.duedate,  CURRENT_TIMESTAMP) >', '0');
      $query = $this->db->get()->result_array();
      $result['due']=$query['0']['count(*)'];
      $this->db->select('count(*)');
      $this->db->from('tickets');
      $this->db->where('tickets.assigned_to','24');
      $query = $this->db->get()->result_array();
      $result['assigned']=$query['0']['count(*)'];
      return $result;
   }
   public function getLineGraphData(){
      $this->db->select("count(*) AS Day,CAST(tickets.genration_time AS DATE) AS Date");
      $this->db->from('tickets');
      $this->db->group_by("Date");
      $query = $this->db->get()->result_array();
      return $query;
   }
   public function getBarGraphData(){
      $this->db->select("count(*) AS Day,CAST(tickets.genration_time AS DATE) AS Date");
      $this->db->from('tickets');
      $this->db->where('tickets.status', '3');
      $this->db->or_where('tickets.status','4' );
      $this->db->or_where('tickets.status', '5');
      $this->db->group_by("Date");
      $query = $this->db->get()->result_array();
      return $query;
   }
   public function getBarGraphFilterData($myData){
      $this->db->select("count(*) AS Day,CAST(tickets.genration_time AS DATE) AS Date");
      $this->db->from('tickets');
      $this->db->where('tickets.status', '3');
      $this->db->or_where('tickets.status','4' );
      $this->db->or_where('tickets.status', '5');
      $this->db->group_by("Date");
      if(property_exists($myData,'day')){
         if($myData->day=='0'){
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','7');
         }else{
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','30');
         }
        
      }
      $query = $this->db->get()->result_array();
      return $query;
   }
   public function getLineGraphFilterData($myData){
      $this->db->select("count(*) AS Day,CAST(tickets.genration_time AS DATE) AS Date");
      $this->db->from('tickets');
      $this->db->group_by("Date");
      if(property_exists($myData,'day')){
         if($myData->day=='0'){
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','7');
         }else{
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','30');
         }
        
      }
      $query = $this->db->get()->result_array();
      return $query;
   }
   public function getDashboardFilterData($myData){
      $result=[];
      $this->db->select('count(*)');
      $this->db->from('tickets');
      $this->db->where('tickets.status', '0');
      $this->db->or_where('tickets.status', '1');
      $this->db->or_where('tickets.status','2');
      if(property_exists($myData,'day')){
         if($myData->day=='0'){
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','7');
         }else{
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','30');
         }
        
      }
      $query = $this->db->get()->result_array();
      $result['open']=$query['0']['count(*)'];
      $this->db->select('count(*)');
      $this->db->from('tickets');
      $this->db->where('tickets.status', '3');
      $this->db->or_where('tickets.status','4' );
      $this->db->or_where('tickets.status', '5');
      if(property_exists($myData,'day')){
         if($myData->day=='0'){
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','7');
         }else{
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','30');
         }
        
      }
      $query = $this->db->get()->result_array();
      $result['close']=$query['0']['count(*)'];
      $this->db->select('count(*)');
      $this->db->from('tickets');
      $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) =', '30');
      if(property_exists($myData,'day')){
         if($myData->day=='0'){
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','7');
         }else{
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','30');
         }
        
      }
      $query = $this->db->get()->result_array();
      $result['duetoday']=$query['0']['count(*)'];
      $this->db->select('count(*)');
      $this->db->from('tickets');
      $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) >','30');
      if(property_exists($myData,'day')){
         if($myData->day=='0'){
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','7');
         }else{
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','30');
         }
        
      }
      $query = $this->db->get()->result_array();
      $result['due']=$query['0']['count(*)'];
      $this->db->select('count(*)');
      $this->db->from('tickets');
      $this->db->where('tickets.status', '0');
      $this->db->or_where('tickets.status', '1');
      $this->db->or_where('tickets.status','2');
      $this->db->where('tickets.assigned_to','24');
      if(property_exists($myData,'day')){
         if($myData->day=='0'){
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','7');
         }else{
            $this->db->where('TIMESTAMPDIFF(day,tickets.genration_time,CURRENT_TIMESTAMP) <=','30');
         }
        
      }
      $query = $this->db->get()->result_array();
      $result['assigned']=$query['0']['count(*)'];
      return $result;
   }
   // public function filter_ticket_open_close($myData,$userid,$limit,$stream)
   // {
   //    if($userid!=false)
   //    {
   //       $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,tickets.genration_time,users.name');
   //       $this->db->from('tickets');
   //       $this->db->join('users', 'users.user_id=tickets.assigned_to');
   //       $this->db->where('tickets.user_id', $userid);
   //    }
   //    else{
   //       $this->db->select("tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,tickets.genration_time,a.name as user_name,b.name as admin_name");
   //       $this->db->from('tickets');
   //       $this->db->join('users as a', 'a.user_id = tickets.user_id');
   //       $this->db->join('users as b', 'tickets.assigned_to=b.user_id');
         
   //    }
   //    if($myData)
   //    $this->db->where('tickets.status', $myData['id0']);
   //    $this->db->or_where('tickets.status', $myData['id1']);
   //    $this->db->or_where('tickets.status', $myData['id2']);
      
   //    $this->db->limit($limit,($stream-1)*$limit);
   //    $query = $this->db->get();

   //    if ($query->num_rows > 0) {
   //       $results = $query->result_array();
   //       for($i=0;$i<count($results);$i++) {
   //          $tags=$this->get_tags($results[$i]['ticket_id']);
           
   //          $texttag='';
   //          foreach ($tags as $tag) {
   //            $texttag.=$tag['tag_name'].", ";
   //          }
   //          $results[$i]['tag']=$texttag;
   //        }
   //       return $results;
   //    } else {
   //       return false;
   //       // return $this->db->last_query();
   //    }
   // }
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
   public function getTickets($userId,$limit,$stream)
   {
      if ($userId == false) {
         $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,tickets.genration_time,a.name as user_name,b.name as admin_name');
         $this->db->from('tickets');
         $this->db->join('users as a', 'a.user_id = tickets.user_id');
         $this->db->join('users as b', 'tickets.assigned_to=b.user_id');
         $this->db->limit($limit,($stream-1)*$limit);
         $query = $this->db->get();
         if ($query->num_rows > 0) {
            $results = $query->result_array();
           
            for($i=0;$i<count($results);$i++) {
               $tags=$this->get_tags($results[$i]['ticket_id']);
              
               $texttag='';
               foreach ($tags as $tag) {
                 $texttag.=$tag['tag_name'].", ";
               }
               $results[$i]['tag']=$texttag;
             }
            return $results;
         } else {
            return false;
         }
      } else {
         $this->db->select('tickets.ticket_id,tickets.subject,tickets.status,tickets.updation_time,tickets.genration_time,users.name');
         $this->db->from('tickets');
         $this->db->join('users', 'users.user_id=tickets.assigned_to');
         $this->db->where('tickets.user_id', $userId);
         $this->db->limit($limit,($stream-1)*$limit);
         $query = $this->db->get();

         if ($query->num_rows > 0) {
            $results = $query->result_array();
           
            for($i=0;$i<count($results);$i++) {
               $tags=$this->get_tags($results[$i]['ticket_id']);
              
               $texttag='';
               foreach ($tags as $tag) {
                 $texttag.=$tag['tag_name'].", ";
               }
               $results[$i]['tag']=$texttag;
             }
            return $results;
         } else {
            return false;
         }
      }
   }
   public function get_tags($ticketId) {
      $this->db->select('tags.tag_name');
      $this->db->from('ticket_tags');
      $this->db->join('tags', 'ticket_tags.tagid=tags.tagid');
      $this->db->where('ticket_tags.ticket_id', $ticketId);
      $query =  $this->db->get();
      return $query->result_array();
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
