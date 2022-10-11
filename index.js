const AWS = require("aws-sdk");
const { dynamo } = require("./dynamo.js");
const { lambda } = require("./lambda.js");
const { pipeline } = require("./pipeline.js");
try {
  exports.handler = async (event) => {
    console.log({ event });
    const viewValue = {
      view: event.queryStringParameters,
      view,
    };
    const accessKeyId = event.queryStringParameters.accessKeyId;
    const secretAccessKey = event.queryStringParameters.secretAccessKey;
    AWS.config.update({
      MasterRegion: "us-east-1",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    const response = {
      statusCode: 200,
      body: await getViewResult(accessKeyId, secretAccessKey, viewValue.view),
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

const getViewResult = async (accessKeyId, secretAccessKey, view) => {
  if (!accessKeyId) {
    return "<p>Please enter accessKeyId and secretAccessKey</p>";
  }
  return (
    (await { dynamo, lambda, pipeline }[view](AWS)) ||
    `<a href= ?view=pipeline&accessKeyId=${accessKeyId}&secretAccessKey=${secretAccessKey}>Pipeline List</a> - <a href= ?view=dynamo&accessKeyId=${accessKeyId}&secretAccessKey=${secretAccessKey}>Dynamo List</a> - <a href= ?view=lambda&accessKeyId=${accessKeyId}&secretAccessKey=${secretAccessKey}>Lambda List</a>`
  );
};
