const AWS = require("aws-sdk");
const { lambda } = require("./lambda.js");
const { dynamo } = require("./dynamo.js");
const { pipeline } = require("./pipeline.js");

const client = async (typeName, listType) => {
  const currentType = await currentList(typeName, AWS, listType);
  let html = `
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aws-launcher</title>
  </head>
  <body>
  <div class="mainDiv"></div>
  <script type="text/javascript">if (localStorage.getItem('${typeName}') != '${currentType}') {
  localStorage.setItem('${typeName}', '${currentType}');
    const div = document.querySelector(".mainDiv")
  let getFromLocalStorage = localStorage.getItem('${typeName}');
  div.innerHTML = getFromLocalStorage;
  } else {
  const div = document.querySelector(".mainDiv")
  let getFromLocalStorage = localStorage.getItem('${typeName}');
  div.innerHTML = getFromLocalStorage;
  }
  </script>
  </body>
  </html>
  `;
  return html;
};

const currentList = async (typeName, AWS, listType) => {
  const currentType = await listType[typeName]?.(AWS);
  console.log({ currentType });
  let htmlList = "";
  for (const [header, functions] of Object.entries(currentType)) {
    htmlList += `<h1>${header}</h1><br>`;
    for (const functionName of functions) {
      const type = {
        lambda: `/lambda/home?region=us-east-1#/functions/${functionName}`,
        dynamo: `/dynamodbv2/home?region=us-east-1#item-explorer?initialTagKey=&table=${functionName}`,
        pipeline: `/codesuite/codepipeline/pipelines/${functionName}/view?region=us-east-1`,
      };
      htmlList += `<div><h4 style="display: inline;">${functionName}: </h4><a href="https://us-east-1.console.aws.amazon.com${type[typeName]}">${typeName}<a/> - <a href= "https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${functionName}/log-events">logs<a/></div><br>`;
    }
  }
  console.log({ htmlList });
  return htmlList;
};

const getDefaultHtml = (listType, accessKeyId, secretAccessKey) => {
  let defaultHtml = "";
  for (const [type] of Object.entries(listType)) {
    defaultHtml += `<a href="?view=${type}&accessKeyId=${accessKeyId}&secretAccessKey=${secretAccessKey}">${type} List</a><br>`;
  }
  return defaultHtml;
};

const getViewResult = async (accessKeyId, secretAccessKey, view) => {
  if (!accessKeyId) {
    return "<p>Please enter accessKeyId and secretAccessKey</p>";
  }
  const listType = { dynamo, lambda, pipeline };
  // const currentType = await listType[view]?.(AWS);
  return (
    client(view, listType) ||
    getDefaultHtml(listType, accessKeyId, secretAccessKey)
  );
};

module.exports = {
  getViewResult: getViewResult,
};
