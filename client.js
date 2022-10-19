const client = async (currentType) => {
  let result = '';
  result = `<script>if(!localStorage.getItem("currentRes")){<localStorage.setItem("currentRes", JSON.stringify(${currentType}))}else{localStorage.getItem("currentRes")}</script>`;
  return result;
};

module.exports = {
  client: client,
};
