const dynamo = async (AWS) => {
  const dynamo = new AWS.DynamoDB();
  console.log("running dynamoTables function");
  let tableParams = {};
  const tableData = await dynamo.listTables(tableParams).promise();
  let tableList = {
    TablesList: [],
  };
  tableData.TableNames.map((item) => {
    return tableList.TablesList.push([item]);
  });
  const res = {
    list: tableList,
    links: function (id) {
      return [
        {label:id,url:`/dynamodbv2/home?region=us-east-1#item-explorer?initialTagKey=&table=${id}`},
        {label:'logs',url:`/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${id}/log-events`},
      ];
    },
  };
  return res;
};

module.exports = {
  dynamo: dynamo,
};
