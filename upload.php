<?php

if ( !empty( $_FILES ) ) {

    var_dump( $_FILES );
    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $uploadPath = APPPATH.'../uploads/';

    move_uploaded_file( $tempPath, $uploadPath );

    $answer = array( 'answer' => 'File transfer completed' );
    $json = json_encode( $answer );

    echo $json;

} else {

    echo 'No files';

}

?>