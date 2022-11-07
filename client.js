const AWS = require("aws-sdk");
const { lambda } = require("./lambda.js");
const { dynamo } = require("./dynamo.js");
const { pipeline } = require("./pipeline.js");

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
  body {
  color: #222;
  background: #fff;
  font: 100% system-ui;
}
@media (prefers-color-scheme: dark) {
  body {
    color: #eee;
    background: #121212;
  }
  body a {
    color: #809fff;
  }
}
  .container{
    margin-left: 120px;
  }
  .page_header{
    padding-left:80px;
  }
  nav{
    margin-bottom: 20px;
  }
  input {
    margin-left: 40px;
    background-color: #fff;
    border: 2px solid #212121;
    width: 300px;
    height: 35px;
    border-radius: 4px;
    padding: 0 15px;
  }
  input:focus {
    background:#ffe54c;
  }
  input::placeholder {
    font-size: 16px;
    font-weight: bold;
    padding-top: 10px;
    color: #212121;
  }
  .app{
      margin-top: 20px;
      margin-left: 10%;
  }
  .button {
    margin-left: 15px;
    background: #fff;
    backface-visibility: hidden;
    border-radius: .375rem;
    border-style: solid;
    border-width: .125rem;
    box-sizing: border-box;
    color: #212121;
    cursor: pointer;
    display: inline-block;
    font-family: Circular,Helvetica,sans-serif;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -.01em;
    line-height: 1.3;
    padding: .875rem 1.125rem;
    position: relative;
    text-align: left;
    text-decoration: none;
    transform: translateZ(0) scale(1);
    transition: transform .2s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }
  .button:not(:disabled):hover {
    transform: scale(1.05);
    background-color:#ffe54c;
  }
  .button:not(:disabled):hover:active {
    transform: scale(1.05) translateY(.125rem);
  }
  .link:link {
  text-decoration: none;
}
.link:visited {
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
  background:#ffe54c;
}
.link:active {
  text-decoration: underline;
}
  table{
    display:flex;
    flex-direction: column;
  }
  td{
  border: 1px solid;
  width: 150px;
  padding: 5px;
  text-align: left;
  }
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
    htmlList += `</tr></tbody>`
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
  if (!accessKeyId) {
    return "<p>Please enter accessKeyId and secretAccessKey</p>";
  }
  const listType = { dynamo, lambda, pipeline };
  return (
    client(view, listType,accessKeyId,secretAccessKey)
  );
};

module.exports = {
  getViewResult: getViewResult,
};