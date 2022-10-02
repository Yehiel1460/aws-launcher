const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB();

const dynamoTables = async () => {
  console.log("running dynamoTables function");
  let tableParams = {};
  const tableData = await dynamo.listTables(tableParams).promise();

  const tableList = tableData.TableNames.map(
    (table) =>
      `<a href="https://us-east-1.console.aws.amazon.com/dynamodbv2/home?region=us-east-1#item-explorer?initialTagKey=&table=${table}">${table}</a><br>`
  ).join("");
  return tableList;
};

module.exports = {
  dynamoTables: dynamoTables,
};
