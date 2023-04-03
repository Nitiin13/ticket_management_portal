<?php
class Editticket_model extends CI_Model
{
    public  function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function get_ticket($ticketId) {
        $query = $this->db->get_where('tickets', array('ticket_id' => $ticketId));
        return $query->result_array();
    }

    public function get_tags($ticketId) {
        // $query = $this->db->get_where('ticket_tags', array('ticket_id' => $ticketId));
        // return $query->result_array();
        $this->db->select('tags.tag_name');
        $this->db->from('ticket_tags');
        $this->db->join('tags', 'ticket_tags.tagid = tags.tagid');
        $this->db->where('ticket_tags.ticket_id', $ticketId);
        $query = $this->db->get();
        return $query->result_array();
    }

    public function get_attachments($ticketId) {
        $this->db->where('type', 0);
        $this->db->where('ref_id', $ticketId);
        $this->db->where('is_deleted', 0);
        $query = $this->db->get('attachment');
        return $query->result_array();

        // return $this->db->where(array('type' => 0, 'ref_id' => $ticketId, 'is_deleted' => 0))->get('attachment')->result_array();
    }

    public function get_admin() {
        $query = $this->db->select('*')
                        ->from('users')
                        ->where('role', 1)
                        ->get();

        return $query->result();
    }

    public function get_department() {
        $query = $this->db->get('department');
        return $query->result();
    }

    public function get_user($ticket_id) {
        $this->db->select('*');
        $this->db->from('users');
        $this->db->join('tickets', 'tickets.user_id = users.user_id');
        $this->db->where('tickets.ticket_id', $ticket_id);
        $query = $this->db->get();
        return $query->result_array();
    }

    public function get_alltags() {
        $query = $this->db->get('tags');
        return $query->result_array();
    }

    public function get_feedback($ticket_id) {
        $query = $this->db->get_where('feedback', array('ticket_id' => $ticket_id));
        return $query->result_array();
    }

    public function updateTicketStatus($ticketId, $status) {
        $this->db->where('ticket_id', $ticketId);
        $this->db->set('status', $status);
        
        if ($this->db->update('tickets')) {
          return true;
        } else {
          return false;
        }
    }

    public function updatepriority($ticketId, $priority) {
        $this->db->where('ticket_id', $ticketId);
        $this->db->set('priority', $priority);
        
        if ($this->db->update('tickets')) {
          return true;
        } else {
          return false;
        }
      }
    public function updateduedate($ticketId, $duedate) {
        $this->db->where('ticket_id', $ticketId);
        $this->db->set('duedate', $duedate);
        
        if ($this->db->update('tickets')) {
          return true;
        } else {
          return false;
        }
      }
      
}   