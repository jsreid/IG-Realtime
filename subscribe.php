<?
$client_id = 'dabe8eae6f75464ba43a7a4805aed29e';
$client_secret = '98194a0bb65044e4bb49d9b12e9b01ef';
$object = 'geography';
$object_id = '';
$aspect = 'media';
$lat = '40.756884';
$lng = '-73.986185';
$radius = '5000';
$verify_token='1';
//$callback_url = 'http://jsreid.com/instagram/callback.php';
$callback_url = 'http://jsreid.jit.su/callback/';

//SETTING UP THE CURL SETTINGS...
$attachment =  array(
'client_id' => $client_id,
'client_secret' => $client_secret,
'object' => $object,
'object_id' => $object_id,
'aspect' => $aspect,
'lat' => $lat,
'lng' => $lng,
'radius' => $radius,
'verify_token' => $verify_token,
'callback_url'=>$callback_url
);

//URL TO THE INSTAGRAM API FUNCTION
$url = "https://api.instagram.com/v1/subscriptions/";

$ch = curl_init();

//EXECUTE THE CURL...
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $attachment);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  //to suppress the curl output 
$result = curl_exec($ch);
curl_close ($ch);

//PRINT THE RESULTS OF THE SUBSCRIPTION, IF ALL GOES WELL YOU'LL SEE A 200
print_r($result);


?>
