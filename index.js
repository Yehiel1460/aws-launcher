const { dynamoTables } = require("./dynamo.js");
const { lambdaFunctions } = require("./lambda.js");
exports.handler = async (event) => {
  console.log({ event });
  const viewValue = {
    view: event.queryStringParameters?.view,
    domainName: event.requestContext?.domainName,
    path: event.requestContext?.path
  };

  let viewResault;
  if (viewValue.view === "dynamo") {
    viewResault = await dynamoTables();
  } else if (viewValue.view === "lambda") {
    viewResault = await lambdaFunctions();
  } else if(!event.queryStringParameters){
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
