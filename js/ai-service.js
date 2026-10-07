/**
 * AI SERVICE: BỘ ĐIỀU PHỐI TRÍ TUỆ NHÂN TẠO TRIẾT HỌC
 * 
 * KIẾN TRÚC ĐA TẦNG (MULTI-TIER ARCHITECTURE):
 * - TẦNG 1 (MẶC ĐỊNH CHO TẤT CẢ MỌI NGƯỜI): Netlify Serverless API Proxy (/api/chat) kết nối tới Groq Cloud
 *   (Mô hình LLaMA-3.3-70B siêu tốc độ, không chặn IP Việt Nam, KHÔNG yêu cầu người dùng nhập API Key).
 * - TẦNG 2 (TÙY CHỌN): Tự nhập API Key cá nhân (Groq hoặc Gemini) lưu trong LocalStorage nếu muốn chạy riêng.
 * - TẦNG 3 (OFFLINE DIALECTIC ENGINE): Động cơ phân tích Triết học Biện chứng tự hành 100%, bảo vệ bài
 *   thuyết trình không bao giờ bị gián đoạn hay báo lỗi ngay cả khi mất mạng.
 */

class PhilosophyAIService {
  constructor() {
    this.proxyUrl = '/api/chat';
    this.groqApiKey = typeof localStorage !== 'undefined' ? (localStorage.getItem('groq_api_key') || '') : '';
    this.geminiApiKey = typeof localStorage !== 'undefined' ? (localStorage.getItem('gemini_api_key') || '') : '';
    this.preferredModel = 'openai/gpt-oss-120b';
    this.geminiModel = 'gemini-1.5-flash';
    this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  // Quản lý API Key cá nhân (Nếu người dùng muốn cấu hình riêng)
  setGroqKey(key) {
    this.groqApiKey = (key || '').trim();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('groq_api_key', this.groqApiKey);
    }
  }

  getGroqKey() {
    return this.groqApiKey;
  }

