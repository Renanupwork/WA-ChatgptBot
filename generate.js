
const axios = require("axios");

const DEFAULT_PARAMS = {
  "model": "text-davinci-003",
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "stop": [" Human:", " AI:"],
}

async function query(params = {}) {
  const params_ = { ...DEFAULT_PARAMS, ...params };

  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + String('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')
    }
  };
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', params_,requestOptions);
    return response.data.choices[0].text;
  } catch (err) {
    return 'error';
  }
}

module.exports = query;