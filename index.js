const AWS = require("aws-sdk");
const { getViewResult } = require("./client.js");

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
  try {
    const response = {
      statusCode: 200,
      body: await getViewResult(accessKeyId, secretAccessKey, viewValue.view),
      headers: {
        "Content-Type": "text/html",
      },
    };
    return response;
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
};
