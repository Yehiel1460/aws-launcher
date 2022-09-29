const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB();

let tableParams = {};

const dynamoTables = async () => {
  const tableData = await dynamo.listTables(tableParams).promise();

  const tableList = tableData.TableNames.map(
    (table) =>
      `<a href="https://us-east-1.console.aws.amazon.com/dynamodbv2/home?region=us-east-1#item-explorer?initialTagKey=&table=${table}">${table}</a><br>`
  ).join("");
  return tableList;
};

module.exports = {
  tableList: dynamoTables,
};