<?php
class Tags extends CI_Controller {
  public function index() {
    $this->load->model('tag_model');
    $data = $this->tag_model->get_tags();
    echo json_encode($data);
  }
}
?>
