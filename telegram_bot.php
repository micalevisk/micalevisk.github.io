<?php
/*
https://core.telegram.org/bots/samples

https://api.telegram.org/bot300190289:AAGugr5fVFfh6pdcA1KvESc1UPvQtzoj5z0/getupdates
https://api.telegram.org/bot300190289:AAGugr5fVFfh6pdcA1KvESc1UPvQtzoj5z0/getme
https://api.telegram.org/bot300190289:AAGugr5fVFfh6pdcA1KvESc1UPvQtzoj5z0/sendmessage?chat_id=170449962&text=<>
*/

// (c) https://www.youtube.com/watch?v=hJBYojK7DO4
$botToken = "300190289:AAGugr5fVFfh6pdcA1KvESc1UPvQtzoj5z0";
$website = "https://api.telegram.org/bot".$botToken;


$update = file_get_contents("php://input");
$updateArray = json_decode($update, TRUE);

$cahtId = $updateArray["result"][0]["message"]["chat"]["id"];

file_get_contents($website."/sendmessage?chat_id=".cahtId."&text=test");



/******** PARA ADICIONAR AÇÕES AOS COMANDOS DO BOT
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
***********/




?>
