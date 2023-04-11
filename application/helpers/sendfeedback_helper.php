<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!function_exists('email'))
{
    function test($test)
    {
    // $path = FCPATH.$path;
    $test = $test.'Working';
    return $test;
    }

    function email($name,$email_id,$subject,$assigned,$date,$ticketId)
    {
        require_once("C:\\xampp\\htdocs\\TMS\\application\\email_config\\config.php");
        require("C:\\xampp\\htdocs\\TMS\\application\\sendgrid-php\\sendgrid-php.php");

        $email = new \SendGrid\Mail\Mail(); 
        $email->setFrom("sanskrutikandesar55948@gmail.com", "AlmaShines");
        $email->setSubject("Your ticket has been resolved and closed");
        $email->addTo($email_id, $name);
        $email->addContent(
            "text/html",     '<div style="
                                background: #FFFFFF;
                                box-shadow: 0px 3px 6px;
                                padding: 20px;
                                color: #212121;
                                width: 500px;">
                            <p style="font: normal 600 20px Open Sans;
                                margin: 20px 0;">
                                Your ticket has been resolved and closed.
                            </p>
                            <p style="font: normal 600 16px Open Sans;
                                margin: 20px 0;">Hi '.$name.',</p>
                                <p style="margin: 20px 0;">Your ticket related to <b>'.$subject.
                                ' </b>has been resolved 
                                and closed by the <b> '. $assigned.' </b> on '.$date.
                                '. If you need any further assistance then please reply to us.
                                </p>
                                <p style="margin: 20px 0;">To close this request from your side, 
                                    please submit your feedback and click Submit & Resolve button.
                                </p>
                                <button style="background: #4275F4;
                                    border-radius: 2px;
                                    border: none;
                                    color: #FFFFFF;
                                    padding: 8px;
                                    width: 100%;">
                                    <a href="http://localhost/TMS/feedback/'.$ticketId.'" 
                                        style="color: #FFFFFF; text-decoration: none;">
                                        Close Request
                                    </a>
                                </button>
                            </div>'
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