const dynamo = async (AWS) => {
  const dynamo = new AWS.DynamoDB();
  console.log("running dynamoTables function");
  let tableParams = {};
  const tableData = await dynamo.listTables(tableParams).promise();
  let tableList = {
    TablesList: [],
  };
  const list = tableData.TableNames.map((item) => {
    return tableList.TablesList.push([item]);
  });
  return tableList;
};

module.exports = {
  dynamo: dynamo,
};
