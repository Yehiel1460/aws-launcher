const client = async (currentType) => {
  const type = JSON.stringify(currentType);
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
  <script type="text/javascript">if (localStorage.getItem("currentRes") != ${type}) {
  localStorage.setItem("currentRes", ${type});
  const div = document.querySelector(".mainDiv")
  let getFromLocalStorage = localStorage.getItem("currentRes");
  div.innerHTML = getFromLocalStorage;
  } else {
  const div = document.querySelector(".mainDiv")
  let getFromLocalStorage = localStorage.getItem("currentRes");
  div.innerHTML = getFromLocalStorage;
  }
  </script>
  </body>
  </html>
  `;
  console.log({html});
  return html;
  };
  
  module.exports = {
    client: client,
  };



