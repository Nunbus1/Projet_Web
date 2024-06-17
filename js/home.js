function onCloudClick() {
    console.log("in cloud click");
    document.getElementById("cloud1").style.backgroundColor = "black";
  }
  
  document.addEventListener("click", onCloudClick);
  