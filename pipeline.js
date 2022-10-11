const pipeline = async (AWS) =>{
    const pipeLine = new AWS.DataPipeline
    const pipeLinesParams = {}
    const allPipeLines = [];
    let data = { nextToken: true };
  while (data.nextToken) {
    data = await pipeLine.listPipelines(pipeLinesParams).promise();
    allPipeLines.push(...data);
    params.Token = data.nextToken;
  }
//   allPipeLines.map(pipe =>{

//   })
return console.log(data);

}

module.exports = {
    pipeline: pipeline,
  };