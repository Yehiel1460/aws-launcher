const script = (currentType)=>{
    if (!localStorage.getItem("currentRes")) {
        localStorage.setItem("currentRes", JSON.stringify(currentType));
      } else {
        localStorage.getItem("currentRes");
      }
}

module.exports = {
    script: script,
  };
