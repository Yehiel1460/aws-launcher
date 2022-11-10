const AWS = require("aws-sdk");
const { getViewResult } = require("./client.js");

exports.handler = async (event) => {
  console.log({ event });
  const viewValue = {
    view: event.queryStringParameters.view,
    cash: event.queryStringParameters.cash,

  };
  const accessKeyId = event.queryStringParameters.accessKeyId;
  const secretAccessKey = event.queryStringParameters.secretAccessKey;
  AWS.config.update({
    MasterRegion: "us-east-1",
    accessKeyId: accessKeyId,
    secretAccessKey: decodeURI(secretAccessKey),
  });

  const cashTrueOrFalse = async(cash)=>{
    if (!cash){
      return await getViewResult(accessKeyId, secretAccessKey, viewValue.view)
    }
    else{
     return res = `
     <script type="text/javascript">
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
     }
     </script>` 
    }
  }
  try {
    const response = {
      statusCode: 200,
      body: cashTrueOrFalse(viewValue.cash),
      headers: {
        "Content-Type": "text/html",
      },
    };
    return response;
  } catch (error) {
    const response = {
      statusCode: 200,
      body: `<p>${error}</p>`,
      headers: {
        "Content-Type": "text/html",
      },
    };
    return response;
  }
};