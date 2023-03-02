<?php 
 class Index extends CI_Controller{
    public  function __construct()
    {
       parent::__construct();
    //    $this->load->model('servicemodel');
   }
    public function index(){
        $this->load->view('index');
    }
}