console.log("included");

// variables deleclaration
const customParameterDiv = document.getElementById("customParameters");
const jsonDiv = document.getElementById("jsonDiv");

const urlInp = document.getElementById("urlInp");
const contentTypeBox = document.getElementById("contentTypeBox");

const submitBtn = document.getElementById("submitBtn");

const customParameterRadio = document.getElementById("contentType_Custom");
const jsonParameterRadio = document.getElementById("contentType_JSON");

const customParaAddBtn = document.getElementById("addNewParameters");

const reqType_Get = document.getElementById("get");
const reqType_Post = document.getElementById("post");

const jsonContent = document.getElementById("requestJsonText");

const bottonDiv = document.getElementById("bottonDiv");

let cntForCustomHtml = 1;

const responseDiv = document.getElementById("responseDiv");

const prismElement = document.getElementById("response-prism");

const loader = document.getElementById("loader");

// intial settings
customParameterDiv.style.display = "none";
customParaAddBtn.style.display = "none";
contentTypeBox.style.display = "none";
jsonDiv.style.display = "none";

// content type settings
customParameterRadio.addEventListener("click", () => {
  jsonDiv.style.display = "none";
  customParameterDiv.style.display = "block";
  customParaAddBtn.style.display = "block";
  // responseDiv.innerHTML = "";
});

jsonParameterRadio.addEventListener("click", () => {
  jsonDiv.style.display = "flex";
  customParameterDiv.style.display = "none";
  customParaAddBtn.style.display = "none";
});

reqType_Get.addEventListener("click", () => {
  jsonDiv.style.display = "none";
  contentTypeBox.style.display = "none";
  customParaAddBtn.style.display = "none";
});

reqType_Post.addEventListener("click", () => {
  jsonDiv.style.display = "flex";
  contentTypeBox.style.display = "block";
});

// customParameters Add Button
customParaAddBtn.addEventListener("click", () => {
  customParameterDiv.innerHTML += `<div class="input-group mb-2">
                <input type="text" class="form-control mx-3" placeholder="Key" id="paraKey_${cntForCustomHtml}">
                <input type="text" class="form-control mx-3" placeholder="Value"  id="paraVal_${cntForCustomHtml}">
                <button class="btn btn-info deleteParameterBtns">-</button>
            </div>`;
  cntForCustomHtml++;

  // delete Parameter button
  const deleteParaBtns = document.getElementsByClassName("deleteParameterBtns");
  for (btn of deleteParaBtns) {
    btn.addEventListener("click", (e) => {
      e.target.parentElement.remove();
    });
  }
});

function request(url) {
  // checking req type and selecting it.
  const reqType = reqType_Get.checked == true ? "GET" : "POST";
  let data = null;

  // loader
  loader.classList.add("loader");
  loader.style.animationDuration = "30s";

  // if reqType = post then we have to collect the data from user.
  if (reqType == "POST") {
    const contentType =
      customParameterRadio.checked == true ? "custom" : "json";

    if (contentType == "custom") {
      data = {};
      for (let i = 1; i < cntForCustomHtml; i++) {
        if (document.getElementById(`paraKey_${i}`)) {
          let key = document.getElementById(`paraKey_${i}`).value;
          let value = document.getElementById(`paraVal_${i}`).value;
          data[key] = value;
        }
      }
      data = JSON.stringify(data);
    } else {
      data = jsonContent.value;
    }
  }

  // xhr request
  const xhrObj = new XMLHttpRequest();
  xhrObj.open(reqType, url, true);

  xhrObj.onload = function () {
    loader.style.animationDuration = "6s";

    setTimeout(() => {
      if (this.status == 200) {
        prismElement.innerHTML = JSON.stringify(
          JSON.parse(this.responseText),
          null,
          4
        );
        Prism.highlightAll(); //for highlightText
      } else if (this.status == 201) {
        // post req
        console.log("succuss, post request made successfully.");
        prismElement.innerHTML = JSON.stringify(
          JSON.parse(this.responseText),
          null,
          4
        );
        Prism.highlightAll(); // for highlightText
      } else {
        prismElement.innerHTML = "😬Something went wrong!!";
      }
      loader.classList.remove("loader");
    }, 4000);
  };

  if (reqType == "POST") {
    xhrObj.setRequestHeader("content-type", "application/json");
    xhrObj.send(data);
  } else {
    xhrObj.send();
  }
}

// submit button
submitBtn.addEventListener("click", () => {
  prismElement.innerHTML = "You Will Get Your Response Here.";
  const url = urlInp.value;
  request(url);
});
