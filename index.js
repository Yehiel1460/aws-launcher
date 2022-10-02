const { dynamoTables } = require("./dynamo.js");
const { lambdaFunctions } = require("./lambda.js");
exports.handler = async (event) => {
  console.log({ event });
  const viewValue = {
    view: event.queryStringParameters.view,
    domainName: event.domainName.domainName,
    path: event.path.path,
  };

  let viewResault;
  if (viewValue.view === "dynamo") {
    viewResault = await dynamoTables();
  } else if (viewValue.view === "lambda") {
    viewResault = await lambdaFunctions();
  } else {
    viewResault = `<a href= ${viewValue.domainName + viewValue.path + '?view=dynamo'}>Dynamo List</a> - <a href= "https://yv8insn58f.execute-api.us-east-1.amazonaws.com/default/aws-launcher-test?view=lambda">Lambda List</a>`;
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
