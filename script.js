
async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
}

function getGenderWeight(gender) {
  return gender === 'female' ? { estrogen: 20, testosterone: 0 } : { estrogen: 0, testosterone: 20 };
}

function analyzeFace(landmarks, gender) {
  const genderWeight = getGenderWeight(gender);
  const results = {
    eyebrow: 10 + genderWeight.estrogen,
    nose: 20 + genderWeight.testosterone,
    lips: 15,
    cheekbone: 10,
    forehead: 15
  };

  // 결과를 시각화
  let resultHTML = "<h2>분석 결과</h2><ul>";
  for (let [feature, score] of Object.entries(results)) {
    resultHTML += `<li>${feature}: ${score}%</li>`;
  }
  resultHTML += "</ul>";
  document.getElementById("result").innerHTML = resultHTML;
}

document.getElementById("imageUpload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const img = await faceapi.bufferToImage(file);
  const canvas = document.getElementById("canvas");
  canvas.getContext("2d").drawImage(img, 0, 0);
  const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
  if (detection) {
    analyzeFace(detection.landmarks, "female"); // 추후 성별 선택값 반영
  } else {
    alert("얼굴을 감지할 수 없습니다.");
  }
});

loadModels();
