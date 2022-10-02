const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();
const lambdaFunctions = async () => {
  console.log("runing lambdaFunctions");
  let params = {
    MaxItems: 50,
  };

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
  return lambdaHtml;
};

module.exports = {
  lambdaFunctions: lambdaFunctions,
};
