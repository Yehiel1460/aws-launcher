const AWS = require("aws-sdk");
const {dynamoTables} = require('./dynamo')
exports.handler = async (event) => {
  console.log({ event });
  const lambda = new AWS.Lambda();
  // const dynamo = new AWS.DynamoDB();
  const viewValue = {
    view: event.queryStringParameters.view,
  };

  let params = {
    MaxItems: 50,
  };
  // let tableParams = {};

  // const tableData = await dynamo.listTables(tableParams).promise();

  const allLambdas = [];
  let data = { NextMarker: true };
  while (data.NextMarker) {
    data = await lambda.listFunctions(params).promise();
    allLambdas.push(...data.Functions);
    params.Marker = data.NextMarker;
  }

  allLambdas.sort((a, b) => {
    const nameA = a.LastModified;
    const nameB = b.LastModified;
    if (nameA > nameB) return -1;
    if (nameA < nameB) return 1;
    return 0;
  });

  const appList = {};
  for (const lambda of allLambdas) {
    const firstHalf = lambda.Role.indexOf("/");
    const secHalf = lambda.Role.indexOf("-");
    const appName = lambda.Role.slice(firstHalf + 1, secHalf);
    if (!appList[appName]) {
      appList[appName] = [lambda.FunctionName];
    } else {
      appList[appName].push(lambda.FunctionName);
    }
  }

  let lambdaHtml = "";
  for (const [header, functions] of Object.entries(appList)) {
    lambdaHtml += `<h1>${header}</h1><br>`;
    for (const functionName of functions) {
      lambdaHtml += `<a href="https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/${functionName}">${functionName}<a/> - <a href= "https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${functionName}/log-events">logs<a/><br>`;
    }
  }

  // let tableList = tableData.TableNames.map(
  //   (table) =>
  //     `<a href="https://us-east-1.console.aws.amazon.com/dynamodbv2/home?region=us-east-1#item-explorer?initialTagKey=&table=${table}">${table}</a><br>`
  // ).join("");

  const lambdaOrDynamo = (view) => {
    if (view === "dynamo") {
      return "<h1>Table List</h1>" + dynamoTables();
    } else {
      return lambdaHtml;
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