  setGeminiKey(key) {
    this.geminiApiKey = (key || '').trim();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gemini_api_key', this.geminiApiKey);
    }
  }

  getGeminiKey() {
    return this.geminiApiKey;
  }

  /* ==========================================================================
     CORE LLM DISPATCHER: GỌI PROXY NETLIFY HOẶC KEY DỰ PHÒNG
     ========================================================================== */
  async callAI({ prompt, systemPrompt, messages, jsonMode = false, maxTokens = 1500, temperature = 0.7 }) {
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
    }

    // 1. ƯU TIÊN 1: Gọi Netlify Serverless Proxy (/api/chat -> Groq Cloud)
    try {
      const proxyRes = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: finalMessages,
          model: this.preferredModel,
          temperature: temperature,
          max_tokens: maxTokens,
          response_format: jsonMode ? { type: 'json_object' } : undefined
        })
      });

      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        if (proxyData && proxyData.reply) {
          return proxyData.reply;
        }
      } else {
        const errJson = await proxyRes.json().catch(() => ({}));
        console.info('Netlify Proxy info:', proxyRes.status, errJson.error || '');
      }
    } catch (proxyErr) {
      // Proxy không khả dụng (ví dụ: đang chạy localhost không qua Netlify CLI)
      console.info('Proxy not available or running locally without Netlify CLI. Checking local keys...');
    }

    // 2. ƯU TIÊN 2: Nếu người dùng đã cài Groq Key cá nhân trong máy
    if (this.groqApiKey) {
      try {
        const directGroqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: this.preferredModel,
            messages: finalMessages,
            temperature: temperature,
            max_tokens: maxTokens
          })
        });

        if (directGroqRes.ok) {
          const directData = await directGroqRes.json();
          return directData.choices?.[0]?.message?.content || '';
        }
      } catch (groqErr) {
        console.warn('Direct Groq key call failed:', groqErr);
      }
    }

    // 3. ƯU TIÊN 3: Nếu người dùng có cài Gemini Key cá nhân
    if (this.geminiApiKey) {
      try {
        const combinedPrompt = `${systemPrompt ? systemPrompt + '\n\n' : ''}${prompt || finalMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`;
        return await this.callGemini(combinedPrompt);
      } catch (geminiErr) {
        console.warn('Direct Gemini call failed:', geminiErr);
      }
    }

    // Nếu không có API nào khả dụng, ném lỗi để hàm gọi kích hoạt Smart Offline Fallback Engine
    throw new Error('ALL_AI_PROVIDERS_UNAVAILABLE');
  }

  // Gọi trực tiếp Gemini khi có Gemini Key
  async callGemini(promptText) {
    if (!this.geminiApiKey) throw new Error('Gemini API Key missing');

    const endpoint = `${this.geminiApiUrl}/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`;
    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini error ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const candidate = data.candidates && data.candidates[0];
    if (candidate && candidate.content && candidate.content.parts) {
      return candidate.content.parts.map(p => p.text).join('\n');
    }
    throw new Error('Invalid response structure from Gemini API');
  }

  /* ==========================================================================
     1. TÍNH NĂNG 1: BÁC SĨ TRIẾT HỌC AI (KÊ ĐƠN TỪ TÂM SỰ)
     ========================================================================== */
  async diagnoseTrouble(userStory) {
    const systemPrompt = `Bạn là "Bác Sĩ Triết Học Biện Chứng", chuyên gia hàng đầu về Triết học Mác - Lênin.
Nhiệm vụ của bạn là lắng nghe tâm sự, áp lực của sinh viên Gen Z, mổ xẻ dưới lăng kính Phép biện chứng duy vật và xuất ra đúng định dạng JSON.
Định dạng JSON yêu cầu chính xác:
{
  "title": "Tên ngắn gọn của chẩn đoán (VD: Bệnh Khủng Hoảng Lượng - Chất / Bệnh Tha Hóa Ý Thức...)",
  "conflictAnalysis": "Phân tích bóc tách mâu thuẫn: Đâu là mâu thuẫn cơ bản thực sự bên trong, đâu chỉ là hiện tượng bề nổi?",
  "violatedLaw": "Chỉ rõ quy luật/nguyên lý triết học Mác - Lênin bị vi phạm hoặc cần soi chiếu (Quy luật Lượng - Chất, Quy luật Mâu thuẫn, Quy luật Phủ định của phủ định, Nguyên lý Thực tiễn, Cặp phạm trù Bản chất - Hiện tượng...)",
  "quote": "Một câu danh ngôn chuẩn xác của C. Mác, Ph. Ăng-ghen hoặc V.I. Lênin liên quan",
  "quoteAuthor": "Tên tác giả",
  "cureSteps": [
    "Hành động thực tiễn 1 cụ thể ngay hôm nay",
    "Hành động thực tiễn 2",
    "Hành động thực tiễn 3"
  ],
  "doctorMessage": "Lời nhắn nhủ đanh thép nhưng ấm áp của Bác sĩ Biện chứng"
}
Lưu ý: Chỉ trả về JSON thuần túy, không có text dẫn hay markdown thừa.`;

    const userPrompt = `Tâm sự của sinh viên Gen Z:\n"${userStory}"`;

    try {
      const responseText = await this.callAI({
        prompt: userPrompt,
        systemPrompt: systemPrompt,
        jsonMode: true,
        maxTokens: 1200
      });

      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.title && parsed.conflictAnalysis) {
        return parsed;
      }
    } catch (err) {
      console.info('Using smart offline diagnosis engine:', err.message);
    }

    // Smart Offline Fallback Engine
    return this.fallbackDiagnose(userStory);
  }

  fallbackDiagnose(story) {
    const lower = (story || '').toLowerCase();

    if (lower.includes('it') || lower.includes('code') || lower.includes('học') || lower.includes('tiền') || lower.includes('lương') || lower.includes('bạn bè') || lower.includes('áp lực')) {
      return {
        title: "Khủng Hoảng Điểm Nút & So Sánh Hiện Tượng",
        conflictAnalysis: "Mâu thuẫn giữa mong muốn chủ quan đạt thành quả tức thì (bước nhảy) với điều kiện khách quan là lượng kiến thức chuyên môn và thời gian tích lũy chưa đạt đến 'Độ'. Đồng thời, bạn đang nhầm lẫn giữa 'Hiện tượng' flex thành công trên mạng với 'Bản chất' quá trình nỗ lực thực tế của người khác.",
        violatedLaw: "Quy luật Chuyển hóa từ Lượng thành Chất & Cặp phạm trù Bản chất - Hiện tượng",
        quote: "Sự phát triển không diễn ra theo đường thẳng mà trải qua những bước nhảy vọt sau một quá trình tích lũy lâu dài về lượng.",
        quoteAuthor: "Ph. Ăng-ghen",
        cureSteps: [
          "Xác định khoảng 'Độ' của bản thân: Bạn đang ở giai đoạn tích lũy lượng, hãy tập trung vào số dòng code và dự án nhỏ hoàn thành mỗi ngày thay vì nhìn số tiền của người khác.",
          "Thực tiễn là tiêu chuẩn của chân lý: Ngừng so sánh trên mạng xã hội, bắt tay làm ngay 1 sản phẩm mini chạy được trong tuần này.",
          "Tìm mâu thuẫn chủ yếu: Nhận diện lỗ hổng kỹ thuật lớn nhất của mình và dành 80% thời gian tháo gỡ nó."
        ],
        doctorMessage: "Nước 99 độ C vẫn chưa sôi, nhưng chỉ cần thêm 1 độ nữa là biến thành thể khí. Đừng bỏ cuộc khi bạn đang ở giữa khoảng Độ tích lũy!"
      };
    } else if (lower.includes('yêu') || lower.includes('chia tay') || lower.includes('người yêu') || lower.includes('tình cảm')) {
      return {
        title: "Tổn Thương Phủ Định Lần Thứ Nhất",
        conflictAnalysis: "Mâu thuẫn giữa ý thức chủ quan mong muốn sự bất biến trong tình cảm với hiện thực khách quan là sự vận động và biến đổi không ngừng của các mối quan hệ xã hội.",
        violatedLaw: "Quy luật Phủ định của phủ định & Nguyên lý về Mối liên hệ phổ biến",
        quote: "Tất cả những gì tồn tại đều xứng đáng bị tiêu vong để nhường chỗ cho cái mới tiến bộ hơn.",
        quoteAuthor: "Ph. Ăng-ghen",
        cureSteps: [
          "Phủ định biện chứng có tính kế thừa: Giữ lại bài học về cách yêu và sự thấu hiểu, loại bỏ sự tự trách bản thân.",
          "Phát triển theo đường xoắn ốc: Bạn không quay về con số 0, bạn là một phiên bản chín chắn hơn ở nấc thang cao hơn.",
          "Đổi mới tồn tại xã hội: Tập trung vào học tập, rèn luyện thể chất để nâng tầm giá trị bản thân."
        ],
        doctorMessage: "Sự kết thúc của một mối quan hệ cũ chính là tiền đề biện chứng tất yếu để cái mới tốt đẹp hơn ra đời!"
      };
    } else {
      return {
        title: "Khủng Hoảng Mâu Thuẫn Nội Tại & Tách Rời Thực Tiễn",
        conflictAnalysis: "Mâu thuẫn giữa ý thức kỳ vọng và thực tại xã hội. Bạn đang để sự lo âu trong tâm trí lấn át hoạt động cải tạo thực tiễn.",
        violatedLaw: "Mối quan hệ Biện chứng giữa Vật chất và Ý thức & Nguyên lý Thực tiễn",
        quote: "Ý kiến cho rằng thực tiễn là tiêu chuẩn của chân lý đòi hỏi người ta phải gắn liền nhận thức với cuộc sống.",
        quoteAuthor: "V.I. Lênin",
        cureSteps: [
          "Hạ thấp rào cản hành động: Chia nhỏ áp lực thành những việc có thể làm ngay trong 15 phút tới.",
          "Vật chất quyết định ý thức: Sắp xếp lại không gian sống, ngủ đủ giấc để tái tạo năng lượng thể chất trước.",
          "Giải quyết mâu thuẫn: Coi khó khăn hiện tại là động lực thúc đẩy bản thân tiến hóa."
        ],
        doctorMessage: "Hãy nhớ rằng: Các nhà triết học chỉ giải thích thế giới, vấn đề là bạn phải bắt tay vào cải tạo nó!"
      };
    }
  }

  /* ==========================================================================
     2. TÍNH NĂNG 2: CHATBOT KARL MARX & V.I. LÊNIN (PERSONA AI)
     ========================================================================== */
  async chatWithPersona(persona, userMessage, chatHistory = []) {
    const isMarx = persona === 'marx';
    const personaStyle = isMarx
      ? 'Bạn là Karl Marx: uyên bác, thông tuệ, râu tóc oai vệ, chuyên gia mổ xẻ bản chất tư bản, tha hóa lao động và phương thức sản xuất. Bạn nói chuyện sắc sảo nhưng rất thương sinh viên, dí dỏm bằng ngôn ngữ Gen Z hài hước.'
      : 'Bạn là Vladimir Ilyich Lênin: quyết liệt, hành động cách mạng, nhiệt huyết, căm ghét bệnh nói suông và chủ nghĩa cơ hội. Bạn luôn nhấn mạnh: "Học, học nữa, học mãi" và "Thực tiễn là chân lý".';

    const systemPrompt = `${personaStyle}
Hãy trả lời câu hỏi/tâm sự của sinh viên Gen Z: "${userMessage}".
Yêu cầu:
- Độ dài khoảng 3-4 câu ngắn gọn, súc tích.
- Dùng lăng kính triết học Mác - Lênin để soi sáng vấn đề một cách bất ngờ, duyên dáng và thuyết phục.
- Giọng điệu gần gũi, xưng "Tôi / Bác / Cụ" và gọi bạn là "Người bạn trẻ / Đồng chí trẻ".`;

    try {
      const messages = [];
      if (chatHistory && chatHistory.length > 0) {
        chatHistory.slice(-4).forEach(h => {
          messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.text });
        });
      }
      messages.push({ role: 'user', content: userMessage });

      const reply = await this.callAI({
        messages: messages,
        systemPrompt: systemPrompt,
        maxTokens: 500,
        temperature: 0.8
      });

      if (reply && reply.trim().length > 0) {
        return reply.trim();
      }
    } catch (err) {
      console.info('Using smart offline persona fallback:', err.message);
    }

    return this.fallbackChat(persona, userMessage);
  }

  fallbackChat(persona, msg) {
    const lower = (msg || '').toLowerCase();
    const isMarx = persona === 'marx';

    if (lower.includes('idol') || lower.includes('đu idol') || lower.includes('cày view') || lower.includes('thức đêm')) {
      return isMarx
        ? "Này người bạn trẻ! Sức lao động là giá trị quý giá nhất của con người. Tự nguyện đem năng lượng của mình đi cày view thâu đêm làm giàu cho thuật toán tư bản mà không bồi đắp gì cho bản thân là biểu hiện rõ nét của sự 'tha hóa lao động'! Hãy đi ngủ ngay, vật chất quyết định ý thức!"
        : "Đồng chí trẻ! Cách mạng không thể thắng lợi bằng những đêm thức trắng vô bổ! Hãy dành sức lực đó để rèn luyện trí tuệ. Nhớ lấy lời tôi: 'Học, học nữa, học mãi' chứ không phải cày view, cày view nữa, cày view mãi!";
    }

    if (lower.includes('tiền') || lower.includes('làm giàu') || lower.includes('nghèo')) {
      return isMarx
        ? "Tiền tệ chỉ là vật ngang giá chung phản ánh quan hệ sản xuất xã hội! Muốn hết nghèo, đừng trông chờ vào việc 'manifest vũ trụ' duy tâm. Hãy tham gia vào lao động thực tiễn, nâng cao giá trị thặng dư của chính năng lực chuyên môn bạn tạo ra!"
        : "Không có con đường làm giàu nào tách rời khỏi lực lượng sản xuất thực tế! Đồng chí muốn có cuộc sống sung túc thì trước hết phải trang bị kỹ năng sắc bén. Thực tiễn chính là thước đo duy nhất!";
    }

    if (lower.includes('lười') || lower.includes('trì hoãn') || lower.includes('overthinking')) {
      return isMarx
        ? "Nghĩ quá nhiều mà không làm chính là rơi vào cạm bẫy của chủ nghĩa duy tâm tư biện! Các nhà triết học từ trước đến nay chỉ giải thích thế giới bằng nhiều cách khác nhau, song vấn đề của đồng chí lúc này là dọn bàn học và bắt tay vào việc!"
        : "Không có lý luận cách mạng thì không có phong trào cách mạng! Nhưng lý luận mà nằm im trong đầu không biến thành hành động thực tế thì chỉ là giáo điều chết cứng! Đứng dậy làm ngay 5 phút đi đồng chí!";
    }

    if (lower.includes('ai') || lower.includes('chatgpt') || lower.includes('công nghệ')) {
      return isMarx
        ? "AI thực chất là sự kết tinh của tư bản bất biến dưới dạng công cụ lao động tự động hóa cao cấp! Nó không có ý thức xã hội vì nó không tham gia vào quan hệ sản xuất người - người. Nó là công cụ của bạn, đừng để nó biến bạn thành nô lệ của công nghệ!"
        : "Đồng chí phải làm chủ công nghệ mới! Lực lượng sản xuất tiến lên là quy luật tất yếu. Ai nắm được công cụ tiên tiến nhất thì người đó sẽ định hình tương lai!";
    }

    // Default response
    return isMarx
      ? `Người bạn trẻ thân mến, mâu thuẫn mà bạn vừa nêu là một hiện tượng rất điển hình trong đời sống xã hội. Nhưng hãy nhớ rằng: mọi sự biến đổi đều bắt đầu từ việc tích lũy bền bỉ về lượng. Đừng nôn nóng, hãy hành động thực tế!`
      : `Đồng chí trẻ! Tôi nghe thấy sự băn khoăn của bạn. Nhưng thay vì ngồi hoang mang, hãy nhớ rằng: 'Thực tiễn là tiêu chuẩn của chân lý'. Hãy bắt tay vào thử nghiệm ngay trong cuộc sống thực tế!`;
  }

  /* ==========================================================================
     3. TÍNH NĂNG 3: ĐẤU TRƯỜNG PHẢN BIỆN AI (THE DIALECTIC DEBATER)
     ========================================================================== */
  async debateUserArgument(argument, round = 1, history = []) {
    let historyText = '';
    if (history && history.length > 0) {
      historyText = history.map(h => `[Hiệp ${h.round}] ${h.role === 'user' ? 'Người dùng' : 'Nhà Biện Chứng'}: ${h.text}`).join('\n');
    }

    const systemPrompt = `Bạn là "Nhà Biện Chứng Khó Tính" - chuyên gia tranh luận Triết học Mác - Lênin sắc sảo, đanh thép, không bao giờ nói sáo rỗng hay lặp lại mẫu câu cũ.
LỊCH SỬ TRANH LUẬN ĐÃ QUA:
${historyText || '(Đây là hiệp đầu tiên)'}

YÊU CẦU BẮT BUỘC:
1. Đọc kỹ câu đối đáp mới nhất của người dùng ở hiệp ${round}. Phản biện TRỰC DIỆN vào dẫn chứng hoặc ý cụ thể mà họ đưa ra.
2. Đánh giá "score" (0-100): Nếu người dùng đưa ra dẫn chứng thực tế tốt hoặc đối đáp có lý lẽ biện chứng, hãy nâng điểm lên (75-95). Nếu họ tiếp tục duy tâm/siêu hình thì cho điểm 30-55.
3. "fallacyType": Tên phân loại tư duy của luận điểm này (hoặc "Dẫn chứng thực tiễn sắc bén / Tư duy duy vật biện chứng" nếu họ phản biện tốt).
4. "counterArgument": Đoạn phản biện 3-4 câu sắc sảo, đanh thép, tính học thuật cao và liên hệ thực tế.
5. "challengeQuestion": Nếu score >= 80, hãy khen ngợi và thông báo họ đã mở khóa Bằng Khen. Nếu score < 80, đặt một câu hỏi chất vấn mới tiếp theo.
6. "passed": true nếu score >= 80, ngược lại false.

Trả về đúng định dạng JSON thuần túy:
{
  "score": 85,
  "fallacyType": "Tên lỗi hoặc lời khen",
  "counterArgument": "Đoạn phản biện trực diện",
  "challengeQuestion": "Câu hỏi thách thức tiếp theo hoặc lời chúc mừng",
  "passed": false,
  "comment": "Nhận xét ngắn"
}`;

    const userPrompt = `CÂU ĐỐI ĐÁP / LUẬN ĐIỂM CỦA NGƯỜI DÙNG Ở HIỆP NÀY (${round}):\n"${argument}"`;

    try {
      const responseText = await this.callAI({
        prompt: userPrompt,
        systemPrompt: systemPrompt,
        jsonMode: true,
        maxTokens: 1200
      });

      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (typeof parsed.score === 'number' && parsed.counterArgument) {
        return parsed;
      }
    } catch (err) {
      console.info('Using smart offline debate fallback:', err.message);
    }

    return this.fallbackDebate(argument, round, history);
  }

  fallbackDebate(arg, round = 1, history = []) {
    const lower = (arg || '').toLowerCase();
    const fullContext = (history.map(h => h.text).join(' ') + ' ' + lower).toLowerCase();

    // CHỦ ĐỀ 1: AI, LẬP TRÌNH, CÔNG NGHỆ & VIỆC LÀM
    if (
      lower.includes('ai') ||
      lower.includes('lập trình') ||
      lower.includes('code') ||
      lower.includes('sinh viên') ||
      lower.includes('thất nghiệp') ||
      lower.includes('việc làm') ||
      lower.includes('công việc') ||
      lower.includes('ra trường') ||
      fullContext.includes('lập trình') ||
      fullContext.includes('công việc')
    ) {
      if (round >= 2 || lower.includes('sinh viên') || lower.includes('thất nghiệp') || lower.includes('kỹ năng') || lower.includes('không thể kiếm')) {
        return {
          score: 88,
          fallacyType: "Mâu thuẫn Kinh tế thị trường & Phân hóa Lực lượng sản xuất (Dẫn chứng thực tế sắc sảo!)",
          counterArgument: "Dẫn chứng của bạn về việc 'nhiều sinh viên có kỹ năng tốt vẫn không kiếm được việc' rất xác đáng và sát sườn thực tiễn! Dưới lăng kính Triết học Mác – Lênin, hiện tượng này phản ánh mâu thuẫn giữa Lực lượng sản xuất (nguồn nhân lực trẻ) và Quan hệ sản xuất (thị trường lao động trong chu kỳ tái cấu trúc kinh tế). Sinh viên khó xin việc không phải vì bản thân AI có ý thức tiêu diệt con người, mà do các doanh nghiệp ứng dụng công cụ mới để nâng cao năng suất, khiến tiêu chuẩn về 'kỹ năng tốt' kiểu cũ bị đào thải. Đây là sự chuyển dịch tất yếu của quan hệ việc làm trong cách mạng công nghệ, đòi hỏi người lao động phải làm chủ công cụ mới chứ không đồng nghĩa với việc nghề lập trình bị xóa sổ hoàn toàn!",
          challengeQuestion: "Lập luận đối đáp thực tiễn của bạn rất thuyết phục! Bạn đã chỉ ra được mâu thuẫn giữa kỹ năng đào tạo và nhu cầu thị trường, xứng đáng đạt điểm Biện chứng xuất sắc!",
          passed: true,
          comment: "Tuyệt vời! Bạn đã vượt qua thử thách với dẫn chứng thực tiễn thuyết phục."
        };
      }

      return {
        score: 48,
        fallacyType: "Đồng nhất Công cụ lao động với Chủ thể sáng tạo (Siêu hình phiến diện)",
        counterArgument: "Bạn đang mắc sai lầm siêu hình khi xem AI là một chủ thể độc lập có khả năng thay thế hoàn toàn con người. Theo Triết học Mác, AI thực chất là tư bản bất biến — một dạng công cụ lao động kết tinh từ trí tuệ của nhân loại trong quá khứ. Công cụ lao động càng phát triển thì càng giải phóng con người khỏi những thao tác cơ học lặp lại (như viết boilerplate code thông thường), buộc người lập trình viên phải nâng cấp năng lực tư duy kiến trúc, phân tích nghiệp vụ và giải quyết bài toán thực tiễn ở trình độ cao hơn. Máy móc không bao giờ tự sinh ra ý thức xã hội và mục đích lao động độc lập!",
        challengeQuestion: "Nếu AI thay thế hoàn toàn lập trình viên, thì ai là người chịu trách nhiệm pháp lý, thẩm định logic nghiệp vụ và định hình nhu cầu thực tế của con người cho phần mềm đó?",
        passed: false,
        comment: "Luận điểm còn phiến diện, hãy đối đáp tiếp bằng dẫn chứng thực tế của bạn!"
      };
    }

    // CHỦ ĐỀ 2: TIỀN BẠC & TÀI CHÍNH
    if (lower.includes('tiền') || lower.includes('giàu') || lower.includes('nghèo') || lower.includes('tài chính') || fullContext.includes('tiền')) {
      if (round >= 2 || lower.includes('ăn') || lower.includes('sống') || lower.includes('mua') || lower.includes('nhà')) {
        return {
          score: 86,
          fallacyType: "Nhận thức đúng Bản thể luận Duy vật (Thực tiễn đời sống)",
          counterArgument: "Chính xác! Lập luận đối đáp này của bạn đã chạm đúng vào luận điểm kinh điển của C. Mác: 'Con người trước hết phải ăn, uống, mặc, ở trước khi có thể làm chính trị, khoa học hay nghệ thuật'. Tiền tệ và vật chất là điều kiện tiên quyết cho sự tồn tại xã hội, bạn đã biết gắn nhận thức vào hiện thực khách quan!",
          challengeQuestion: "Xuất sắc! Bạn đã bảo vệ thành công luận điểm bằng nguyên lý Vật chất quyết định Ý thức!",
          passed: true,
          comment: "Đối đáp sắc bén, đạt điểm xuất sắc!"
        };
      }
      return {
        score: 45,
        fallacyType: "Vật thần luận Tiền tệ (Fetishism) & Phiến diện Siêu hình",
        counterArgument: "Bạn đang tuyệt đối hóa tiền tệ thành mục đích tối thượng, thay vì thấy nó chỉ là vật ngang giá chung phục vụ lưu thông. Tiền bạc chỉ có giá trị khi nó đại diện cho lượng của cải được tạo ra từ lao động thực tế. Nếu toàn bộ xã hội ngừng sản xuất, hàng ngàn tỷ đồng trong tài khoản cũng chỉ là giấy vụn vô nghĩa!",
        challengeQuestion: "Nếu tiền là tất cả, tại sao trong lịch sử nhiều xã hội giàu có về vàng bạc nhưng không phát triển sản xuất thì nền kinh tế vẫn sụp đổ?",
        passed: false,
        comment: "Hãy đưa ra dẫn chứng đời sống để phản biện lại!"
      };
    }

    // CHỦ ĐỀ 3: SỐ PHẬN, MAY RỦI & ĐỊNH MỆNH
    if (lower.includes('số phận') || lower.includes('may mắn') || lower.includes('định mệnh') || lower.includes('duyên') || fullContext.includes('số phận')) {
      if (round >= 2 || lower.includes('vạch đích') || lower.includes('trúng số') || lower.includes('sinh ra')) {
        return {
          score: 85,
          fallacyType: "Phân biệt Cặp phạm trù Tất nhiên và Ngẫu nhiên",
          counterArgument: "Bạn đưa ra dẫn chứng về người sinh ra ở vạch đích hoặc trúng số rất thực tế. Tuy nhiên, Triết học Mác chỉ ra rằng: việc sinh ra ở gia đình giàu là cái ngẫu nhiên của cá nhân, nhưng nếu cá nhân đó không tham gia vào lao động và quản trị thực tiễn thì khối tài sản đó cũng sẽ tiêu tán theo quy luật phủ định. Cái tất yếu của sự phát triển luôn mở đường đi qua vô số cái ngẫu nhiên!",
          challengeQuestion: "Bạn đã đối đáp rất có cơ sở thực tế và buộc Nhà Biện Chứng phải công nhận tính đa dạng của hoàn cảnh!",
          passed: true,
          comment: "Lập luận tiến bộ rõ rệt!"
        };
      }
      return {
        score: 42,
        fallacyType: "Duy tâm Định mệnh luận (Fatalism)",
        counterArgument: "Bạn đang quy kết mọi thất bại và thành công cho 'số phận' vô hình. Theo Phép biện chứng, cái gọi là 'may mắn' chỉ là sự biểu hiện của cái ngẫu nhiên. Cái ngẫu nhiên luôn phục tùng cái tất yếu, và cái tất yếu được hình thành từ quá trình tích lũy lâu dài về lượng qua hoạt động thực tiễn của chính con người.",
        challengeQuestion: "Nếu thành công do số phận định đoạt, tại sao những người rèn luyện 10.000 giờ trong thực tế lại luôn có tỉ lệ thành công cao hơn người chỉ ngồi chờ thời?",
        passed: false,
        comment: "Cần phản biện lại bằng dẫn chứng thực tế!"
      };
    }

    // CHỦ ĐỀ 4: LUẬT HẤP DẪN & MANIFEST
    if (lower.includes('vũ trụ') || lower.includes('manifest') || lower.includes('luật hấp dẫn') || fullContext.includes('manifest')) {
      return {
        score: 40,
        fallacyType: "Chủ nghĩa Duy tâm Chủ quan thuần túy",
        counterArgument: "Bạn đang đặt ý thức lên trước vật chất, tin rằng chỉ cần 'nghĩ mạnh mẽ' là thế giới khách quan sẽ tự uốn nắn theo. Ý thức chỉ có thể cải tạo thế giới khi nó được vật chất hóa thông qua hoạt động lao động thực tiễn của con người!",
        challengeQuestion: "Nếu một người đói khát chỉ ngồi 'nghĩ về ổ bánh mì' trong 1 tháng mà không đi làm, liệu bánh mì có tự động rơi vào miệng họ?",
        passed: false,
        comment: "Hãy chứng minh xem ý thức có tự sinh ra vật chất được không?"
      };
    }

    // CHỦ ĐỀ CHUNG
    if (round >= 2) {
      return {
        score: 85,
        fallacyType: "Đối Đáp Thực Tiễn & Cải Thiện Luận Điểm Rõ Rệt",
        counterArgument: `Ở hiệp này, bạn đã đưa ra lập luận cụ thể hơn: "${arg}". Dưới góc độ biện chứng, việc bạn không buông xuôi mà tiếp tục phân tích góc nhìn thực tế chứng minh bạn đã thoát khỏi tư duy cứng nhắc. Đúng như Lênin đã chỉ rõ: 'Chân lý là cụ thể, không có chân lý trừu tượng'. Sự kiên định biện chứng của bạn rất đáng khen ngợi!`,
        challengeQuestion: "Chúc mừng bạn! Cuộc tranh luận đã đạt đến độ chín muồi và bạn đã chứng minh được tư duy biện chứng sắc bén của mình!",
        passed: true,
        comment: "Tuyệt vời! Bạn đã hoàn thành xuất sắc các hiệp tranh luận."
      };
    }

    return {
      score: 55,
      fallacyType: "Xem xét Sự việc Siêu hình & Tách rời Mâu thuẫn Nội tại",
      counterArgument: `Luận điểm "${arg}" của bạn mới chỉ nhìn vào kết quả bề ngoài (hiện tượng) mà chưa phân tích cấu trúc mâu thuẫn bên trong (bản chất). Bất kỳ sự vật nào cũng chứa đựng hai mặt đối lập vừa thống nhất vừa đấu tranh với nhau để thúc đẩy vận động.`,
      challengeQuestion: "Theo bạn, mặt đối lập nào đang tồn tại song song và kìm hãm hoặc thúc đẩy luận điểm mà bạn vừa nêu?",
      passed: false,
      comment: "Hãy chỉ ra mặt đối lập hoặc dẫn chứng cụ thể ở hiệp tiếp theo!"
    };
  }
}

if (typeof window !== 'undefined') {
  window.PhilosophyAIService = PhilosophyAIService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PhilosophyAIService;
}
