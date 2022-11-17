const AWS = require("aws-sdk");
const { cacheTrueOrFalse } = require("./client.js");

exports.handler = async (event) => {
  console.log({ event });
  const viewValue = {
    view: event.queryStringParameters.view,
    cache: event.queryStringParameters.cache,
  };
  const accessKeyId = event.queryStringParameters.accessKeyId;
  const secretAccessKey = event.queryStringParameters.secretAccessKey;
  AWS.config.update({
    MasterRegion: "us-east-1",
    accessKeyId: accessKeyId,
    secretAccessKey: decodeURI(secretAccessKey),
  });
  try {
    const response = {
      statusCode: 200,
      body: await cacheTrueOrFalse(viewValue.cache,accessKeyId,secretAccessKey,viewValue.view),
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