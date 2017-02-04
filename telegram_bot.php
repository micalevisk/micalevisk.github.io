<?php
/*
https://api.telegram.org/bot328107801:AAGlUIukOJqJy4P_iPA-HiPnkVJ8awPH4lM/getupdates
https://api.telegram.org/bot328107801:AAGlUIukOJqJy4P_iPA-HiPnkVJ8awPH4lM/getme
https://api.telegram.org/bot328107801:AAGlUIukOJqJy4P_iPA-HiPnkVJ8awPH4lM/sendmessage?chat_id=170449962&text=<>
*/


$botToken = "328107801:AAGlUIukOJqJy4P_iPA-HiPnkVJ8awPH4lM";
$website = "https://api.telegram.org/bot".$botToken;


$update = file_get_contents($website."/getupdates");
$updateArray = json_decode($update, TRUE);
print_r($updateArray);
/*
$update = file_get_contents('php://input');
$update = json_decode($update, TRUE);

$chatId = $update["message"]["chat"]["id"];
$message = $update["message"]["text"];

switch($message) {
	case "/falar":
		sendMessage($chatId, "odeio doritos!!");
		break;
	default:
		sendMessage($chatId, "default");
}

function sendMessage ($chatId, $message) {
	$url = $GLOBALS[website]."/sendMessage?chat_id=".$chatId."&text=".urlencode($message);
	file_get_contents($url);
}
*/




?>
