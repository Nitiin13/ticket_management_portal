<?php 
 class Ticket extends CI_Controller{
   public  function __construct()
   {
      parent::__construct();
      $this->load->model('user_model');
      
   }
   public function getFilterData(){
      $data = $this->user_model->getFilterData();
      echo json_encode($data);
   }
   public function getDashboardData(){
      $data=$this->user_model->getDashboardData();
       echo json_encode($data);
   }
   public function getLineGraphData(){
      $data=$this->user_model->getLineGraphData();
       echo json_encode($data);
   }
    public function getBarGraphData(){
      $data=$this->user_model->getBarGraphData();
       echo json_encode($data);
   }
   public function getDashboardFilterData(){
      
      if($_POST['myData']){
      $myData = json_decode($_POST["myData"]);
      $data=$this->user_model->getDashboardFilterData($myData);
       echo json_encode($data);
      }
   }
   public function getLineGraphFilterData(){
      
      if($_POST['myData']){
      $myData = json_decode($_POST["myData"]);
      $data=$this->user_model->getLineGraphFilterData($myData);
       echo json_encode($data);
      }
   }
   public function getBarGraphFilterData(){
      if($_POST['myData']){
      $myData = json_decode($_POST["myData"]);
      $data=$this->user_model->getBarGraphFilterData($myData);
       echo json_encode($data);
      }
   }
   public function filter_tickets()
   {
      
      if($_POST['myData']){
         
         $role=$this->session->userdata("ses_role");
         if($role=="0")
         {
            $userid = $this->session->userdata("ses_id");
         }
         else{
            $userid=false;
         }
         $myData = json_decode($_POST["myData"]);
         $limit = $myData->limit;
         $stream = $myData->stream;
         // echo $sortby;
         $data = $this->user_model->filter_ticket($myData,$userid,$limit,$stream);
         $this->output->set_content_type('application/json')->set_output(json_encode($data));   
         // echo "Inside";
         
     }
   }
   // public function filter_ticket_open_close()
   // {
   //    $_POST = json_decode(file_get_contents("php://input"), true);
   //    if($_POST['data']!=null){
   //       $role=$this->session->userdata("ses_role");
   //       if($role=="0")
   //       {
   //          $myData = $_POST['data'];
   //          $userid = $this->session->userdata("ses_id");
   //          $limit=$_POST['limit'];
   //          $stream=$_POST['stream'];
   //         // $myData = json_decode($_POST['data']);
   //          // echo $sortby;
            
   //          $data = $this->user_model->filter_ticket_open_close($myData,$userid,$limit,$stream);
   //          echo json_encode($data); 
   //       }
   //       else{
   //             $myData = $_POST['data'];
   //             $limit=$_POST['limit'];
   //             $stream=$_POST['stream'];
   //             $userid=false;
   //          // $myData = json_decode($_POST['myData']);
   //          // echo $sortby;
   //          $data = $this->user_model->filter_ticket_open_close($myData,$userid,$limit,$stream);
   //          echo json_encode($data); 
      
   //      }
   //    }
   // }
   public function populate_filter()
   {
      $data = $this->user_model->populate_filter();
      echo json_encode($data);
      // $this->output->set_content_type('application/json')->set_output(json_encode($data)); 
   }
}