// var webkam = {
//   // (A) INITIALIZE
//   worker : null, // tesseract worker
//   hVid : null, hGo :null, hRes : null, // html elements
//   init : () => {
//     // (A1) GET HTML ELEMENTS
//     webkam.hVid = document.getElementById("vid"),
//     webkam.hGo = document.getElementById("go"),
//     webkam.hRes = document.getElementById("result");

//     // (A2) GET USER PERMISSION TO ACCESS CAMERA
//     navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }})
//     .then(async (stream) => {
//       // (A2-1) CREATE ENGLISH TESSERACT WORKER
//       webkam.worker = await Tesseract.createWorker();
//       await webkam.worker.loadLanguage("eng");
//       await webkam.worker.initialize("eng");

//       // (A2-2) WEBCAM LIVE STREAM
//       webkam.hVid.srcObject = stream;
//       webkam.hGo.onclick = webkam.snap;
//     })
//     .catch(err => console.error(err));
//   },

//   // (B) SNAP VIDEO FRAME TO TEXT
//   snap : async () => {
//     // (B1) CREATE NEW CANVAS
//     let canvas = document.createElement("canvas"),
//         ctx = canvas.getContext("2d"),
//         vWidth = webkam.hVid.videoWidth,
//         vHeight = webkam.hVid.videoHeight;
  
//     // (B2) CAPTURE VIDEO FRAME TO CANVAS
//     canvas.width = vWidth;
//     canvas.height = vHeight;
//     ctx.drawImage(webkam.hVid, 0, 0, vWidth, vHeight);

//     // (B3) CANVAS TO IMAGE, IMAGE TO TEXT
//     const res = await webkam.worker.recognize(canvas.toDataURL("image/png"));
//     webkam.hRes.value = res.data.text;
//   },
// };
// window.addEventListener("load", webkam.init);



function filterLicenseInfo(text) {
  // Ищем соответствие шаблону для информации о водительском удостоверении
  const regex = /DRIVER LICENSE[\s\S]*?(?=\n\S)/;
  const match = regex.exec(text);

  if (match) {
    const licenseInfo = match[0];

    // Находим ID в информации о водительском удостоверении
    const idRegex = /ID: (\d+)/;
    const idMatch = idRegex.exec(licenseInfo);
    const id = idMatch ? idMatch[1] : "ID не найден";

    // Находим адрес в информации о водительском удостоверении
    const addressRegex = /\d+ [A-Za-z ]+/g;
    const addressMatch = licenseInfo.match(addressRegex);
    const address = addressMatch ? addressMatch.join("\n") : "Адрес не найден";

    // Находим дату рождения и дату выдачи
    const dobRegex = /DOB: (\d+-\d+-\d+)/;
    const issuedRegex = /ISSUED: (\d+-\d+-\d+)/;
    const dobMatch = dobRegex.exec(licenseInfo);
    const issuedMatch = issuedRegex.exec(licenseInfo);
    const dob = dobMatch ? dobMatch[1] : "Дата рождения не найдена";
    const issued = issuedMatch ? issuedMatch[1] : "Дата выдачи не найдена";

    return `DRIVER LICENSE\nID: ${id}\n${address}\nDOB: ${dob} ISSUED: ${issued}`;
  } else {
    return "Информация о водительском удостоверении не найдена";
  }
}

var webkam = {
  // (A) INITIALIZE
  worker : null, // tesseract worker
  hVid : null, hGo :null, hRes : null, // html elements
  init : () => {
    // (A1) GET HTML ELEMENTS
    webkam.hVid = document.getElementById("vid"),
    webkam.hGo = document.getElementById("go"),
    webkam.hRes = document.getElementById("result");

    // (A2) GET USER PERMISSION TO ACCESS CAMERA
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }})
    .then(async (stream) => {
      // (A2-1) CREATE ENGLISH TESSERACT WORKER
      webkam.worker = await Tesseract.createWorker();
      await webkam.worker.loadLanguage("eng");
      await webkam.worker.initialize("eng");

      // (A2-2) WEBCAM LIVE STREAM
      webkam.hVid.srcObject = stream;
      webkam.hGo.onclick = webkam.snap;
    })
    .catch(err => console.error(err));
  },

  // (B) SNAP VIDEO FRAME TO TEXT
  snap : async () => {
    // (B1) CREATE NEW CANVAS
    let canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        vWidth = webkam.hVid.videoWidth,
        vHeight = webkam.hVid.videoHeight;
  
    // (B2) CAPTURE VIDEO FRAME TO CANVAS
    canvas.width = vWidth;
    canvas.height = vHeight;
    ctx.drawImage(webkam.hVid, 0, 0, vWidth, vHeight);

    // (B3) CANVAS TO IMAGE, IMAGE TO TEXT
    const res = await webkam.worker.recognize(canvas.toDataURL("image/png"));
    const filteredText = filterLicenseInfo(res.data.text); // Фильтрация текста
    webkam.hRes.value = filteredText;
  },
};
window.addEventListener("load", webkam.init);
