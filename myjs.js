// 모델이 저장된 폴더 경로 (model.json과 metadata.json이 이 폴더 안에 있어야 함)
const URL = "mymodel/";

let model, labelContainer, maxPredictions;

// ---------------------------
// ✅ 모델 초기화 함수
// ---------------------------
async function init() {
    // 모델 파일과 메타데이터 파일 경로 지정
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
   
    // Teachable Machine의 이미지 모델 로드
    model = await tmImage.load(modelURL, metadataURL);

    // 모델이 가진 클래스(분류 항목) 개수 가져오기
    maxPredictions = model.getTotalClasses();

    // 예측 결과를 표시할 HTML 요소 가져오기
    labelContainer = document.getElementById("label-container");

    // 클래스 개수만큼 div를 생성하여 결과 영역에 추가
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

// ---------------------------
// ✅ 이미지 업로드 처리 함수
// ---------------------------
function handleImageUpload(event) {
    // 업로드된 파일 가져오기
    const file = event.target.files[0];
    if (!file) return;  // 파일이 없으면 종료

    // 미리보기 이미지를 표시할 요소 선택
    const imgElement = document.getElementById("uploadedImage");

    // FileReader를 사용하여 파일을 읽기
    const reader = new FileReader();

    // 파일을 모두 읽은 후 실행되는 함수
    reader.onload = function (e) {
        // 읽은 이미지 데이터를 <img> 태그의 src 속성에 적용
        imgElement.src = e.target.result;

        // 이미지가 로드되면 모델 예측 실행
        imgElement.onload = function () {
            predict(imgElement);
        };
    };

    // 파일을 DataURL(이미지 형태)로 읽기 시작
    reader.readAsDataURL(file);
}

// ---------------------------
// ✅ 이미지 예측 함수
// ---------------------------
async function predict(imageElement) {
    // 모델로 이미지 예측 수행
    const prediction = await model.predict(imageElement);

    // 각 클래스별 확률을 화면에 표시
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " +
            prediction[i].probability.toFixed(2); // 확률을 소수점 둘째 자리까지 표시
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

// ---------------------------
// ✅ 초기화 및 이벤트 등록
// ---------------------------
init();  // 페이지 로드 시 모델을 미리 불러오기

// 이미지 업로드 시 handleImageUpload 함수 실행
document.getElementById("imageInput").addEventListener("change", handleImageUpload);
