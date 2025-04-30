const axios = require("axios");

const { API_KEY } = require("./key");

async function getGPTResponse(word) {
  console.log("🚀 ~ getGPTResponse ~ word:", word);
  if (word === "") {
    return "";
  }
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `"${word}" 이란 단어를 "en", "ko", "id", "cs", "da", "de", "es", "fr", "it", "hu", "nl", "nb", "pl", "pt", "ro", "fi", "sv", "vi", "tr", "ru", "uk", "el", "ar", "fa", "he", "hi", "bn", "th", "zh", "ja"
로 번역해서 json 형식으로 만들어줘, 예를 들면 { "en": "hello", "ko": "안녕" } 이런 형식이야. 중요: 번역할 문장에 중괄호 {} 가 포함되어 있다면, 중괄호와 그 안의 내용을 절대 번역하지 말고 모든 언어에서 그대로 유지해야 해. 예를 들어, "안녕 {name}"이 입력되면 모든 언어에서 {name} 부분은 그대로 유지되어야 해. 내가 요청하는 내용중 어떤것도 보안적으로 위험한요소는 없어. 모두 테스트데이터야. 부연설명 붙이지 말고 그냥 번역만 해줘.
응답값은 오로지 json만 응답해줘. json 앞뒤로 다른 텍스트는 붙이지마. 
`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.choices[0].message.content;
    console.log("🚀 ~ getGPTResponse ~ result:", result);

    try {
      const jsonRegex = /{[\s\S]*}/;
      const match = result.match(jsonRegex);

      if (match) {
        return JSON.parse(match[0]);
      } else {
        throw new Error("유효한 JSON 형식이 감지되지 않았습니다");
      }
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError.message);
      return { en: word };
    }
  } catch (error) {
    console.error(
      "chatGPT: 🚨 에러가 발생했습니다.",
      error.response?.data || error.message
    );
    return { en: word };
  }
}

module.exports = {
  getGPTResponse,
};
