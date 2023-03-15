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
    public function customer_signup($name,$email,$pass)
    {
        $data = array(
            'email'=>$email,
            'password'=>$pass,
            'name'=>$name,
            'user_id'=>NULL,
            'role'=>0
        );
        $query=$this->db->insert('users',$data);
        if($query){

            $insert_id = $this->db->insert_id();
            return $insert_id;
        }
        else{
            return 0;
        }

        
    }
    public function get_otp($email)
    {
        //SELECT otp.otp_id,otp.user_id,otp.genrated_otp,otp.genration_time FROM `otp` LEFT JOIN users on otp.user_id=users.user_id where users.email = "thgagan007@gmail.com"
        $this->db->select('otp.otp_id,otp.user_id,otp.genrated_otp,otp.genration_time,users.name');
        $this->db->from('otp');
        $this->db->join('users', 'otp.user_id=users.user_id');
        $this->db->where('users.email', $email);
        $query = $this->db->get();
        $data = $query->row_array();
        
        if($data){
            $id = (int)($data['user_id']);
            $curr_time = $data['genration_time'];
            $startTime = time();
            $expiry= $curr_time + 30*60;
            
            if($startTime<$expiry){

                $datap = array(
                    'genration_time' => $startTime
                );
     
                $this->db->where('user_id', $id);
                $this->db->update('otp', $datap);
                $datap = array(
                    'otp' => (int)$data['genrated_otp'],
                    'name' => $data['name'],
                    'id' => $id
                );
                return $datap;
            }
            else{
                $otp = rand(100000,999999);
                $datap = array(
                    'genration_time' => $startTime,
                    'genrated_otp'=> $otp
                );
     
                $this->db->where('user_id', $id);
                $this->db->update('otp', $datap);
                $datap = array(
                    'otp' => $otp,
                    'name' => $data['name'],
                    'id' => $id
                );
                return $datap;
            }

        }
        else{
            $this->db->select('user_id,name');
            $query = $this->db->get_where('users', array('email' => $email));
            $data = $query->row_array();
            $id = (int)($data['user_id']);
            $otp = rand(100000,999999);
            $startTime = time();
            $datap = array(
                'otp_id' => null,
                'user_id' => $id,
                'genration_time' => $startTime,
                'genrated_otp' => $otp
            );
            $this->db->insert('otp',$datap);
            $insert_id = $this->db->insert_id();
            if($insert_id){
                $datap = array(
                    'otp' => $otp,
                    'name' => $data['name'],
                    'id' => $id
                );
                return $datap;
            }
        }

    }
    public function check_otp($email,$otp)
    {
        //SELECT otp.otp_id,otp.user_id,otp.genrated_otp,otp.genration_time FROM `otp` LEFT JOIN users on otp.user_id=users.user_id where users.email = "thgagan007@gmail.com"
        $this->db->select('otp.otp_id,otp.user_id,otp.genrated_otp,otp.genration_time,users.name');
        $this->db->from('otp');
        $this->db->join('users', 'otp.user_id=users.user_id');
        $this->db->where('users.email', $email);
        $this->db->where('otp.genrated_otp', $otp);
        $query = $this->db->get();
        $data = $query->row_array();

        if($data){
            $curr_time = $data['genration_time'];
            $startTime = time();
            $expiry= $curr_time + 30*60;

            if($startTime<$expiry){

                return TRUE;
            }
            else{
                return FALSE;
            }

        }
        else{
            return FALSE;
        }

    }
    public function resetpassword($email,$password)
    {
        $data = array(
            'email'=>$email,
            'password'=>$password
        );
        $this->db->where('email', $email);
        if($this->db->update('users', $data)){
            return TRUE;
        }
        else{
            return FALSE;
        }
        

    }
}
