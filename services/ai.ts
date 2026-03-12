
// TODO: 발급받으신 Gemini API 키를 아래에 입력하세요.
// https://aistudio.google.com/app/apikey 에서 무료로 발급 가능합니다.
const API_KEY = "YOUR_GEMINI_API_KEY"; 

export const analyzePropertyImage = async (base64Image: string) => {
  try {
    // API 키가 입력되지 않은 경우 시뮬레이션 데이터를 반환합니다.
    if (API_KEY === "YOUR_GEMINI_API_KEY") {
      console.warn("Gemini API Key가 설정되지 않았습니다. 데모 데이터를 사용합니다.");
      await new Promise(resolve => setTimeout(resolve, 2000)); // 분석 중인 척 시간 벌기
      return {
        소재지: "서울시 서초구 반포동 (논현역 역세권)",
        용도지역: "제2종 일반주거지역",
        대지면적: "220.2㎡ (66.61평)",
        연면적: "537㎡ (162.44평)",
        건물규모: "지하 1층 / 지상 5층",
        주용도: "제2종 근린생활시설",
        주차대수: "4대 (자주식)",
        승강기: "1대 완비",
        준공연도: "2017년 11월 16일",
        매매가: "95억 원 (평당 1억 4,262만)",
        locationIndex: "논현역(7호선, 신분당선) 도보 3분 더블 역세권 및 최상의 가시성",
        investmentSummary: {
          connectivity: "논현역(7호선, 신분당선) 도보 역세권 법인사옥 추천",
          assetQuality: "2017년 준공된 신축급 외관 및 관리 상태 최상",
          suitability: "사옥 및 임대 수익형으로 최적화된 입지 전략"
        }
      };
    }

    // 라이브러리 없이 직접 fetch API를 사용하여 호출 (설치 오류 원천 차단)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // base64에서 데이터 부분만 추출
    const imageData = base64Image.split(",")[1];

    const prompt = `
      이 이미지는 부동산 매물 정보입니다. 이미지에서 다음 정보들을 찾아서 JSON 형식으로 답변해줘.
      반드시 JSON 형식만 출력해. 다른 텍스트는 섞지마.
      {
        "소재지": "",
        "용도지역": "",
        "대지면적": "",
        "연면적": "",
        "건물규모": "",
        "주용도": "",
        "주차대수": "",
        "승강기": "",
        "준공연도": "",
        "매매가": "",
        "locationIndex": "입지적 장점 한줄 요약",
        "investmentSummary": {
          "connectivity": "교통 장점",
          "assetQuality": "건물 상태 장점",
          "suitability": "추천 용도"
        }
      }
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { 
              inline_data: {
                mime_type: "image/jpeg",
                data: imageData
              }
            }
          ]
        }]
      })
    });

    const result = await response.json();
    const text = result.candidates[0].content.parts[0].text;
    
    // JSON 부분만 정제하여 파싱
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("AI 분석 결과 해석 실패");
  } catch (error) {
    console.error("AI 분석 에러:", error);
    throw error;
  }
};
