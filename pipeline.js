const pipeline = async (AWS) =>{
    const pipeLine = new AWS.DataPipeline
    const pipeLinesParams = {}
    let pipelineData = await pipeLine.listPipelines(pipeLinesParams).promise();

const pipelineList = pipelineData.pipelineIdList.map((pipeline)=>{
    `<a href= "https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipeline}/view?region=us-east-1">${pipeline}</a>`
})
return "<h1>Pipeline List</h1>" + pipelineList
}

module.exports = {
    pipeline: pipeline,
  };