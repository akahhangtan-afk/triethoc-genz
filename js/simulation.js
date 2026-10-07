/**
 * SIMULATION ENGINE: PHÒNG THÍ NGHIỆM BIỆN CHỨNG
 * Mô phỏng trực quan 3 quy luật cơ bản của phép biện chứng duy vật
 */

class PhilosophySimulations {
  constructor() {
    this.leapCanvas = document.getElementById('leapCanvas');
    this.spiralCanvas = document.getElementById('spiralCanvas');
    this.oppoCanvas = document.getElementById('oppoCanvas');
    
    this.leapCtx = this.leapCanvas ? this.leapCanvas.getContext('2d') : null;
    this.spiralCtx = this.spiralCanvas ? this.spiralCanvas.getContext('2d') : null;
    this.oppoCtx = this.oppoCanvas ? this.oppoCanvas.getContext('2d') : null;

    this.particles = [];
    this.spiralAngle = 0;
    this.oppoRotation = 0;
    this.animId = null;

    this.initLeapSim();
    this.initSpiralSim();
    this.initOppoSim();
    this.startGlobalLoop();
  }

  /* ---------------------------------------------
   * 1. MÔ PHỎNG QUY LUẬT LƯỢNG - CHẤT
   * --------------------------------------------- */
  initLeapSim() {
    const slider = document.getElementById('quantitySlider');
    const resetBtn = document.getElementById('resetLeapBtn');
    if (!slider) return;

    slider.addEventListener('input', (e) => {
      this.updateLeapState(parseInt(e.target.value));
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        slider.value = 10;
        this.updateLeapState(10);
      });
    }

