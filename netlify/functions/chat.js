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
      model = 'llama-3.3-70b-versatile',
      temperature = 0.7,
      max_tokens = 1500,
      response_format
    } = requestData;

    // 3. Chuẩn hóa danh sách messages cho OpenAI-compatible API của Groq
    let finalMessages = [];

    if (Array.isArray(messages) && messages.length > 0) {
      finalMessages = [...messages];
      // Nếu có systemPrompt riêng và chưa có role system đầu tiên
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

    // 4. Tạo payload gửi đến Groq Cloud API
    const groqPayload = {
      model: model,
      messages: finalMessages,
      temperature: Number(temperature) || 0.7,
      max_tokens: Number(max_tokens) || 1500
    };

    if (response_format && response_format.type === 'json_object') {
      groqPayload.response_format = { type: 'json_object' };
    }

    // 5. Gọi Groq Cloud API qua native fetch của Node.js 18+
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

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

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API Error:', groqResponse.status, errorText);
      return {
        statusCode: groqResponse.status,
        headers,
        body: JSON.stringify({
          error: `Groq API Error (${groqResponse.status}): ${errorText}`
        })
      };
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices?.[0]?.message?.content || '';

    // 6. Trả kết quả thành công về cho Frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: content,
        model: groqData.model || model,
        usage: groqData.usage
      })
    };

  } catch (error) {
    console.error('Netlify Function Proxy Error:', error);

    const isTimeout = error.name === 'AbortError';
    return {
      statusCode: isTimeout ? 504 : 500,
      headers,
      body: JSON.stringify({
        error: isTimeout ? 'Yêu cầu tới Groq Cloud bị quá thời gian (timeout).' : error.message
      })
    };
  }
};
