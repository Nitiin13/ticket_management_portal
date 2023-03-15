<?php 
 class Auth_model extends CI_Model{
    public  function __construct()
    {
       parent::__construct();
       $this->load->database();
    }
    public function getUserDetails($user_id)
    {
         $query=$this->db->get_where('users',array('user_id' =>$user_id ));
         if($query->num_rows>0)
         {
            return $query->result_array();
         }
         else
         {
            return false;
         }
    }
    public function check_email($email)
    {
        $this->db->select('email');
        $query = $this->db->get_where('users', array('email' => $email));
        if($query->result()){
            return TRUE;
        }
        else{
            return FALSE;
        }

    }
    public function checkCred($email,$pass)
    {
      $query=$this->db->get_where('users',array('email' => $email, 'password' =>md5($pass) ));
      if($query->num_rows>0)
		{
			return $result= $query->result_array();
		}
		else{
            return false;
		}
    }
    public function set_usertokens($user_id,$token)
    {
      date_default_timezone_set("Asia/Kolkata");
      $startTime = date("Y-m-d H:i:s");
      $expiry= date('Y-m-d H:i:s',strtotime('+30 day',strtotime($startTime)));
      $query=$this->db->insert('user_tokens',array('user_id'=>$user_id, 'token'=>$token ,'expiry'=>$expiry));
      if($query)
      {
         return true;
      }
      else{
         return false;
      }
    }
    public function get_token($token,$auth_id)
    {
         $this->db->select('user_id');
         $query=$this->db->get_where('user_tokens',array('token'=>$token,'user_id'=>$auth_id));
         if($query->num_rows>0)
         {
            return $query->result_array();
         }
         else{
            return false;
         }
    }
    public function update_token($cid,$token)
    {
      date_default_timezone_set("Asia/Kolkata");
      $startTime = date("Y-m-d H:i:s");
      $expiry= date('Y-m-d H:i:s',strtotime('-40 day',strtotime($startTime)));
      $this->db->where('user_id', $cid);
      $this->db->where('token',$token);
      $query=$this->db->update('user_tokens', array('expiry'=>$expiry));
      if($query)
      {
         return true;
      }
      else{
         return false;
      }
      
    }
}
?>