    this.updateLeapState(parseInt(slider.value));
  }

  updateLeapState(val) {
    const valDisplay = document.getElementById('quantityVal');
    const phaseLabel = document.getElementById('phaseLabel');
    const qualityStatus = document.getElementById('qualityStatus');
    const leapAlert = document.getElementById('leapAlert');

    if (valDisplay) valDisplay.textContent = val;

    let phase = '';
    let quality = '';
    let isLeap = false;

    if (val < 70) {
      phase = 'Khoảng Độ (Measure): Lượng biến đổi nhưng chất cũ chưa đổi.';
      quality = 'Chất cũ: "Người mới bắt đầu còn nhiều bỡ ngỡ"';
      if (leapAlert) leapAlert.classList.add('hidden');
    } else if (val < 90) {
      phase = 'Tiếp cận Điểm Nút (Nodal Point): Năng lượng tích lũy đến cực hạn!';
      quality = 'Chất cũ: "Nội lực dồn nén, ranh giới chuẩn bị bị phá vỡ"';
      if (leapAlert) leapAlert.classList.add('hidden');
    } else {
      phase = 'BƯỚC NHẢY VỌT (The Leap): Đột phá sang một trạng thái hoàn toàn mới!';
      quality = 'Chất mới: "Bậc thầy lão luyện – Đột phá tư duy & năng lực!"';
      isLeap = true;
      if (leapAlert) {
        leapAlert.classList.remove('hidden');
      }
    }

    if (phaseLabel) phaseLabel.textContent = phase;
    if (qualityStatus) qualityStatus.innerHTML = quality;

    // Trigger visual particles on leap
    if (isLeap && Math.random() < 0.3) {
      this.createLeapSparks();
    }
  }

  createLeapSparks() {
    if (!this.leapCanvas) return;
    const w = this.leapCanvas.width;
    const h = this.leapCanvas.height;
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: w / 2 + (Math.random() - 0.5) * 60,
        y: h / 2 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1.0,
        color: `hsl(${35 + Math.random() * 30}, 100%, 60%)`,
        size: 3 + Math.random() * 4
      });
    }
  }

  drawLeapCanvas() {
    if (!this.leapCtx) return;
    const ctx = this.leapCtx;
    const w = this.leapCanvas.width;
    const h = this.leapCanvas.height;
    const slider = document.getElementById('quantitySlider');
    const val = slider ? parseInt(slider.value) : 10;

    ctx.clearRect(0, 0, w, h);

    // Background gradient
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    bgGrad.addColorStop(0, val >= 90 ? 'rgba(180, 40, 50, 0.35)' : 'rgba(25, 30, 45, 0.8)');
    bgGrad.addColorStop(1, 'rgba(10, 12, 18, 0.95)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Glowing core
    const radius = 30 + (val / 100) * 45;
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);

    let coreGrad;
    if (val < 70) {
      coreGrad = ctx.createRadialGradient(w / 2, h / 2, 5, w / 2, h / 2, radius);
      coreGrad.addColorStop(0, '#f59e0b');
      coreGrad.addColorStop(1, 'rgba(217, 119, 6, 0.15)');
    } else if (val < 90) {
      coreGrad = ctx.createRadialGradient(w / 2, h / 2, 5, w / 2, h / 2, radius);
      coreGrad.addColorStop(0, '#ef4444');
      coreGrad.addColorStop(1, 'rgba(220, 38, 38, 0.3)');
    } else {
      coreGrad = ctx.createRadialGradient(w / 2, h / 2, 5, w / 2, h / 2, radius);
      coreGrad.addColorStop(0, '#ffd700');
      coreGrad.addColorStop(0.5, '#dc2626');
      coreGrad.addColorStop(1, 'rgba(234, 88, 12, 0.5)');
    }
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = val >= 90 ? '#ffd700' : '#f59e0b';
    ctx.shadowBlur = val >= 90 ? 30 : 15;
    ctx.fill();
    ctx.restore();

    // Orbital ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, radius + 15, 0, Math.PI * 2);
    ctx.strokeStyle = val >= 90 ? '#facc15' : 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = val >= 90 ? 3 : 1.5;
    ctx.setLineDash(val >= 90 ? [6, 4] : [4, 6]);
    ctx.stroke();
    ctx.restore();

    // Draw sparks/particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* ---------------------------------------------
   * 2. MÔ PHỎNG ĐƯỜNG XOẮN ỐC (PHỦ ĐỊNH CỦA PHỦ ĐỊNH)
   * --------------------------------------------- */
  initSpiralSim() {
    this.spiralStep = 1;
    const nextBtn = document.getElementById('nextSpiralStepBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.spiralStep = (this.spiralStep % 3) + 1;
        this.updateSpiralText();
      });
    }
    this.updateSpiralText();
  }

  updateSpiralText() {
    const titleEl = document.getElementById('spiralStepTitle');
    const descEl = document.getElementById('spiralStepDesc');
    if (!titleEl || !descEl) return;

    if (this.spiralStep === 1) {
      titleEl.innerHTML = `<span class="badge badge-gold">Giai đoạn 1</span> Cái khẳng định ban đầu`;
      descEl.textContent = 'Hạt thóc gieo vào đất / Ý tưởng kinh doanh ban đầu / Bạn là sinh viên năm nhất đầy ước mơ nhưng còn non nớt.';
    } else if (this.spiralStep === 2) {
      titleEl.innerHTML = `<span class="badge badge-crimson">Giai đoạn 2</span> Phủ định lần thứ nhất (Cái phủ định)`;
      descEl.textContent = 'Cây lúa mọc lên làm hạt thóc biến mất / Dự án gặp khủng hoảng / Bạn đối diện thực tế khốc liệt và vấp ngã. Cái cũ bị phủ định nhưng chuẩn bị tiền đề cho cái mới.';
    } else {
      titleEl.innerHTML = `<span class="badge badge-green">Giai đoạn 3</span> Phủ định của phủ định (Bước tiến hóa cao hơn)`;
      descEl.textContent = 'Bông thóc mới ra đời mang hàng trăm hạt thóc chất lượng hơn / Dự án hoàn thiện sau khi đúc kết thất bại / Bạn tốt nghiệp với tư duy sắc bén. Vừa kế thừa hạt nhân tốt cũ, vừa đạt tầm cao mới theo đường xoắn ốc!';
    }
  }

  drawSpiralCanvas() {
    if (!this.spiralCtx) return;
    const ctx = this.spiralCtx;
    const w = this.spiralCanvas.width;
    const h = this.spiralCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw glowing spiral line
    this.spiralAngle += 0.015;
    ctx.save();
    ctx.translate(w / 2, h / 2 + 30);

    ctx.beginPath();
    const turns = 3.5;
    const maxA = Math.PI * 2 * turns;
    const maxRadius = Math.min(w, h) * 0.42;

    for (let a = 0; a <= maxA; a += 0.05) {
      const r = (a / maxA) * maxRadius;
      const x = r * Math.cos(a + this.spiralAngle);
      const y = -r * Math.sin(a + this.spiralAngle) * 0.45 - (a / maxA) * 60;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#f5c542';
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Highlight key 3 nodes based on current spiralStep
    const nodes = [
      { a: 0.8, label: 'KĐ 1 (Khẳng định)' },
      { a: 3.2, label: 'PĐ 1 (Phủ định)' },
      { a: maxA - 0.2, label: 'PĐ của PĐ (Chất mới)' }
    ];

    nodes.forEach((n, idx) => {
      const r = (n.a / maxA) * maxRadius;
      const x = r * Math.cos(n.a + this.spiralAngle);
      const y = -r * Math.sin(n.a + this.spiralAngle) * 0.45 - (n.a / maxA) * 60;

      const isCurrent = (idx + 1) === this.spiralStep;

      ctx.beginPath();
      ctx.arc(x, y, isCurrent ? 9 : 5, 0, Math.PI * 2);
      ctx.fillStyle = isCurrent ? '#ef4444' : '#ffffff';
      ctx.shadowColor = isCurrent ? '#f87171' : '#ffffff';
      ctx.shadowBlur = isCurrent ? 20 : 6;
      ctx.fill();

      if (isCurrent) {
        ctx.font = '600 12px "Be Vietnam Pro", sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.shadowBlur = 0;
        ctx.fillText(n.label, x + 12, y - 5);
      }
    });

    ctx.restore();
  }

  /* ---------------------------------------------
   * 3. MÔ PHỎNG THỐNG NHẤT & ĐẤU TRANH MẶT ĐỐI LẬP
   * --------------------------------------------- */
  initOppoSim() {
    const forceA = document.getElementById('forceASlider');
    const forceB = document.getElementById('forceBSlider');
    if (!forceA || !forceB) return;

    const updateOppo = () => {
      const a = parseInt(forceA.value);
      const b = parseInt(forceB.value);
      const energyDisplay = document.getElementById('dialectEnergy');
      const oppoMessage = document.getElementById('oppoMessage');

      const balance = Math.min(a, b);
      const diff = Math.abs(a - b);
      const energy = Math.round(balance * 2 - diff * 0.5);
      const finalEnergy = Math.max(0, energy);

      if (energyDisplay) energyDisplay.textContent = `${finalEnergy} %`;

      if (oppoMessage) {
        if (a === 0 || b === 0) {
          oppoMessage.textContent = 'Hệ thống tê liệt! Triệt tiêu một mặt đối lập sẽ làm mất luôn nguồn gốc vận động (Siêu hình).';
          oppoMessage.className = 'text-sm text-red-400 font-medium';
        } else if (diff > 45) {
          oppoMessage.textContent = 'Mất cân bằng lớn: Một mặt áp đảo khiến mâu thuẫn trở nên gay gắt nhưng chưa tìm được tiếng nói chung.';
          oppoMessage.className = 'text-sm text-amber-300 font-medium';
        } else {
          oppoMessage.textContent = 'Động lực phát triển tối ưu: Thống nhất trong đấu tranh, thúc đẩy hệ thống tiến hóa không ngừng!';
          oppoMessage.className = 'text-sm text-emerald-400 font-medium';
        }
      }
    };

    forceA.addEventListener('input', updateOppo);
    forceB.addEventListener('input', updateOppo);
    updateOppo();
  }

  drawOppoCanvas() {
    if (!this.oppoCtx) return;
    const ctx = this.oppoCtx;
    const w = this.oppoCanvas.width;
    const h = this.oppoCanvas.height;

    const forceA = document.getElementById('forceASlider');
    const forceB = document.getElementById('forceBSlider');
    const a = forceA ? parseInt(forceA.value) : 50;
    const b = forceB ? parseInt(forceB.value) : 50;

    const speed = Math.max(0.003, Math.min(a, b) * 0.0006);
    this.oppoRotation += speed;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const baseR = 55;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.oppoRotation);

    // Force A (Creative/Passion - Red)
    ctx.beginPath();
    ctx.arc(-25, 0, baseR * (a / 50), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();

    // Force B (Discipline/Reality - Blue)
    ctx.beginPath();
    ctx.arc(25, 0, baseR * (b / 50), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.45)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();

    // Overlapping vortex (The Unity)
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 15;
    ctx.fill();

    ctx.restore();
  }

  /* ---------------------------------------------
   * GLOBAL RENDER LOOP
   * --------------------------------------------- */
  startGlobalLoop() {
    const loop = () => {
      this.drawLeapCanvas();
      this.drawSpiralCanvas();
      this.drawOppoCanvas();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }
}

window.PhilosophySimulations = PhilosophySimulations;
