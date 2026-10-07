/**
 * NETLIFY SERVERLESS FUNCTION: GROQ CLOUD AI PROXY
 * Tác dụng: Cung cấp API AI trực tuyến cho toàn bộ khách truy cập web mà KHÔNG cần
 * người dùng phải tự nhập API Key. API Key được bảo mật tuyệt đối trong Biến môi trường (Environment Variable) của Netlify.
 */

exports.handler = async function (event, context) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Xử lý preflight request CORS OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'ok' })
    };
  }

  // Chỉ chấp nhận POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed. Vui lòng sử dụng POST.' })
    };
  }

  try {
    // 1. Lấy API Key từ biến môi trường của Netlify
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          error: 'Chưa cấu hình GROQ_API_KEY trong Netlify Environment Variables.',
          configured: false
        })
      };
    }

    // 2. Phân tích dữ liệu gửi lên từ client
    let requestData = {};
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseErr) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Dữ liệu JSON không hợp lệ.' })
      };
    }

    const {
      prompt,
      messages,
      systemPrompt,
      model = 'openai/gpt-oss-120b',
      temperature = 0.7,
      max_tokens = 1500,
      response_format
    } = requestData;

    // 3. Chuẩn hóa danh sách messages cho OpenAI-compatible API của Groq
    let finalMessages = [];

    if (Array.isArray(messages) && messages.length > 0) {
      finalMessages = [...messages];
      if (systemPrompt && finalMessages[0]?.role !== 'system') {
        finalMessages.unshift({ role: 'system', content: systemPrompt });
      }
    } else if (prompt) {
      if (systemPrompt) {
        finalMessages.push({ role: 'system', content: systemPrompt });
      }
      finalMessages.push({ role: 'user', content: prompt });
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Thiếu nội dung prompt hoặc messages.' })
      };
    }

    // Danh sách model ưu tiên tự động fallback nếu một model không có quyền truy cập
    const candidateModels = [
      model,
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'qwen/qwen3.8-27b',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant'
    ].filter(Boolean);
    const uniqueModels = [...new Set(candidateModels)];

    let successData = null;
    let usedModel = uniqueModels[0];
    let lastError = null;

    // 4. Thử gọi các model khả dụng
    for (const m of uniqueModels) {
      const groqPayload = {
        model: m,
        messages: finalMessages,
        temperature: Number(temperature) || 0.7,
        max_tokens: Number(max_tokens) || 1500
      };

      if (response_format && response_format.type === 'json_object') {
        groqPayload.response_format = { type: 'json_object' };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(groqPayload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (groqResponse.ok) {
          successData = await groqResponse.json();
          usedModel = m;
          break;
        } else {
          const errText = await groqResponse.text();
          lastError = errText;
          console.warn(`Groq model ${m} returned ${groqResponse.status}:`, errText);
        }
      } catch (callErr) {
        clearTimeout(timeoutId);
        lastError = callErr.message;
      }
    }

    if (!successData) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: `Tất cả các mô hình Groq đều không phản hồi: ${lastError}`
        })
      };
    }

    const choice = successData.choices?.[0]?.message;
    const content = choice?.content || choice?.reasoning || '';

    // 5. Trả kết quả thành công về cho Frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: content,
        model: successData.model || usedModel,
        usage: successData.usage
      })
    };

  } catch (error) {
    console.error('Netlify Function Proxy Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};
