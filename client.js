const client = async (currentType) => {
//   let result = "";
//   result = `<script>if(!localStorage.getItem("currentRes")){localStorage.setItem("currentRes", JSON.stringify("${currentType}"))}else{localStorage.getItem("currentRes")}</script>`;
let html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
<h1>Hello</h1>
<script src="./script.js" type="module"></script>
</body>
</html>
`
return html;
};

module.exports = {
  client: client,
};


