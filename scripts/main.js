
var app = angular.module('harvey', []);





var testData = {
	"config": {},
	"requestTemplates": [],
	"responseTemplates": [],
	"setupAndTeardowns": [{
		"id": "setup1",
		"request": {
			"method": "GET",
			"protocol": "http",
			"host": "www.google.com",
			"resource": "/"
		},
		"expectedResponse": {
			"statusCode": 200
		}
	},{
		"id": "teardown1",
		"request": {
			"method": "GET",
			"protocol": "http",
			"host": "www.google.com",
			"resource": "/"
		},
		"expectedResponse": {
			"statusCode": 200
		}
	}],
	"tests": [{
		"id": "test1",
		"setup": ["setup1"],
		"request": {
			"method": "GET",
			"protocol": "http",
			"host": "www.google.com",
			"resource": "/"
		},
		"expectedResponse": {
			"statusCode": 200
		}
	}, {
		"id": "test2",
		"request": {
			"method": "GET",
			"protocol": "http",
			"host": "www.google.com",
			"resource": "/"
		},
		"expectedResponse": {
			"statusCode": 200
		},
		"teardown": ["teardown1"]
	}, {
		"id": "test3",
		"request": {
			"method": "GET",
			"protocol": "http",
			"host": "www.google.com",
			"resource": "/"
		},
		"expectedResponse": {
			"statusCode": 200
		}
	},  {
		"id": "test4",
		"request": {
			"method": "GET",
			"protocol": "http",
			"host": "www.google.com",
			"resource": "/"
		},
		"expectedResponse": {
			"statusCode": 200
		}
	}, {
		"id": "test5",
		"request": {
			"method": "GET",
			"protocol": "http",
			"host": "www.google.com",
			"resource": "/"
		},
		"expectedResponse": {
			"statusCode": 200
		}
	}]
	};


var suiteBuilder = new SuiteBuilder();


harveyStatus.onSuiteStarting(function() {
	console.log('suite starting');
});

harveyStatus.onSuiteCompleted(function(result) {
	console.log('suite completed');
});

harveyStatus.onTestStarting(function(test) {
	console.log('test starting');
});

harveyStatus.onTestCompleted(function(test, result) {
	console.log('test completed');
});

harveyStatus.onRequestStarting(function(test, request) {
	console.log('request starting');
});

harveyStatus.onRequestCompleted(function(request, response) {
	console.log('request completed');
});

harveyStatus.onRequestFailed(function(request, error) {
	console.log('request failed');
});


var suiteInvoker = suiteBuilder.buildSuite(testData.tests, testData, {}, harveyStatus);

suiteInvoker(function(error, suiteResult) {

	if(error) {
		console.log('Error: ', error);
	}
	else {
		console.log('Results:', suiteResult);
	}

});
