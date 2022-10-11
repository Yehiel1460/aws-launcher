import AWS, { config } from "aws-sdk";
import { dynamo } from "./dynamo.js";
import { lambda } from "./lambda.js";
import { pipeline } from "./pipeline.js";
try {
  exports.handler = async (event) => {
    console.log({ event });
    const viewValue = {
      view: event.queryStringParameters.view,
    };
    const accessKeyId = event.queryStringParameters.accessKeyId;
    const secretAccessKey = event.queryStringParameters.secretAccessKey;
    config.update({
      MasterRegion: "us-east-1",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    const response = {
      statusCode: 200,
      body: await getViewResault(accessKeyId, viewValue.view),
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

const getViewResault = async (accessKeyId, view) => {
  if (!accessKeyId) {
    return "<p>Please enter accessKeyId and secretAccessKey</p>";
  }
  {
    dynamo, lambda, pipeline;
  }
  [view](AWS);

  return `<a href= ?view=dynamo&accessKeyId=${accessKeyId}&secretAccessKey=${secretAccessKey}>Dynamo List</a> - <a href= ?view=lambda&accessKeyId=${accessKeyId}&secretAccessKey=${secretAccessKey}>Lambda List</a>`;
};
