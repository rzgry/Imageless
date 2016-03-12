var Clarifai = require('./clarifai_node.js');
const client_Id = '7oTbWp7-KH3Pdiqde5NJPO23SHyy9W6lfUhKcm0e';
const client_Secret = 'm6pbWX587pWnU2EqV6jJN_jYgg4p4H4BvctWVQ6F';
Clarifai.initAPI(client_Id, client_Secret);
var stdio = require('stdio');
var opts = stdio.getopt( {
  'print-results' : {description: 'print results'},
  'print-http' : {description: 'print HTTP requests and responses'},
  'verbose' : {key : 'v', description: 'verbose output'}
});
var verbose = opts["verbose"];
Clarifai.setVerbose(verbose);
if(verbose) console.log("using client id="+Clarifai._clientId+", Client Secret="+Clarifai._clientSecret);

// Setting a throttle handler lets you know when the service is unavailable because of throttling. It will let
// you know when the service is available again. Note that setting the throttle handler causes a timeout handler to
// be set that will prevent your process from existing normally until the timeout expires. If you want to exit fast
// on being throttled, don't set a handler and look for error results instead.

Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) {
	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
});

function commonResultHandler( err, res ) {
	if( err != null ) {
		if( typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
			console.log("TAG request timed out");
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
			console.log("TAG request received ALL_ERROR. Contact Clarifai support if it continues.");
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
			console.log("TAG request received TOKEN_FAILURE. Contact Clarifai support if it continues.");
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
			console.log("Clarifai host is throttling this application.");
		}
		else {
			console.log("TAG request encountered an unexpected error: ");
			console.log(err);
		}
	}
	else {
		if( opts["print-results"] ) {
			// if some images were successfully tagged and some encountered errors,
			// the status_code PARTIAL_ERROR is returned. In this case, we inspect the
			// status_code entry in each element of res["results"] to evaluate the individual
			// successes and errors. if res["status_code"] === "OK" then all images were
			// successfully tagged.
			if( typeof res["status_code"] === "string" &&
				( res["status_code"] === "OK" || res["status_code"] === "PARTIAL_ERROR" )) {

				// the request completed successfully
				for( i = 0; i < res.results.length; i++ ) {
					if( res["results"][i]["status_code"] === "OK" ) {
						console.log( 'docid='+res.results[i].docid +
							' local_id='+res.results[i].local_id +
							' tags='+res["results"][i].result["tag"]["classes"] )
					}
					else {
						console.log( 'docid='+res.results[i].docid +
							' local_id='+res.results[i].local_id +
							' status_code='+res.results[i].status_code +
							' error = '+res.results[i]["result"]["error"] )
					}
				}
			}
		}
	}
}

function getTagURLs(testImageURLs, ourIds, commonResultHandler) {
  
}

Clarifai.clearThrottleHandler();
