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
        {label:'table',url:`/dynamodbv2/home?region=us-east-1#item-explorer?initialTagKey=&table=${id}`},
        {label:'index',url:`/dynamodbv2/home?region=us-east-1#table?initialTagKey=&name=${id}&tab=indexes`},
      ];
    },
  };
  return res;
};

module.exports = {
  dynamo: dynamo,
};
