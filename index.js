const AWS = require("aws-sdk");
exports.handler = async (event) => {
  AWS.config.update({
    MasterRegion: "us-east-1",
    accessKeyId: "",
    secretAccessKey: "",
  });
  const lambda = new AWS.Lambda();
  const params = {
    FunctionVersion: "ALL",
    MaxItems: 50,
  };
let data
  const getLambdas = async () => {
    data = await lambda.listFunctions(params).promise();
    console.log(data);
    return data
  };
  await getLambdas(params);
  const response = {
    statusCode: 200,
    body: JSON.stringify(data.Functions.map((func)=>{
      return {url: "https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/" + func.FunctionName, name: func.FunctionName}
    }))
  };
  return response;
};
