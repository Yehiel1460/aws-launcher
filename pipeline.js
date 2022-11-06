const pipeline = async (AWS) => {
  console.log("running pipeline");
  const pipeLine = new AWS.CodePipeline();
  const pipeLinesParams = {};
  let pipelineData = await pipeLine.listPipelines(pipeLinesParams).promise();
  let pipelineList = {
    pipelinesList: [],
  };

  for (const [header, functions] of Object.entries(pipelineData)){
    for (const functionName of functions) {
      pipelineList.pipelinesList.push([functionName.name])
    }
  }
  const res = {
    list: pipelineList,
    links: function (id) {
      return [
        {label:'pipeline' ,url:`/codesuite/codepipeline/pipelines/${id}/view?region=us-east-1`}
      ];
    },
  };
  return res;
};

module.exports = {
  pipeline: pipeline,
};
