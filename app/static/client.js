const treeInfo = {
  PLA: {
    name: "London plane",
    binomial: "Platanus × acerifolia",
    link: "https://en.wikipedia.org/wiki/Platanus_%C3%97_acerifolia"
  },
  ACE: {
    name: "Field maple",
    binomial: "Acer campestre",
    link: "https://en.wikipedia.org/wiki/Acer_campestre"
  },
  CAS: {
    name: "Sweet chestnut",
    binomial: "Castanea sativa",
    link: "https://en.wikipedia.org/wiki/Castanea_sativa"
  },
  QUE: {
    name: "European oak",
    binomial: "Quercus robur",
    link: "https://en.wikipedia.org/wiki/Quercus_robur"
  }
};

var $ = x => document.querySelector(x);

function showPicker(inputId) {
  $("#file-input").click();
}

function showPicked(input) {
  $(".image").hidden = false;
  $("#thanks").hidden = true
  $("#feedback").hidden = true

  $("#upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    $("#image-picked").src = e.target.result;
    $("#image-picked").hidden = false;
  };
  reader.readAsDataURL(input.files[0]);

  analyze();
}

function analyze() {
  var uploadFiles = $("#file-input").files;
  if (uploadFiles.length != 1) alert("Please select 1 file to analyze!");

  const el = $("#result");
  el.hidden = false;
  el.innerHTML = "Uploading &amp; analysing...";
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", "/analyze", true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
      showResult(response);
    }
  };

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}

function showResult(response) {
  const code = response.result;
  const info = treeInfo[code];
  $("#result").innerHTML = `<strong>${info.name}</strong> (<em>${
    info.binomial
  }</em>) <p><a href="${info.link}" target="_blank">About this species</a></p>`;

  $("#feedback").hidden = false;
  const classes = Object.keys(treeInfo);
  for (let cls in treeInfo) {
    const buttonEl = $(`button[name=${cls}]`);
    buttonEl.value = response.name;
    if (cls === code) {
      buttonEl.innerHTML = `Yes it's ${treeInfo[cls].name}`;
      buttonEl.className = "correct";
    } else {
      buttonEl.innerHTML = `No it's ${treeInfo[cls].name}`;
      buttonEl.className = "incorrect";
    }
  }
}

function sendFeedback(el) {
  if (el.name === "YES") {
    showThanks();
    return;
  }
  const id = el.value;
  const actual = el.name;

  fetch("/feedback", {
    method: "POST",
    body: JSON.stringify({ id, actual })
  }).then(showThanks);
}

function showThanks() {
    $('#feedback').hidden = true
    $('#thanks').hidden = false
}
