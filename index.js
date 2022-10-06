const AWS = require("aws-sdk");
const { dynamoTables } = require("./dynamo.js");
const { lambdaFunctions } = require("./lambda.js");
try {
  exports.handler = async (event) => {
    console.log({ event });
    const viewValue = {
      view: event.queryStringParameters.view,
    };
    const accessKeyId = event.queryStringParameters.accessKeyId;
    const secretAccessKey = event.queryStringParameters.secretAccessKey;
    AWS.config.update({
      MasterRegion: "us-east-1",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    let viewResault;
    if (event.queryStringParameters.accessKeyId) {
      if (viewValue.view === "dynamo") {
        viewResault = await dynamoTables(AWS);
      } else if (viewValue.view === "lambda") {
        viewResault = await lambdaFunctions(AWS);
      } else {
        viewResault = `<a href= ?view=dynamo&accessKeyId=${accessKeyId}&secretAccessKey=${secretAccessKey}>Dynamo List</a> - <a href= ?view=lambda&accessKeyId=${accessKeyId}&secretAccessKey=${secretAccessKey}>Lambda List</a>`;
      }
    } else {
      viewResault = "<p>Please enter accessKeyId and secretAccessKey</p>";
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
  const response = {
    statusCode: 200,
    body: `<p>${error}</p>`,
    headers: {
      "Content-Type": "text/html",
    },
  };
  return response;
}
