<?php
class Getticket extends CI_Controller {
  public function __construct() {
    parent::__construct();
    $this->load->model('editticket_model');
  }
  public function index() {
    $ticketId = 949;
    $data['ticket'] = $this->editticket_model->get_ticket($ticketId);
    $data['tags'] = $this->editticket_model->get_tags($ticketId);
    $data['attachments'] = $this->editticket_model->get_attachments($ticketId);
    $data['admin'] = $this->editticket_model->get_admin();
    $data['department'] = $this->editticket_model->get_department();
    $data['users'] = $this->editticket_model->get_user($ticketId);
    $data['alltags'] = $this->editticket_model->get_alltags();
    $data['feedback'] = $this->editticket_model->get_feedback($ticketId);
    echo json_encode($data);
    
  }
  public function updatestatus() {
    $data = json_decode(file_get_contents('php://input'));
    $ticketId = $data->ticketId;
    $status = $data->status;

    if ($this->editticket_model->updateTicketStatus($ticketId, $status)) {
        $response = array('status' => 'success', 'message' => 'Ticket status updated successfully.');
    } else {
        $response = array('status' => 'error', 'message' => 'An error occurred while updating the ticket status.');
    }
    echo json_encode($response);
  }

  public function updatepriority() {
    $data = json_decode(file_get_contents('php://input'));
    $ticketId = $data->ticketId;
    $priority = $data->priority;

    if ($this->editticket_model->updatepriority($ticketId, $priority)) {
        $response = array('status' => 'success', 'message' => 'Ticket priority updated successfully.');
    } else {
        $response = array('status' => 'error', 'message' => 'An error occurred while updating the ticket priority.');
    }

    echo json_encode($response);
  }  
  public function updateduedate() {
    $data = json_decode(file_get_contents('php://input'));
    $ticketId = $data->ticketId;
    $duedate = $data->duedate;

    if ($this->editticket_model->updateduedate($ticketId, $duedate)) {
        $response = array('status' => 'success', 'message' => 'Ticket Due Date updated successfully.');
    } else {
        $response = array('status' => 'error', 'message' => 'An error occurred while updating the ticket due date.');
    }

    echo json_encode($response);
  }  
  
    // echo "ticket data <br>" . json_encode($data[']) . 
    //   "<br><br> tags data <br>" . json_encode($data2) . 
    //   "<br><br> attachment <br>" . json_encode($data3);
  }
?>
