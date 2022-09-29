const AWS = require("aws-sdk");
const { dynamoTables } = require("./dynamo.js");
const { lambdaFunctions } = require("./lambda.js");
exports.handler = async (event) => {
  console.log({ event });
  const viewValue = {
    view: event.queryStringParameters.view,
  };
  const dynamoTablesList = await dynamoTables();

  const lambdaFunctionsList = await lambdaFunctions();

  const lambdaOrDynamo = (view) => {
    if (view === "dynamo") {
      return "<h1>Table List</h1>" + dynamoTablesList;
    } else {
      return lambdaFunctionsList;
    }
  };

  const response = {
    statusCode: 200,
    body: lambdaOrDynamo(viewValue.view),
    headers: {
      "Content-Type": "text/html",
    },
  };
  return response;
};
