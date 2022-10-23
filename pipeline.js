const pipeline = async (AWS) =>{
    const pipeLine = new AWS.CodePipeline
    const pipeLinesParams = {}
    let pipelineData = await pipeLine.listPipelines(pipeLinesParams).promise();

const pipelineList = pipelineData.pipelineIdList.map((pipeline)=>{
    `<div><h4 style="display: inline;">${pipeline}: </h4><a href= "https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipeline}/view?region=us-east-1">pipeline</a><div><br>`
})
return "<h1>Pipeline List</h1>" + pipelineList
}

module.exports = {
    pipeline: pipeline,
  };