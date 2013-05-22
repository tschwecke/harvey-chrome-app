
var app = angular.module('harvey', []);

function WelcomeCtrl($scope) {

	$scope.welcomeClass = '';
	
	$scope.openFile = function() {
		$scope.welcomeClass = 'hideWelcome';
	}

	$scope.startFromScratch = function() {
		$scope.welcomeClass = 'hideWelcome';
	}
 
}

function TestCtrl($scope) {

	$scope.filteredTests = data.tests;

	$scope.searchString = "";

	$scope.filter = function() {
		var tests = [];

		if($scope.searchString === "") {
			tests = data.tests;
		}
		else {
			for(var i=0; i<data.tests.length; i++) {
				if(data.tests[i].id.toLowerCase().indexOf($scope.searchString.toLowerCase()) > -1) {
					tests.push(data.tests[i]);
				}
			}
		}

		$scope.filteredTests = tests;
	};
}

var data = {
	"requestTemplates": [{
		"id": "simpleText.request",
		"protocol": "http",
		"host": {
			"$config": "simpleText.hostname"
		}
	}, {
		"id": "json",
		"headers": {
			"content-type": "application/json"
		}
	}, {
		"id": "simpleText.request.postBody",
		"headers": {
			"content-type": "application/json"
		},
		"body": {
			"title": "Test Title",
			"type": "HTML",
			"description": "This is a test simpleText",
			"text": "<p>hello world</p>",
			"authors": [{
				"id": "fnord",
				"firstName": "fnord",
				"lastName": "opus"
			}]
		}
	}, {
		"id": "simpleText.request.invalidPostBody",
		"headers": {
			"content-type": "application/json"
		},
		"body": {
			"title": [1234]
		}
	}, {
		"id": "simpleText.request.putBody",
		"headers": {
			"content-type": "application/json"
		},
		"body": {
			"id": "${simpleTextId}",
			"title": "Updated Title",
			"type": "HTML",
			"description": "This is an updated test simpleText",
			"text": "<p>goodbye</p>",
			"authors": [{
				"id": "fnord",
				"firstName": "fnord",
				"lastName": "opus"
			}]
		}
	}],
	"responseTemplates": [{
		"id": "ok",
		"statusCode": 200
	}, {
		"id": "notFound",
		"statusCode": 404
	}, {
		"id": "methodNotAllowed",
		"statusCode": 405
	}, {
		"id": "created",
		"statusCode": 201,
		"headers": {
			"location": {
				"$exists": true
			}
		}
	}, {
		"id": "noContent",
		"statusCode": 204
	}, {
		"id": "badRequest",
		"statusCode": 400
	}, {
		"id": "json",
		"headers": {
			"content-type": "application/json"
		}
	}, {
		"id": "originalSimpleText",
		"body": {
			"id": "${simpleTextId}",
			"title": "Test Title",
			"type": "HTML",
			"description": "This is a test simpleText",
			"text": "<p>hello world</p>",
			"authors": [{
				"id": "fnord",
				"firstName": "fnord",
				"lastName": "opus"
			}],
			"createdDate": { "$exists": true }
		}
	}, {
		"id": "updatedSimpleText",
		"body": {
			"id": "${simpleTextId}",
			"title": "Updated Title",
			"type": "HTML",
			"description": "This is an updated test simpleText",
			"text": "<p>goodbye</p>",
			"authors": [{
				"id": "fnord",
				"firstName": "fnord",
				"lastName": "opus"
			}],
			"createdDate": { "$exists": true }
		}
	}],
	"setupAndTeardowns": [{
		"id": "create.simpleText",
		"request": {
			"templates": ["simpleText.request", "simpleText.request.postBody"],
			"method": "POST",
			"resource": "/simpleTexts",
			"headers": {}
		},
		"expectedResponse": {
			"templates": ["created"]
		},
		"actions": [{
			"$set": {
				"simpleTextId": {
					"$replace" : {
						"field": "headers.location",
						"regex": "^.*/simpleTexts/(.+)$",
						"replacement": "$1"
					}
				}
			}
		}]
	}, {
		"id": "delete.simpleText",
		"request": {
			"templates": ["simpleText.request"],
			"method": "DELETE",
			"resource": "/simpleTexts/${simpleTextId}",
			"headers": {}
		},
		"expectedResponse": {
			"templates": ["noContent"]
		}
	}, {
		"id": "verifyCreatedSimpleText",
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts/${simpleTextId}"
		},
		"expectedResponse": {
			"templates": ["ok", "json", "originalSimpleText"]
		}
	}, {
		"id": "verifyUpdatedSimpleText",
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts/${simpleTextId}"
		},
		"expectedResponse": {
			"templates": ["ok", "json", "updatedSimpleText"]
		}
	}, {
		"id": "verifyDeletedSimpleText",
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts/${simpleTextId}"
		},
		"expectedResponse": {
			"templates": ["ok", "json", "notFound"]
		}
	}, {
		"id": "verifyCreatedAuthor",
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts/${simpleTextId}/authors"
		},
		"expectedResponse": {
			"templates": ["ok", "json"],
			"body": [{
				"id": "newId",
				"firstName": "newFirst",
				"lastName": "newLast"
			}, {
				"id": "fnord",
				"firstName": "fnord",
				"lastName": "opus"
			}]
		}
	}, {
		"id": "verifyUpdatedAuthor",
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts/${simpleTextId}/authors"
		},
		"expectedResponse": {
			"templates": ["ok", "json"],
			"body": [{
				"id": "fnord",
				"firstName": "Updated",
				"lastName": "Name"
			}]
		}
	}, {
		"id": "verifyDeletedAuthor",
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts/${simpleTextId}/authors"
		},
		"expectedResponse": {
			"templates": ["ok", "json"],
			"body": []
		}
	}, {
		"id": "generateTargetId",
		"actions": [{
			"$set": {
				"targetId": {
					"$random": {
						"type": "number",
						"min": 100000,
						"max": 999999
					}
				}
			}
		}]
	}, {
		"id": "createSimpleTextAssociation",
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "PUT",
			"resource": "/simpleTextAssociations/harveytest${targetId}",
			"body": {
				"targetId": "harveytest${targetId}",
				"simpleTextIds": [
					"${simpleTextId}"
				]
			}
		},
		"expectedResponse": {
			"templates": ["noContent"]
		}
	}, {
		"id": "deleteSimpleTextAssociation",
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "DELETE",
			"resource": "/simpleTextAssociations/harveytest${targetId}"
		},
		"expectedResponse": {
			"templates": ["noContent"]
		}
	}, {
		"id": "verifyCreatedSimpleTextAssociation",
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTextAssociations/harveytest${targetId}"
		},
		"expectedResponse": {
			"templates": ["ok", "json"],
			"body": {
				"targetId": "harveytest${targetId}",
				"simpleTextIds": [
					"${simpleTextId}"
				]
			}
		}
	}, {
		"id": "verifyUpdatedSimpleTextAssociation",
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTextAssociations/harveytest${targetId}"
		},
		"expectedResponse": {
			"templates": ["ok", "json"],
			"body": {
				"targetId": "harveytest${targetId}",
				"simpleTextIds": []
			}
		}
	}, {
		"id": "verifyDeletedSimpleTextAssociation",
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTextAssociations/harveytest${targetId}"
		},
		"expectedResponse": {
			"templates": ["notFound"]
		}
	}],
	"tests": [{
		"id": "POST /simpleTexts 200",
		"setup": [],
		"teardown": ["verifyCreatedSimpleText", "delete.simpleText"],
		"request": {
			"templates": ["simpleText.request", "simpleText.request.postBody"],
			"method": "POST",
			"resource": "/simpleTexts"
		},
		"expectedResponse": {
			"templates": ["created"]
		},
		"actions": [{
			"$set": {
				"simpleTextId": {
					"$replace" : {
						"field": "headers.location",
						"regex": "^.*/simpleTexts/(.+)$",
						"replacement": "$1"
					}
				}
			}
		}]
	}, {
		"id": "POST /simpleTexts 400",
		"setup": [],
		"teardown": [],
		"request": {
			"templates": ["simpleText.request", "simpleText.request.invalidPostBody"],
			"method": "POST",
			"resource": "/simpleTexts"
		},
		"expectedResponse": {
			"templates": ["badRequest"]
		}
	}, {
		"id": "GET /simpleTexts/{id} 200",
		"setup": ["create.simpleText"],
		"teardown": ["delete.simpleText"],
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts/${simpleTextId}"
		},
		"expectedResponse": {
			"templates": ["ok", "json", "originalSimpleText"]
		}
	}, {
		"id": "GET /simpleTexts 405",
		"setup": [],
		"teardown": [],
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts"
		},
		"expectedResponse": {
			"templates": ["methodNotAllowed"]
		}
	}, {
		"id": "GET /simpleTexts/{id} 404",
		"setup": [],
		"teardown": [],
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts/fnord"
		},
		"expectedResponse": {
			"templates": ["notFound"]
		}
	}, {
		"id": "PUT /simpleTexts/{id} 200",
		"setup": ["create.simpleText"],
		"teardown": ["verifyUpdatedSimpleText", "delete.simpleText"],
		"request": {
			"templates": ["simpleText.request", "simpleText.request.putBody"],
			"method": "PUT",
			"resource": "/simpleTexts/${simpleTextId}"
		},
		"expectedResponse": {
			"templates": ["noContent"]
		}
	}, {
		"id": "PUT /simpleTexts/{id} 400",
		"setup": ["create.simpleText"],
		"teardown": ["delete.simpleText"],
		"request": {
			"templates": ["simpleText.request", "simpleText.request.invalidPostBody"],
			"method": "PUT",
			"resource": "/simpleTexts/${simpleTextId}"
		},
		"expectedResponse": {
			"templates": ["badRequest"]
		}
	}, {
		"id": "DELETE /simpleTexts/{id} 200",
		"setup": ["create.simpleText"],
		"teardown": ["verifyDeletedSimpleText"],
		"request": {
			"templates": ["simpleText.request"],
			"method": "DELETE",
			"resource": "/simpleTexts/${simpleTextId}"
		},
		"expectedResponse": {
			"templates": ["noContent"]
		}
	}, {
		"id": "DELETE /simpleTexts/{id} 404",
		"setup": [],
		"teardown": [],
		"request": {
			"templates": ["simpleText.request"],
			"method": "DELETE",
			"resource": "/simpleTexts/fnord"
		},
		"expectedResponse": {
			"templates": ["notFound"]
		}
	}, {
		"id": "GET /simpleTexts/{id}/authors 200",
		"setup": ["create.simpleText"],
		"teardown": ["delete.simpleText"],
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts/${simpleTextId}/authors"
		},
		"expectedResponse": {
			"templates": ["ok", "json"],
			"body": [{
				"id":"fnord",
				"firstName":"fnord",
				"lastName":"opus"
			}]
		}
	}, {
		"id": "GET /simpleTexts/{id}/authors 404",
		"setup": ["create.simpleText"],
		"teardown": ["delete.simpleText"],
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTexts/fnord/authors"
		},
		"expectedResponse": {
			"templates": ["notfound"]
		}
	}, {
		"id": "POST /simpleTexts/{id}/authors 201",
		"setup": ["create.simpleText", "json"],
		"teardown": ["verifyCreatedAuthor", "delete.simpleText"],
		"request": {
			"templates": ["simpleText.request"],
			"method": "POST",
			"resource": "/simpleTexts/${simpleTextId}/authors",
			"body": {
				"id": "newId",
				"firstName": "newFirst",
				"lastName": "newLast"
			}
		},
		"expectedResponse": {
			"templates": ["created"]
		}
	}, {
		"id": "PUT /simpleTexts/{id}/authors 405",
		"setup": ["create.simpleText"],
		"teardown": ["delete.simpleText"],
		"request": {
			"templates": ["simpleText.request"],
			"method": "PUT",
			"resource": "/simpleTexts/fnord/authors"
		},
		"expectedResponse": {
			"templates": ["methodNotAllowed"]
		}
	}, {
		"id": "PUT /simpleTexts/{id}/authors/{id} 200",
		"setup": ["create.simpleText"],
		"teardown": ["verifyUpdatedAuthor", "delete.simpleText"],
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "PUT",
			"resource": "/simpleTexts/${simpleTextId}/authors/fnord",
			"body": {
				"id":"fnord",
				"firstName":"Updated",
				"lastName":"Name"
			}
		},
		"expectedResponse": {
			"templates": ["noContent"]
		}
	}, {
		"id": "PUT /simpleTexts/{id}/authors/{id} 400",
		"setup": ["create.simpleText"],
		"teardown": ["delete.simpleText"],
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "PUT",
			"resource": "/simpleTexts/${simpleTextId}/authors/fnord",
			"body": {
				"firstName":"New",
				"lastName":"Name"
			}
		},
		"expectedResponse": {
			"templates": [],
			"statusCode": 400
		}
	}, {
		"id": "DELETE /simpleTexts/{id}/authors/{id} 200",
		"setup": ["create.simpleText"],
		"teardown": ["verifyDeletedAuthor", "delete.simpleText"],
		"request": {
			"templates": ["simpleText.request"],
			"method": "DELETE",
			"resource": "/simpleTexts/${simpleTextId}/authors/fnord"
		},
		"expectedResponse": {
			"templates": ["noContent"]
		}
	}, {
		"id": "DELETE /simpleTexts/{id}/authors/{id} 404",
		"setup": ["create.simpleText"],
		"teardown": ["delete.simpleText"],
		"request": {
			"templates": ["simpleText.request"],
			"method": "DELETE",
			"resource": "/simpleTexts/${simpleTextId}/authors/doesnotexist"
		},
		"expectedResponse": {
			"templates": ["notfound"]
		}
	}, {
		"id": "GET /simpleTexts/{id}/authors/{id} 405",
		"setup": ["create.simpleText"],
		"teardown": ["delete.simpleText"],
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "GET",
			"resource": "/simpleTexts/${simpleTextId}/authors/fnord"
		},
		"expectedResponse": {
			"templates": ["methodNotAllowed"]
		}
	}, {
		"id": "POST /simpleTextAssociations 405",
		"setup": [],
		"teardown": [],
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "POST",
			"resource": "/simpleTextAssociations/harveytest",
			"body": {
				"targetId": "harveytest",
				"simpleTextIds": [
					"1234"
				]
			}
		},
		"expectedResponse": {
			"templates": ["notSupported"]
		}
	}, {
		"id": "PUT /simpleTextAssociations/{id} 200 - Insert",
		"setup": ["generateTargetId", "create.simpleText"],
		"teardown": ["verifyCreatedSimpleTextAssociation", "deleteSimpleTextAssociation", "delete.simpleText"],
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "PUT",
			"resource": "/simpleTextAssociations/harveytest${targetId}",
			"body": {
				"targetId": "harveytest${targetId}",
				"simpleTextIds": [
					"${simpleTextId}"
				]
			}
		},
		"expectedResponse": {
			"templates": ["noContent"]
		}
	}, {
		"id": "PUT /simpleTextAssociations/{id} 200 - Update",
		"setup": ["generateTargetId", "create.simpleText", "createSimpleTextAssociation"],
		"teardown": ["verifyUpdatedSimpleTextAssociation", "deleteSimpleTextAssociation", "delete.simpleText"],
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "PUT",
			"resource": "/simpleTextAssociations/harveytest${targetId}",
			"body": {
				"targetId": "harveytest${targetId}",
				"simpleTextIds": []
			}
		},
		"expectedResponse": {
			"templates": ["noContent"]
		}
	}, {
		"id": "PUT /simpleTextAssociations/{id} 400 - IDs Don't Match",
		"setup": ["create.simpleText"],
		"teardown": ["delete.simpleText"],
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "PUT",
			"resource": "/simpleTextAssociations/harveytest-oneId",
			"body": {
				"targetId": "harveytest-differentId",
				"simpleTextIds": [
					"${simpleTextId}"
				]
			}
		},
		"expectedResponse": {
			"statusCode": 400,
			"body": "The ID does not match the resource being updated"
		}
	}, {
		"id": "PUT /simpleTextAssociations/{id} 400 - Invalid Simpletext Id",
		"setup": [],
		"teardown": [],
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "PUT",
			"resource": "/simpleTextAssociations/harveytest",
			"body": {
				"targetId": "harveytest",
				"simpleTextIds": [
					"nonexistentId"
				]
			}
		},
		"expectedResponse": {
			"statusCode": 400,
			"body": "One or more of the supplied simpleText IDs are not valid"
		}
	}, {
		"id": "PUT /simpleTextAssociations/{id} 400 - Invalid JSON",
		"setup": [],
		"teardown": [],
		"request": {
			"templates": ["simpleText.request", "json"],
			"method": "PUT",
			"resource": "/simpleTextAssociations/harveytest",
			"body": "This isn't JSON"
		},
		"expectedResponse": {
			"statusCode": 400
		}
	}, {
		"id": "GET /simpleTextAssociations/{id} 200",
		"setup": ["generateTargetId", "create.simpleText", "createSimpleTextAssociation"],
		"teardown": ["deleteSimpleTextAssociation", "delete.simpleText"],
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTextAssociations/harveytest${targetId}"
		},
		"expectedResponse": {
			"templates": ["ok", "json"],
			"body": {
				"targetId": "harveytest${targetId}",
				"simpleTextIds": [
					"${simpleTextId}"
				]
			}
		}
	}, {
		"id": "GET /simpleTextAssociations/{id} 404",
		"setup": [],
		"teardown": [],
		"request": {
			"templates": ["simpleText.request"],
			"method": "GET",
			"resource": "/simpleTextAssociations/harveytestNotFound"
		},
		"expectedResponse": {
			"templates": ["notFound"]
		}
	}, {
		"id": "DELETE /simpleTextAssociations/{id} 200",
		"setup": ["generateTargetId", "create.simpleText", "createSimpleTextAssociation"],
		"teardown": ["verifyDeletedSimpleTextAssociation", "delete.simpleText"],
		"request": {
			"templates": ["simpleText.request"],
			"method": "DELETE",
			"resource": "/simpleTextAssociations/harveytest${targetId}"
		},
		"expectedResponse": {
			"templates": ["noContent"]
		}
	}, {
		"id": "DELETE /simpleTextAssociations/{id} 404",
		"setup": [],
		"teardown": [],
		"request": {
			"templates": ["simpleText.request"],
			"method": "DELETE",
			"resource": "/simpleTextAssociations/harveytestNotFound"
		},
		"expectedResponse": {
			"templates": ["notFound"]
		}
	}]
};