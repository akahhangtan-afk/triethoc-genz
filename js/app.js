/**
 * MAIN CONTROLLER: HỆ SINH THÁI TRIẾT HỌC AI CHO GEN Z
 * Điều phối Bác Sĩ Triết Học AI, Chatbot C. Mác & Lênin, Đấu Trường Phản Biện và Bằng Khen
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Synthesizer (Zero-dependency Web Audio)
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    }
    playClick() {
      if (!this.enabled) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }
    playFlip() {
      if (!this.enabled) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    }
    playSuccess() {
      if (!this.enabled) return;
      this.init();
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.08, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.25);
      });
    }
  }

  const sfx = new SoundFX();
  const aiService = new PhilosophyAIService();

  // 2. Sound Toggle Button
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      soundToggleBtn.textContent = sfx.enabled ? '🔊 Bật âm' : '🔇 Tắt âm';
      soundToggleBtn.classList.toggle('opacity-50', !sfx.enabled);
    });
  }



  // 4. Dynamic Quote Rotator (Hero Section)
  const heroQuoteText = document.getElementById('heroQuoteText');
  const heroQuoteAuthor = document.getElementById('heroQuoteAuthor');
  let currentQuoteIdx = 0;

  function displayHeroQuote(idx) {
    if (!heroQuoteText || !heroQuoteAuthor || !PHILO_DATA.famousQuotes.length) return;
    const q = PHILO_DATA.famousQuotes[idx];
    heroQuoteText.textContent = `“${q.quote}”`;
    heroQuoteAuthor.textContent = `— ${q.author} (${q.work})`;
  }
  displayHeroQuote(0);

  setInterval(() => {
    currentQuoteIdx = (currentQuoteIdx + 1) % PHILO_DATA.famousQuotes.length;
    displayHeroQuote(currentQuoteIdx);
  }, 9000);

  // ==========================================================================
  // MODULE 1: BÁC SĨ TRIẾT HỌC AI (KÊ ĐƠN TỰ DO)
  // ==========================================================================
  const aiTroubleInput = document.getElementById('aiTroubleInput');
  const aiDiagnoseBtn = document.getElementById('aiDiagnoseBtn');
  const aiRxResultBox = document.getElementById('aiRxResultBox');

  // Suggestion chips handler
  document.querySelectorAll('.ai-suggestion-chip[data-prompt]').forEach(chip => {
    chip.addEventListener('click', () => {
      sfx.playClick();
      if (aiTroubleInput) {
        aiTroubleInput.value = chip.getAttribute('data-prompt');
        aiTroubleInput.focus();
      }
    });
  });

  if (aiDiagnoseBtn && aiTroubleInput && aiRxResultBox) {
    aiDiagnoseBtn.addEventListener('click', async () => {
      const userText = aiTroubleInput.value.trim();
      if (!userText) {
        alert('Vui lòng nhập tâm sự hoặc bế tắc của bạn để Bác sĩ Biện chứng chẩn đoán!');
        aiTroubleInput.focus();
        return;
      }

      sfx.playClick();
      aiDiagnoseBtn.disabled = true;
      aiDiagnoseBtn.innerHTML = `⏳ Bác sĩ đang hội chẩn...`;

      aiRxResultBox.classList.remove('hidden');
      aiRxResultBox.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div class="typing-indicator" style="justify-content: center; margin-bottom: 1rem;">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
          <p style="color: var(--gold-light); font-weight: 600;">Đang bóc tách mâu thuẫn & soi chiếu các quy luật triết học...</p>
        </div>
      `;

      try {
        const result = await aiService.diagnoseTrouble(userText);
        sfx.playSuccess();

        aiRxResultBox.innerHTML = `
          <div class="ai-rx-result-card">
            <div class="ai-rx-header">
              <div>
                <span class="badge badge-crimson" style="margin-bottom: 0.35rem;">Toa Thuốc Độc Bản AI</span>
                <h3>${result.title}</h3>
              </div>
              <div class="rx-header-icon icon-anim icon-heartbeat">🩺</div>
            </div>

            <div class="rx-meta-grid">
              <div class="rx-box">
                <h4><span class="icon-anim icon-tilt">🔍</span> Bóc Tách Mâu Thuẫn Cốt Lõi</h4>
                <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.6;">${result.conflictAnalysis}</p>
              </div>
              <div class="rx-box" style="border-left-color: var(--gold-primary);">
                <h4><span class="icon-anim icon-wobble">⚖️</span> Quy Luật Triết Học Soi Chiếu</h4>
                <p style="font-size: 0.95rem; color: #fde047; font-weight: 600; line-height: 1.6;">${result.violatedLaw}</p>
                <div style="margin-top: 0.75rem; padding: 0.6rem 0.85rem; background: rgba(0,0,0,0.3); border-radius: 6px; font-style: italic; font-size: 0.85rem; color: #e2e8f0;">
                  “${result.quote}” — <span style="color: var(--gold-light);">${result.quoteAuthor}</span>
                </div>
              </div>
            </div>

            <div class="rx-steps-box">
              <h4 style="font-size: 0.9rem; text-transform: uppercase; color: var(--gold-light); letter-spacing: 0.05em; margin-bottom: 0.75rem;">
                <span class="icon-anim icon-pulse">💊</span> Phác Đồ 3 Bước Hành Động Thực Tiễn:
              </h4>
              <ul class="rx-steps-list">
                ${result.cureSteps.map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>

            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 1rem 1.25rem; border-radius: var(--radius-md); text-align: center;">
              <span style="color: #6ee7b7; font-weight: 700; font-size: 0.95rem;">Lời Dặn Bác Sĩ: </span>
              <span style="color: #f1f5f9; font-size: 0.92rem;">${result.doctorMessage}</span>
            </div>
          </div>
        `;
      } catch (err) {
        console.error(err);
        aiRxResultBox.innerHTML = `<p style="color: #ef4444; padding: 1rem;">Không thể chẩn đoán lúc này, vui lòng thử lại sau.</p>`;
      } finally {
        aiDiagnoseBtn.disabled = false;
        aiDiagnoseBtn.innerHTML = `<span class="icon-anim icon-tilt">🔬</span> Kê Đơn Triết Học`;
      }
    });
  }

  // Presets reference symptoms grid render
  const symptomGrid = document.getElementById('symptomGrid');
  const rxModal = document.getElementById('rxModal');
  const rxTitle = document.getElementById('rxTitle');
  const rxTag = document.getElementById('rxTag');
  const rxSymptom = document.getElementById('rxSymptom');
  const rxDiagnosis = document.getElementById('rxDiagnosis');
  const rxLaw = document.getElementById('rxLaw');
  const rxQuote = document.getElementById('rxQuote');
  const rxQuoteAuthor = document.getElementById('rxQuoteAuthor');
  const rxCureList = document.getElementById('rxCureList');
  const rxActionBadge = document.getElementById('rxActionBadge');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (symptomGrid && PHILO_DATA.prescriptions) {
    symptomGrid.innerHTML = PHILO_DATA.prescriptions.map((p, idx) => `
      <div class="glass-panel symptom-card" data-id="${p.id}" style="--item-index: ${idx};">
        <div class="symptom-card-top">
          <span class="card-icon">${p.icon}</span>
          <span class="badge badge-crimson">${p.tag}</span>
        </div>
        <h3 class="symptom-card-title">${p.name}</h3>
        <p class="symptom-card-desc">${p.symptom}</p>
        <div class="card-footer">
          <span class="symptom-law-badge" title="${p.law}">${p.law.split('(')[0].trim()}</span>
          <button class="btn-view-cure">Xem toa <span class="arrow-icon">➔</span></button>
        </div>
      </div>
    `).join('');

    symptomGrid.querySelectorAll('.symptom-card').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.getAttribute('data-id');
        const p = PHILO_DATA.prescriptions.find(x => x.id === pId);
        if (!p) return;

        sfx.playClick();
        rxTitle.textContent = `Toa Thuốc Mẫu: ${p.name}`;
        rxTag.textContent = p.tag;
        rxSymptom.textContent = p.symptom;
        rxDiagnosis.textContent = p.diagnosis;
        rxLaw.textContent = p.law;
        rxQuote.textContent = `“${p.quote}”`;
        rxQuoteAuthor.textContent = `— ${p.quoteAuthor}`;
        rxCureList.innerHTML = p.cure.map(c => `<li>${c}</li>`).join('');
        rxActionBadge.textContent = p.actionBadge;

        rxModal.classList.add('active');
      });
    });
  }

  if (closeModalBtn && rxModal) {
    closeModalBtn.addEventListener('click', () => {
      sfx.playClick();
      rxModal.classList.remove('active');
    });
    rxModal.addEventListener('click', (e) => {
      if (e.target === rxModal) rxModal.classList.remove('active');
    });
  }

  // ==========================================================================
  // MODULE 2: CHATBOT KARL MARX & V.I. LÊNIN (PERSONA AI)
  // ==========================================================================
  let currentPersona = 'marx';
  const chatMessagesBox = document.getElementById('chatMessagesBox');
  const chatInputText = document.getElementById('chatInputText');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const personaTabBtns = document.querySelectorAll('.persona-tab-btn');

  // Switch persona
  personaTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      personaTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPersona = btn.getAttribute('data-persona');

      // Append switch notification
      const isMarx = currentPersona === 'marx';
      appendChatBubble('persona', isMarx
        ? "Chào đồng chí! Tôi là Karl Marx. Bất cứ vấn đề gì về bản chất giá trị, lao động hay phương thức sản xuất, hãy cứ nói tôi nghe!"
        : "Đồng chí trẻ! Tôi là V.I. Lênin đây. Hãy ghi nhớ: 'Thực tiễn là tiêu chuẩn của chân lý'! Đồng chí có khúc mắc gì trong hành động thực tế?"
      );
    });
  });

  function appendChatBubble(type, text) {
    if (!chatMessagesBox) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;

    if (type === 'persona') {
      const isMarx = currentPersona === 'marx';
      bubble.innerHTML = `
        <div class="author-tag">${isMarx ? '🧔‍♂️ Karl Marx' : '🪒 V.I. Lênin'} • Triết gia</div>
        <div>${text}</div>
      `;
    } else {
      bubble.textContent = text;
    }

    chatMessagesBox.appendChild(bubble);
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
  }

  async function handleSendChatMessage(message) {
    const text = message || (chatInputText ? chatInputText.value.trim() : '');
    if (!text) return;

    if (chatInputText) chatInputText.value = '';
    sfx.playClick();
    appendChatBubble('user', text);

    // Typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble persona';
    typingBubble.id = 'chatTypingIndicator';
    typingBubble.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatMessagesBox.appendChild(typingBubble);
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;

    try {
      const response = await aiService.chatWithPersona(currentPersona, text);
      const typingEl = document.getElementById('chatTypingIndicator');
      if (typingEl) typingEl.remove();

      sfx.playSuccess();
      appendChatBubble('persona', response);
    } catch (err) {
      console.error(err);
      const typingEl = document.getElementById('chatTypingIndicator');
      if (typingEl) typingEl.remove();
      appendChatBubble('persona', 'Triết gia đang bận suy ngẫm, bạn thử hỏi câu khác nhé!');
    }
  }

  if (sendChatBtn) {
    sendChatBtn.addEventListener('click', () => handleSendChatMessage());
  }

  if (chatInputText) {
    chatInputText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendChatMessage();
    });
  }

  // Quick prompt buttons in chat
  document.querySelectorAll('.chat-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.getAttribute('data-msg');
      if (msg) handleSendChatMessage(msg);
    });
  });

  // ==========================================================================
  // MODULE 3: ĐẤU TRƯỜNG PHẢN BIỆN AI (THE DIALECTIC DEBATER)
  // ==========================================================================
  const debateInput = document.getElementById('debateInput');
  const submitDebateBtn = document.getElementById('submitDebateBtn');
  const debateScoreVal = document.getElementById('debateScoreVal');
  const debateMeterFill = document.getElementById('debateMeterFill');
  const debateResultBox = document.getElementById('debateResultBox');
  const debateUnlockBanner = document.getElementById('debateUnlockBanner');

  // Topic buttons
  document.querySelectorAll('.debate-topic-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      if (debateInput) {
        debateInput.value = btn.getAttribute('data-topic');
        debateInput.focus();
      }
    });
  });

  let debateRound = 1;
  let debateHistory = [];

  async function handleDebateSubmission(argumentText, isFollowUp = false) {
    if (!argumentText) return;

    sfx.playClick();
    debateResultBox.classList.remove('hidden');

    // Add a loading indicator at the bottom
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'debateLoadingDiv';
    loadingDiv.innerHTML = `
      <div style="text-align: center; padding: 1.5rem;">
        <div class="typing-indicator" style="justify-content: center; margin-bottom: 0.75rem;">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
        <p style="color: var(--gold-light); font-weight: 600;">${isFollowUp ? 'Nhà Biện Chứng đang xem xét câu đối đáp của bạn...' : 'Đang kiểm tra tính duy vật biện chứng & tìm kiếm lỗ hổng logic...'}</p>
      </div>
    `;

    if (!isFollowUp) {
      debateResultBox.innerHTML = '';
      submitDebateBtn.disabled = true;
      submitDebateBtn.innerHTML = `⏳ Đang mổ xẻ...`;
      debateRound = 1;
      debateHistory = [];
    } else {
      const oldFollowUp = document.getElementById('debateFollowUpBox');
      if (oldFollowUp) oldFollowUp.remove();
    }
    debateResultBox.appendChild(loadingDiv);

    try {
      debateHistory.push({ role: 'user', text: argumentText, round: debateRound });
      const result = await aiService.debateUserArgument(argumentText, debateRound, debateHistory);
      debateHistory.push({ role: 'ai', text: result.counterArgument, round: debateRound });

      const loadingEl = document.getElementById('debateLoadingDiv');
      if (loadingEl) loadingEl.remove();

      // Update meter
      const score = result.score || 50;
      if (debateScoreVal) debateScoreVal.textContent = `${score} / 100`;
      if (debateMeterFill) {
        debateMeterFill.style.width = `${score}%`;
        if (score >= 80) {
          debateMeterFill.classList.add('high-score');
        } else {
          debateMeterFill.classList.remove('high-score');
        }
      }

      // Create turn element
      const turnDiv = document.createElement('div');
      turnDiv.className = 'debate-history-box';
      turnDiv.style.marginBottom = '1.5rem';
      turnDiv.innerHTML = `
        <div class="debate-turn user-side">
          <span class="badge badge-crimson" style="margin-bottom: 0.5rem;">
            ${isFollowUp ? `Câu Đối Đáp Của Bạn (Hiệp ${debateRound})` : 'Luận Điểm Của Bạn (Hiệp 1)'}
          </span>
          <p style="color: #fff; font-size: 1.05rem;">“${argumentText}”</p>
        </div>

        <div class="debate-turn ai-side">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <span class="badge badge-gold">Nhà Biện Chứng Phản Biện</span>
            <span class="badge ${score >= 80 ? 'badge-green' : 'badge-crimson'}">${result.fallacyType}</span>
          </div>
          <p style="color: #e2e8f0; font-size: 1rem; line-height: 1.7; margin-bottom: 1rem;">
            ${result.counterArgument}
          </p>
          <div style="background: rgba(0,0,0,0.3); border-left: 3px solid var(--gold-primary); padding: 0.85rem 1.1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
            <span style="color: var(--gold-light); font-weight: 700; font-size: 0.88rem;">❓ Thách Thức Đối Đáp Tiếp: </span>
            <span style="color: #fde047; font-size: 0.95rem;">${result.challengeQuestion}</span>
          </div>
        </div>
      `;
      debateResultBox.appendChild(turnDiv);

      if (score >= 80 || result.passed) {
        sfx.playSuccess();
        if (debateUnlockBanner) {
          debateUnlockBanner.classList.remove('hidden');
          debateUnlockBanner.scrollIntoView({ behavior: 'smooth' });
        }

        // Pre-fill Certificate
        const certNameInput = document.getElementById('certRecipientName');
        const currentName = certNameInput && certNameInput.value ? certNameInput.value : "Sinh Viên Biện Chứng";
        certificate.generate(currentName, "Bậc Thầy Tư Duy Biện Chứng Mác - Lênin", `${score}/100 Điểm Sắc Bén`);
      } else {
        sfx.playClick();
        if (debateUnlockBanner) debateUnlockBanner.classList.add('hidden');
        debateRound++;

        // Render dedicated follow-up input box right below
        const followUpBox = document.createElement('div');
        followUpBox.id = 'debateFollowUpBox';
        followUpBox.className = 'debate-followup-box';
        followUpBox.style.cssText = 'margin-top: 1.5rem; background: rgba(0,0,0,0.4); border: 1.5px solid var(--border-gold); padding: 1.35rem; border-radius: var(--radius-md); animation: modalEnter 0.3s ease;';
        followUpBox.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <label style="font-size: 0.95rem; color: var(--gold-light); font-weight: 700;">
              ✍️ Nhập câu trả lời đối đáp trước thách thức trên (Hiệp ${debateRound}):
            </label>
            <span class="badge badge-gold">Đang tranh luận</span>
          </div>
          <div class="ai-input-wrapper" style="margin-bottom: 0.75rem;">
            <textarea id="debateFollowUpInput" class="ai-textarea" style="min-height: 85px;" placeholder="Gõ câu trả lời phản biện của bạn... (Gợi ý: Dẫn chứng thực tế, số liệu lịch sử hoặc quy luật khách quan để nâng điểm trên 80%)"></textarea>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">💡 Trả lời sâu sắc và có dẫn chứng thực tế sẽ mở khóa Bằng Khen!</span>
            <button id="submitFollowUpBtn" class="btn btn-gold" style="padding: 0.65rem 1.4rem;">
              ⚔️ Gửi Câu Đối Đáp Này ➔
            </button>
          </div>
        `;
        debateResultBox.appendChild(followUpBox);

        const followUpInput = document.getElementById('debateFollowUpInput');
        const submitFollowUpBtn = document.getElementById('submitFollowUpBtn');
        if (followUpInput) {
          followUpInput.focus();
          followUpInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        if (submitFollowUpBtn && followUpInput) {
          submitFollowUpBtn.addEventListener('click', () => {
            const val = followUpInput.value.trim();
            if (!val) {
              alert('Vui lòng nhập câu trả lời đối đáp của bạn!');
              followUpInput.focus();
              return;
            }
            handleDebateSubmission(val, true);
          });
        }
      }
    } catch (err) {
      console.error(err);
      const loadingEl = document.getElementById('debateLoadingDiv');
      if (loadingEl) loadingEl.remove();
      alert('Đã xảy ra lỗi khi phản biện, vui lòng thử lại.');
    } finally {
      submitDebateBtn.disabled = false;
      submitDebateBtn.innerHTML = `<span class="icon-anim icon-clash">⚔️</span> Thách Đấu Phản Biện`;
    }
  }

  if (submitDebateBtn && debateInput) {
    submitDebateBtn.addEventListener('click', () => {
      const val = debateInput.value.trim();
      if (!val) {
        alert('Vui lòng nhập luận điểm của bạn để phản biện!');
        debateInput.focus();
        return;
      }
      handleDebateSubmission(val, false);
    });
  }

  // ==========================================================================
  // MODULE 4: THẺ BÀI KHAI SÁNG (TAROT CARDS)
  // ==========================================================================
  const tarotCard = document.getElementById('tarotCard');
  const drawTarotBtn = document.getElementById('drawTarotBtn');
  const tarotSymbolFront = document.getElementById('tarotSymbolFront');
  const tarotTitleFront = document.getElementById('tarotTitleFront');
  const tarotSubtitleFront = document.getElementById('tarotSubtitleFront');
  const tarotKeywords = document.getElementById('tarotKeywords');
  const tarotMessage = document.getElementById('tarotMessage');
  const tarotAdvice = document.getElementById('tarotAdvice');

  let currentTarotIdx = 0;

  function loadTarotCard(idx) {
    const cardData = PHILO_DATA.tarotCards[idx];
    if (!cardData) return;

    if (tarotSymbolFront) tarotSymbolFront.textContent = cardData.symbol;
    if (tarotTitleFront) tarotTitleFront.textContent = cardData.title;
    if (tarotSubtitleFront) tarotSubtitleFront.textContent = cardData.subtitle;
    if (tarotKeywords) {
      tarotKeywords.innerHTML = cardData.keywords.map(kw => `<span class="badge badge-gold">#${kw}</span>`).join('');
    }
    if (tarotMessage) tarotMessage.textContent = cardData.message;
    if (tarotAdvice) tarotAdvice.textContent = `Lời dặn: ${cardData.advice}`;
  }

  loadTarotCard(0);

  if (tarotCard) {
    tarotCard.addEventListener('click', () => {
      sfx.playFlip();
      tarotCard.classList.toggle('flipped');
    });
  }

  if (drawTarotBtn) {
    drawTarotBtn.addEventListener('click', () => {
      sfx.playFlip();
      if (tarotCard.classList.contains('flipped')) {
        tarotCard.classList.remove('flipped');
        setTimeout(() => {
          currentTarotIdx = Math.floor(Math.random() * PHILO_DATA.tarotCards.length);
          loadTarotCard(currentTarotIdx);
          setTimeout(() => tarotCard.classList.add('flipped'), 200);
        }, 400);
      } else {
        currentTarotIdx = Math.floor(Math.random() * PHILO_DATA.tarotCards.length);
        loadTarotCard(currentTarotIdx);
        setTimeout(() => tarotCard.classList.add('flipped'), 200);
      }
    });
  }

  // ==========================================================================
  // MODULE 5: CẤP CHỨNG NHẬN (CERTIFICATE)
  // ==========================================================================
  const certificate = new DialecticCertificate('certificateCanvas');
  const certInput = document.getElementById('certRecipientName');
  const generateCertBtn = document.getElementById('generateCertBtn');
  const downloadCertBtn = document.getElementById('downloadCertBtn');

  // Initial render
  certificate.generate("Sinh Viên Biện Chứng", "Học Giả Biện Chứng Triển Vọng", "Đang Thử Thách");

  if (generateCertBtn && certInput) {
    generateCertBtn.addEventListener('click', () => {
      sfx.playSuccess();
      const name = certInput.value.trim() || "Sinh Viên Biện Chứng";
      const currentScore = debateScoreVal ? debateScoreVal.textContent.split('/')[0].trim() : '85';
      const title = parseInt(currentScore) >= 80
        ? "Bậc Thầy Tư Duy Biện Chứng Mác - Lênin"
        : "Chiến Binh Thực Tiễn Tích Cực";
      certificate.generate(name, title, `${currentScore}/100 Điểm Sắc Bén`);
    });
  }

  if (downloadCertBtn) {
    downloadCertBtn.addEventListener('click', () => {
      sfx.playClick();
      const name = certInput && certInput.value.trim() ? certInput.value.trim().replace(/\s+/g, '_') : 'Sinh_Vien';
      certificate.download(`Chung_Nhan_Triet_Hoc_Mac_Lenin_${name}.png`);
    });
  }

  // ==========================================================================
  // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }
});

