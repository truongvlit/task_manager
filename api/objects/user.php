<?php
class User {
  private $conn;
  private $table_name = "user";

  public $id;
  public $password;
  public $name;
  public $phone_number;
  public $email;
  public $qr_code;
  public $role;
  public $group_id;

  public function __construct($db){
      $this->conn = $db;
  }

  function read(){
    
      $query = "SELECT
                  id, password, name, phone_number, email, qr_code, role, group_id
                FROM
                  user";
      $stmt = $this->conn->prepare($query);

      $stmt->execute();

      return $stmt;
  }
}
?>