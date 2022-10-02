const { dynamoTables } = require("./dynamo.js");
const { lambdaFunctions } = require("./lambda.js");
exports.handler = async (event) => {
  console.log({ event });
  const viewValue = {
    view: event.queryStringParameters.view,
  };

  let viewResault;
  if (viewValue.view === "dynamo") {
    viewResault = await dynamoTables();
  } else {
    viewResault = await lambdaFunctions();
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
