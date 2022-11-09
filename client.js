const AWS = require("aws-sdk");
const { lambda } = require("./lambda.js");
const { dynamo } = require("./dynamo.js");
const { pipeline } = require("./pipeline.js");
const { css } = require("./css.js");

const client = async (typeName, listType,accessKeyId,secretAccessKey) => {
  const currentType = await currentList(typeName, AWS, listType,accessKeyId,secretAccessKey);
  let html = `
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aws-launcher</title>
  </head>
  <body>
  <div class="container">
  <h1 class="page_header">AWS launcher</h1>
  <nav>${getDefaultHtml(listType, accessKeyId, secretAccessKey,typeName)}</nav>
  <input type="text" name="search" placeholder="Search">
  </div>
  <table class="mainDiv"></table>
  <style>
  ${css()}
  </style>
  <script type="text/javascript">if (localStorage.getItem('${typeName}') != '${currentType}') {
  localStorage.setItem('${typeName}', '${currentType}');
    const table = document.querySelector(".mainDiv")
  let getFromLocalStorage = localStorage.getItem('${typeName}');
  table.innerHTML = getFromLocalStorage;
  } else {
  const table = document.querySelector(".mainDiv")
  let getFromLocalStorage = localStorage.getItem('${typeName}');
  table.innerHTML = getFromLocalStorage;
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
    htmlList += `<tr><thead><th><h1 class="app">${header}</h1><th></thead></tr>`;
    for (const functionName of functions) {
      htmlList += `<tr><tbody><td><h4 style="display: inline">${functionName}: </h4></td>`;
      const urlList = await currentType.links(functionName);
      urlList.map((currentItem)=>{
        return htmlList += `<td><a class="link" style="letter-spacing: 1px;" href="https://us-east-1.console.aws.amazon.com${currentItem.url}">${currentItem.label}</a></td>`;
      });
    }
    htmlList += `</tr></tbody>`;
  } 
  console.log({ htmlList });
  return htmlList;
};

const getDefaultHtml = (listType, accessKeyId, secretAccessKey,typeName) => {
  let defaultHtml = "";
  for (const [type] of Object.entries(listType)) {
    const changeColorByType = typeName === type? '#ffe54c': '#fff';
    defaultHtml += `<a style="background-color:${changeColorByType}" class="button" href="?view=${type}&accessKeyId=${accessKeyId}&secretAccessKey=${encodeURIComponent(secretAccessKey)}">${type}</a>`;
  }
  return defaultHtml;
};

const getViewResult = async (accessKeyId, secretAccessKey, view) => {
  if (!accessKeyId || !secretAccessKey) {
    return `<div>
    <input type="text" placeholder="Enter Access Key Id">
    <input type="text" placeholder="Enter Secret Access Key">
    <button>Login</button>
    <div>`;
  }
  const listType = { dynamo, lambda, pipeline };
  return (
    client(view, listType,accessKeyId,secretAccessKey)
  );
};

module.exports = {
  getViewResult: getViewResult,
};