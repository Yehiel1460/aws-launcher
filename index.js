const AWS = require("aws-sdk");
const { dynamoTables } = require("./dynamo.js");
const { lambdaFunctions } = require("./lambda.js");
try {
  exports.handler = async (event) => {
    console.log({ event });
    const viewValue = {
      view: event.queryStringParameters?.view,
    };
    AWS.config.getCredentials(function(err) {
      if (err) console.log(err.stack);
      // credentials not loaded
      else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
      }
    });
    

    let viewResault;
    if (viewValue.view === "dynamo") {
      viewResault = await dynamoTables();
    } else if (viewValue.view === "lambda") {
      viewResault = await lambdaFunctions();
    } else if (!event.queryStringParameters) {
      viewResault = `<a href= ?view=dynamo>Dynamo List</a> - <a href= ?view=lambda>Lambda List</a>`;
    }

    const response = {
      statusCode: 200,
      body: viewResault,
      headers: {
        "Content-Type": "text/html",
      },
    };
    return response;
  };
} catch (error) {
  console.log(error);
}
