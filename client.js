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
  console.log( currentType.list );
  let htmlList = "";
  for (const [header, functions] of Object.entries(currentType.list)) {
    htmlList += `<h1>${header}</h1><br>`;
    for (const functionName of functions) {
      htmlList += `<br>`;
      const urlList = await currentType.links(functionName)
      urlList.map((currentItem)=>{
        const test = " - "
        return htmlList += `<a style="letter-spacing: 1px;" href="https://us-east-1.console.aws.amazon.com${currentItem.url}">${currentItem.label}</a>${test}`
      })
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
  return (
    client(view, listType) ||
    getDefaultHtml(listType, accessKeyId, secretAccessKey)
  );
};

module.exports = {
  getViewResult: getViewResult,
};
