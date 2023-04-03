<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!function_exists('email'))
{
    function test($test)
    {
    // $path = FCPATH.$path;
    $test = $test.'Working';
    return $test;
    }

    function email($name,$email_id,$otp_code)
    {
        require_once("C:\\xampp\\htdocs\\TMS\\application\\email_config\\config.php");
        require("C:\\xampp\\htdocs\\TMS\\application\\sendgrid-php\\sendgrid-php.php");

        $email = new \SendGrid\Mail\Mail(); 
        // $email->setFrom("gaganpratapsinghthakur19@gnu.ac.in", "AlmaShines");
        $email->setFrom("sanskrutikandesar55948@gmail.com", "AlmaShines");
        $email->setSubject("Password Reset");
        $email->addTo($email_id, $name);
        $email->addContent(
            "text/html", "<strong>Here is the OTP Required to reset your password </strong><b style='font-size: 50px;'>".$otp_code."</b>"
        );
        $sendgrid = new \SendGrid(SENDGRID_API_KEY);
        try {
            $response = $sendgrid->send($email);
            return "Successfully sent";
        } catch (Exception $e) {
            echo 'Caught exception: '. $e->getMessage() ."\n";
        }
    }


}