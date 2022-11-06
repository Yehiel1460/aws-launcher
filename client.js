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
  <table class="mainDiv"></table>
  <style>
  a:link {
  text-decoration: none;
}
a:visited {
  text-decoration: none;
  color:red;
}
a:hover {
  text-decoration: underline;
  background:#66ff66;
}
a:active {
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

const currentList = async (typeName, AWS, listType,accessKeyId,secretAccessKey) => {
  const currentType = await listType[typeName]?.(AWS);
  console.log( currentType.list );
  let htmlList = "";
  htmlList += `<a href="?accessKeyId=${accessKeyId}&secretAccessKey=${secretAccessKey}">Home</a>`;
  for (const [header, functions] of Object.entries(currentType.list)) {
    htmlList += `<tr><thead><th><h1>${header}</h1><th></thead></tr>`;
    for (const functionName of functions) {
      htmlList += `<tr><tbody><td><h4 style="display: inline">${functionName}: </h4></td>`;
      const urlList = await currentType.links(functionName);
      urlList.map((currentItem)=>{
        return htmlList += `<td><a style="letter-spacing: 1px;" href="https://us-east-1.console.aws.amazon.com${currentItem.url}">${currentItem.label}</a></td>`;
      });
    }
    htmlList += `</tr></tbody>`
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
    client(view, listType,accessKeyId,secretAccessKey) ||
    getDefaultHtml(listType, accessKeyId, secretAccessKey)
  );
};

module.exports = {
  getViewResult: getViewResult,
};