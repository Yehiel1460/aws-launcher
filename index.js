const { dynamoTables } = require("./dynamo.js");
const { lambdaFunctions } = require("./lambda.js");
exports.handler = async (event) => {
  console.log({ event });
  const viewValue = {
    view: event.queryStringParameters.view,
  };
  
  const lambdaOrDynamo = async(view) => {
    if (view === "dynamo") {
      const dynamoTablesList = await dynamoTables();
      return "<h1>Table List</h1>" + dynamoTablesList;
    } else {
      const lambdaFunctionsList = await lambdaFunctions();
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
