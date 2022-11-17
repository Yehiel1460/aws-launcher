const AWS = require("aws-sdk");
const { lambda } = require("./lambda.js");
const { dynamo } = require("./dynamo.js");
const { pipeline } = require("./pipeline.js");
const { css } = require("./css.js");

const client = async (typeName, listType,accessKeyId,secretAccessKey) => {
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
  </div>
  <table class="mainDiv"></table>
  <style>
  ${css()}
  </style>
  <script type="text/javascript">
  const getFromLocalStorage = async() =>{
    const getTime = localStorage.getItem("expierdLocalStorage");
    const localStorageTime = new Date(getTime)
    const now = new Date();
    if(localStorageTime?.getFullYear() === now.getFullYear() &&
    localStorageTime.getMonth() === now.getMonth() &&
    localStorageTime.getDate() === now.getDate()){
    const table = document.querySelector(".mainDiv")
    let getFromLocalStorage = localStorage.getItem('${typeName}');
    return table.innerHTML = getFromLocalStorage;    
    }
    else{
    localStorage.setItem('expierdLocalStorage', new Date());
    localStorage.setItem('${typeName}', '${await currentList(typeName, AWS, listType,accessKeyId,secretAccessKey)}');
    const table = document.querySelector(".mainDiv")
    let getFromLocalStorage = localStorage.getItem('${typeName}');
    return table.innerHTML = getFromLocalStorage;
    }
  }
  getFromLocalStorage()
  </script>
  </body>
  </html>
  `;
  return html;
};

const cacheTrueOrFalse = (cache,accessKeyId,secretAccessKey,view)=>{
  if (!cache){
    return getViewResult(accessKeyId, secretAccessKey,view);
  }
  else{
    const listType = { dynamo, lambda, pipeline };
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
    <nav>${getDefaultHtml(listType, accessKeyId, secretAccessKey,view,cache)}</nav>
    </div>
    <table class="mainDiv"></table>
    <style>
    ${css()}
    </style>
    <script type="text/javascript">
    const getFromLocalStorage = async() =>{
      const getTime = localStorage.getItem("expierdLocalStorage");
      const table = document.querySelector(".mainDiv")
      let getFromLocalStorage = localStorage.getItem('${view}');
      return table.innerHTML = getFromLocalStorage;
    }
    getFromLocalStorage()
    </script>
    </body>
    </html>
    `;
   return html;
  }
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

const getDefaultHtml = (listType, accessKeyId, secretAccessKey,typeName,cache) => {
  let defaultHtml = "";
  for (const [type] of Object.entries(listType)) {
    const changeColorByType = typeName === type? '#ffe54c': '#fff';
    defaultHtml += `<a style="background-color:${changeColorByType}" class="button" href="?view=${type}&cache="${cache}"&accessKeyId=${accessKeyId}&secretAccessKey=${encodeURIComponent(secretAccessKey)}">${type}</a>`;
  }
  return defaultHtml;
};

const getViewResult = async (accessKeyId, secretAccessKey, view) => {
  if (!accessKeyId || !secretAccessKey) {
    return `<form onsubmit="window.location = window.location + ?view="view.value"&accessKeyId=accessKeyId.value&secretAccessKey=encodeURIComponent(secretAccessKey.value)">
    <input style="display:none;" id="view" value="lambda" type="search" name="view"></input>
    <input style="display:none;" id="cache" value="false" type="search" name="cache"></input>
    <input id="accessKeyId" placeholder="Enter Access Key Id" type="search" name="accessKeyId" required></input>
    <input id="secretAccessKey" placeholder="Enter Secret Access Key" type="search" name="secretAccessKey" required></input>
    <button style="cursor:pointer">Get Link</button>
    </form>`;
  }
  const listType = { dynamo, lambda, pipeline };
  return (
    client(view, listType,accessKeyId,secretAccessKey)
  );
};

module.exports = {
  cacheTrueOrFalse: cacheTrueOrFalse,
};