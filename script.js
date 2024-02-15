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


// function filterLicenseInfo(text) {
//   // Разбиваем текст на строки
//   const lines = text.split('\n');

//   // Создаем объект для хранения информации о водительском удостоверении
//   const licenseInfo = {};

//   // Проходим по каждой строке текста
//   lines.forEach(line => {
//     // Ищем значения ID, DOB и ISSUED в каждой строке
//     if (line.includes('ID:')) {
//       licenseInfo.ID = line.match(/\d+ \d+ \d+/)[0]; // Исправлено регулярное выражение
//     } else if (line.includes('DOB:')) {
//       licenseInfo.DOB = line.match(/\d{2}-\d{2}-\d{2}/)[0];
//     } else if (line.includes('ISSUED:')) {
//       licenseInfo.ISSUED = line.match(/\d{2}-\d{2}-\d{2}/)[0];
//     }
//   });

//   // Преобразуем объект в строку JSON
//   const filteredInfo = JSON.stringify(licenseInfo, null, 2);
//   return filteredInfo;
// }

// // Пример использования
// const scannedText = `
// WWWWH{IH{DDHH}X{H?XEKUW
// < 2 H
// (ORK STATE,
// il
// - HANCED o
// DRIVER LICENSE
// ID: 012 345 678 CLASSD
// DOCUMENT
// SAMPLE, LICENSE 5%
// 2345 ANYPLACE AVE
// ANYTOWN NY 12345 E
// DOB: 06-09-85 =
// b SExF EVES:BR HT:509
// NONE k3
// L NONE
// ISSUED: 09-30-08 aanzors2s
// ckve Npasa B ApkaH3ace — .M
// `;

// const filteredInfo = filterLicenseInfo(scannedText);
// console.log(filteredInfo);


















var webkam = {
  // (A) INITIALIZE
  worker: null, // tesseract worker
  hVid: null, hGo: null, hRes: null, // html elements
  init: () => {
    // (A1) GET HTML ELEMENTS
    webkam.hVid = document.getElementById("vid");
    webkam.hGo = document.getElementById("go");
    webkam.hRes = document.getElementById("result");

    // (A2) GET USER PERMISSION TO ACCESS CAMERA
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
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
  snap: async () => {
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
    const scannedText = res.data.text;

    // (B4) FILTER LICENSE INFO
    const filteredInfo = filterLicenseInfo(scannedText);
    webkam.hRes.value = filteredInfo;
  },
};

window.addEventListener("load", webkam.init);

function filterLicenseInfo(text) {
  // Разбиваем текст на строки
  const lines = text.split('\n');

  // Создаем объект для хранения информации о водительском удостоверении
  const licenseInfo = {};

  // Проходим по каждой строке текста
  lines.forEach(line => {
    // Ищем значения ID, DOB и ISSUED в каждой строке
    if (line.includes('ID:')) {
      licenseInfo.ID = line.match(/\d+ \d+ \d+/)[0]; // Исправлено регулярное выражение
    } else if (line.includes('DOB:')) {
      licenseInfo.DOB = line.match(/\d{2}-\d{2}-\d{2}/)[0];
    } else if (line.includes('ISSUED:')) {
      licenseInfo.ISSUED = line.match(/\d{2}-\d{2}-\d{2}/)[0];
    }
  });

  // Преобразуем объект в строку JSON
  const filteredInfo = JSON.stringify(licenseInfo, null, 2);
  return filteredInfo;
}
