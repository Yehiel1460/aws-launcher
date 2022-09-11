const AWS = require("aws-sdk");
exports.handler = async (event) => {
  AWS.config.update({
    MasterRegion: "us-east-1",
    accessKeyId: "AKIAWXJTZ6P7OHXTK4XL",
    secretAccessKey: "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",
  });
  const lambda = new AWS.Lambda();
  const params = {
    FunctionVersion: "ALL",
    // Marker: 'STRING_VALUE',
    // MasterRegion: "us-east-1",
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
      return (func.FunctionName)
    }))
  };
  return response;
};