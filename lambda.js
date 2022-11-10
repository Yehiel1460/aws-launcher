const lambda = async (AWS) => {
  const lambda = new AWS.Lambda();
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
  const res = {
    list: appList,
    links: function (id) {
      return [
        {label:'lambda' ,url:`/lambda/home?region=us-east-1#/functions/${id}`},
        {label:'logs',url:`/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${id}/log-events`},
        {label:'logs insights',url:`/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${id}/log-events$3Fstart$3D-60000`},
      ];
    },
  };
  return res;
};

module.exports = {
  lambda: lambda,
};