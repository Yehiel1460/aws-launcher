const dynamo = async (AWS) => {
  const dynamo = new AWS.DynamoDB();
  console.log("running dynamoTables function");
  let tableParams = {};
  const tableData = await dynamo.listTables(tableParams).promise();

  const tableList = tableData.TableNames.map(
    (table) =>
      `<div><h4 style="display: inline;">${table}: </h4><a href="https://us-east-1.console.aws.amazon.com/dynamodbv2/home?region=us-east-1#item-explorer?initialTagKey=&table=${table}">explore</a></div><br>`
  ).join("");
  return "<h1>Table List</h1>" + tableList;
};

module.exports = {
  dynamo: dynamo,
};