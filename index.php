<?php
require "vendor/autoload.php";
require "helpers.php";

/**
 * Main runner for program
 *
 * @return null
 *
 * @since 1.0.0
 */
function main()
{
	$app = new \Slim\App([
		'settings' => [
			'displayErrorDetails' => true,
		]
	]);
	$app->post("/", function ($request, $response, $args) {
		$data = processDialogFlowRequest($request->getParsedBody());
		return returnStatus($response, $data->status_code, $data->data);
	});

	$app->run();
}

/**
 * Handles processing the request
 *
 * @param array $postData			Data from the request (https://dialogflow.com/docs/fulfillment)
 *
 * @return object
 *
 * @since 1.0.0
 */
function processDialogFlowRequest($postData)
{
	$queryResult = $postData["queryResult"];
	$queryText = $queryResult["queryText"];
	//$action = $queryResult["action"];
	$parameters = $queryResult["parameters"];
	$intent = $queryResult["intent"];
	$statusCode = 200;			// HTTP status code to indicate if we had success or failure processing the request
	$fulfillmentText = "";		// Text to output to the user
	$date = !empty($parameters["date"])  ? $parameters["date"] : "today";
	if($date != "today"){
		$date = substr($date, 0, 10);
	}
	
	/**
	 * Commands and responses here
	 */

	if (((string)$intent["displayName"] == "ask-weather")) {
		// Documentation for Weather API is located at: https://developer.worldweatheronline.com/api/docs/local-city-town-weather-api.aspx
		// You can see the results of this call by visiting this url in a browser:
		// https://api.worldweatheronline.com/premium/v1/weather.ashx?key=154fb3cc5bb64dc699f152909181707&q=New+York&format=json&num_of_days=2
		$location = urlencode($parameters["geo-city"] . "," . $parameters["geo-state-us"]);

		$url = "https://api.worldweatheronline.com/premium/v1/weather.ashx?key=154fb3cc5bb64dc699f152909181707&format=json&num_of_days=1&tp=24&date=" . $date . "&q=" . $location;
		$response = executeRequest($url, array(), array("Content-Type: application/json"), "get");
		$response = $response->response;

		// Full Response body
		//var_dump($parameters);
		// Example getting moonrise
		//var_dump($response->data->weather[0]->hourly[0]->weatherDesc[0]->value);	
		//var_dump(((array)$response->weather->astronomy->moonrise)[0]); // Moonrise string
		

		$fulfillmentText = "Weather in " . $parameters["geo-city"] . " " . $parameters["geo-state-us"] . " is from " . 
		$response->data->weather[0]->mintempC . " to " . $response->data->weather[0]->maxtempC . " Celcius, " . 
		strtolower($response->data->weather[0]->hourly[0]->weatherDesc[0]->value) . " on " . $response->data->weather[0]->date . ".";

	}
	
	else {
		$fulfillmentText = " ";
	}
	

	/**
	 * Return responses here
	 */
	$data = array("fulfillmentText" => $fulfillmentText);
	return (object)array(
		"status_code" => $statusCode,
		"data" => $data
	);
}

// Run the program
main();
