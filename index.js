const AWS = require("aws-sdk");
exports.handler = async (event) => {
  const lambda = new AWS.Lambda();
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
    const nameA = a.FunctionName.toUpperCase();
    const nameB = b.FunctionName.toUpperCase();
    if (nameA < nameB) -1;
    if (nameA > nameB) 1;
    return 0;
  });

  console.log(allLambdas.length);

  const response = {
    statusCode: 200,
    body: 
    allLambdas.map((func) => {
        return `<a href="https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/${func.FunctionName}">${func.FunctionName}<a/> -
      <a href= "https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${func.FunctionName}/log-events">logs<a/><br>`;
      })
      .join(""),
    headers: {
      "Content-Type": "text/html"
    },
  };
  return response;
};
