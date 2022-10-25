const pipeline = async (AWS) => {
  console.log("running pipeline");
  const pipeLine = new AWS.CodePipeline();
  const pipeLinesParams = {};
  let pipelineData = await pipeLine.listPipelines(pipeLinesParams).promise();
  let pipelineList = {
    pipelinesList: [],
  };
  const list = pipelineData.pipelineIdList.map((item) => {
    return pipelineList.pipelinesList.push([item]);
  });
  return pipelineList;
};

module.exports = {
  pipeline: pipeline,
};
