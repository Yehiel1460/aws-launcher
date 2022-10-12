const AWS = require("aws-sdk");
const { dynamo } = require("./dynamo.js");
const { lambda } = require("./lambda.js");
const { pipeline } = require("./pipeline.js");

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

const getDefaultHtml = (listType, accessKeyId, secretAccessKey) => {
  let defaultHtml;
  for (const [type] of Object.entries(listType)) {
    console.log(type)
    defaultHtml += `<a href= ?view=${type}&accessKeyId=${accessKeyId}&secretAccessKey=${secretAccessKey}>${type} List</a> - `;
  }
  return defaultHtml;
};
const getViewResult = async (accessKeyId, secretAccessKey, view) => {
  if (!accessKeyId) {
    return "<p>Please enter accessKeyId and secretAccessKey</p>";
  }
  const listType = { dynamo, lambda, pipeline };
  return (
    (await listType[view]?.(AWS)) ||
    getDefaultHtml(listType, accessKeyId, secretAccessKey)
  );
};
