<?php
class Getticket extends CI_Controller {
  public function __construct() {
    parent::__construct();
    $this->load->model('editticket_model');
  }

  public function getticketinfo($ticketId) {
    $data['ticket'] = $this->editticket_model->get_ticket($ticketId);
    $data['tags'] = $this->editticket_model->get_tags($ticketId);
    $data['attachments'] = $this->editticket_model->get_attachments($ticketId);
    $data['admin'] = $this->editticket_model->get_admin();
    $data['department'] = $this->editticket_model->get_department();
    $data['users'] = $this->editticket_model->get_user($ticketId);
    $data['alltags'] = $this->editticket_model->get_alltags();
    $data['feedback'] = $this->editticket_model->get_feedback($ticketId);
    $data['rating'] = $this->editticket_model->get_average_rating();
    echo json_encode($data);
  }
  public function get_average_rating() {
    $data['rating'] = $this->editticket_model->get_average_rating();
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

  public function send_feedback() {
      $myData = json_decode($_POST['myData']);
      $name = $myData->name;
      $subject = $myData->subject;
      $assigned = $myData->assigned;
      $email = $myData->email;
      $ticketId = $myData->ticketId;
      $date = date('Y-m-d');
      $this->load->helper('sendfeedback');
      email($name,$email, $subject,$assigned,$date,$ticketId);
  }

  public function get_feedback() {
    $myData = json_decode($_POST['myData']);
    $ticketId = $myData->ticketId;
    $rating = $myData->rating;
    $recommend = $myData->recommend;
    $comments = $myData->comments;
    $this->editticket_model->userfeedback($ticketId, $rating, $recommend, $comments);
  }

  public function edit_feedback() {
    $myData = json_decode($_POST['myData']);
    $ticketId = $myData->ticketId;
    $rating = $myData->rating;
    $recommend = $myData->recommend;
    $comments = $myData->comments;
    $this->editticket_model->editfeedback($ticketId, $rating, $recommend, $comments);
  }

  public function delete_ticket() {
    $myData = json_decode($_POST['myData']);
    $ticketId = $myData->ticketId;
    $this->editticket_model->deleteTicket($ticketId);
  }
  // public function delete_tickets() {
  //   $myData = json_decode($_POST['myData']);
  //   $tickets = $myData->tickets; // use the correct property name here
  //   $this->editticket_model->deleteTickets($tickets);
  // }
  
  public function delete_tickets() {
    $myData = json_decode($_POST['myData']);
    $tickets = $myData->tickets;
    $this->editticket_model->deleteTickets($tickets);
  }

  }
?>
