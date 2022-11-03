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
        {label:id ,url:`/lambda/home?region=us-east-1#/functions/${id}`},
        {label:'logs',url:`/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${id}/log-events`},
        {label:'logs insights',url:`/cloudwatch/home?region=us-east-1#logsV2:logs-insights$3FqueryDetail$3D$257E$2528end$257E0$257Estart$257E-3600$257EtimeType$257E$2527RELATIVE$257Eunit$257E$2527seconds$257EeditorString$257E$2527fields*20*40timestamp*2c*20*40message*0a*7c*20sort*20*40timestamp*20desc*0a*7c*20limit*2020$257EisLiveTail$257Efalse$257EqueryId$257E$2527e8e5d504-a9d5-4961-84dc-4d25882490b6$257Esource$257E$2528$257E$2527*2faws*2flambda*2f${id}$2529$2529`},
      ];
    },
  };
  return res;
};

module.exports = {
  lambda: lambda,
};