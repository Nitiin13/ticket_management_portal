<?php
class Tag_model extends CI_Model {
    public function __construct() {
        $this->load->database();
    }
    public function get_tags() {
        $query = $this->db->get('tags');
        return $query->result_array();
    }
}
?>