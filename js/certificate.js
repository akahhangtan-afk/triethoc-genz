/**
 * CERTIFICATE GENERATOR: CẤP CHỨNG NHẬN BẬC THẦY BIỆN CHỨNG
 * Tạo bằng khen kỹ thuật số chất lượng cao (1600x1100 px) bằng HTML5 Canvas
 */

class DialecticCertificate {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = 1600;
    this.height = 1100;
  }

  generate(userName, title = "Bậc Thầy Tư Duy Biện Chứng", scoreText = "5/5 Thử Thách") {
    if (!this.canvas || !this.ctx) return;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    const ctx = this.ctx;

    // 1. Background Luxury Dark
    const bgGrad = ctx.createLinearGradient(0, 0, this.width, this.height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e112a');
    bgGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Ornate Border (Golden Dual Border)
    const margin = 50;
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(margin, margin, this.width - margin * 2, this.height - margin * 2);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin + 16, margin + 16, this.width - (margin + 16) * 2, this.height - (margin + 16) * 2);

    // Corner Ornaments
    this.drawCornerOrnament(ctx, margin + 16, margin + 16, 1, 1);
    this.drawCornerOrnament(ctx, this.width - (margin + 16), margin + 16, -1, 1);
    this.drawCornerOrnament(ctx, margin + 16, this.height - (margin + 16), 1, -1);
    this.drawCornerOrnament(ctx, this.width - (margin + 16), this.height - (margin + 16), -1, -1);

    // Define unified professional font stack with robust Vietnamese-supporting system fallbacks
    const FONT_BASE = '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    // 3. Top Banner & Emblem
    ctx.textAlign = 'center';
    
    // Header Institution / Project
    ctx.font = `600 20px ${FONT_BASE}`;
    ctx.fillStyle = '#f5c542';
    ctx.letterSpacing = '3px';
    ctx.fillText('DỰ ÁN SÁNG TẠO HỌC THUẬT • TRIẾT HỌC MÁC - LÊNIN', this.width / 2, 150);

    // Main Certificate Title
    ctx.font = `800 58px ${FONT_BASE}`;
    ctx.letterSpacing = '1px';
    const goldGrad = ctx.createLinearGradient(this.width / 2 - 350, 0, this.width / 2 + 350, 0);
    goldGrad.addColorStop(0, '#f5c542');
    goldGrad.addColorStop(0.5, '#fffbeb');
    goldGrad.addColorStop(1, '#d4af37');
    ctx.fillStyle = goldGrad;
    ctx.fillText('CHỨNG NHẬN VINH DANH', this.width / 2, 235);

    // Subtitle
    ctx.font = `500 19px ${FONT_BASE}`;
    ctx.fillStyle = '#cbd5e1';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('CHỨNG CHỈ CÔNG NHẬN NĂNG LỰC TƯ DUY BIỆN CHỨNG DUY VẬT', this.width / 2, 280);

    // Decorative divider line
    ctx.beginPath();
    ctx.moveTo(this.width / 2 - 250, 315);
    ctx.lineTo(this.width / 2 + 250, 315);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4. Recipient Name
    ctx.font = `400 22px ${FONT_BASE}`;
    ctx.fillStyle = '#94a3b8';
    ctx.letterSpacing = '0px';
    ctx.fillText('Trân trọng trao tặng cho:', this.width / 2, 395);

    const safeName = (userName && userName.trim()) ? userName.trim() : "Sinh Viên Biện Chứng";
    ctx.font = `800 54px ${FONT_BASE}`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(245, 197, 66, 0.4)';
    ctx.shadowBlur = 15;
    ctx.fillText(safeName.toUpperCase(), this.width / 2, 475);
    ctx.shadowBlur = 0;

    // 5. Title & Achievement Body
    ctx.font = `700 30px ${FONT_BASE}`;
    ctx.fillStyle = '#f87171';
    ctx.fillText(`Danh hiệu: ${title}`, this.width / 2, 550);

    ctx.font = `400 22px ${FONT_BASE}`;
    ctx.fillStyle = '#e2e8f0';
    const textDesc = `Đã xuất sắc giải quyết các thử thách tình huống thực tiễn (${scoreText}),`.normalize('NFC');
    const textDesc2 = 'thấu suốt các quy luật Lượng – Chất, Mâu thuẫn và Phủ định của phủ định,'.normalize('NFC');
    const textDesc3 = 'sẵn sàng ứng dụng thế giới quan và phương pháp luận Mác – Lênin vào cuộc sống!'.normalize('NFC');
    ctx.fillText(textDesc, this.width / 2, 625);
    ctx.fillText(textDesc2, this.width / 2, 665);
    ctx.fillText(textDesc3, this.width / 2, 705);

    // 6. Date & Seal
    const today = new Date();
    const dateStr = `Hà Nội, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
    ctx.font = `italic 18px ${FONT_BASE}`;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(dateStr, this.width / 2, 795);

    // Draw Red Dialectic Seal
    this.drawOfficialSeal(ctx, 360, 915, FONT_BASE);

    // Signatures: Chỉ giữ lại duy nhất Nhóm 1 • MKT1920-DIG
    ctx.font = `700 26px ${FONT_BASE}`;
    ctx.fillStyle = '#f5c542';
    ctx.fillText('Nhóm 1 • MKT1920-DIG', this.width - 380, 915);

    ctx.font = `400 16px ${FONT_BASE}`;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('(Ký tên & Đóng dấu điện tử)', this.width - 380, 955);
  }

  drawCornerOrnament(ctx, x, y, dirX, dirY) {
    ctx.save();
    ctx.strokeStyle = '#f5c542';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + dirY * 35);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dirX * 35, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + dirX * 12, y + dirY * 12, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.restore();
  }

  drawOfficialSeal(ctx, cx, cy, fontBase) {
    const fontStack = fontBase || '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.save();
    ctx.translate(cx, cy);

    // Outer circle
    ctx.beginPath();
    ctx.arc(0, 0, 75, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Inner dashed circle
    ctx.beginPath();
    ctx.arc(0, 0, 65, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();

    // Star in center
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('★', 0, -8);

    // Seal text
    ctx.font = `700 12px ${fontStack}`;
    ctx.letterSpacing = '1px';
    ctx.fillText('CHỨNG THỰC', 0, 20);
    ctx.font = `600 10px ${fontStack}`;
    ctx.fillText('BIỆN CHỨNG DUY VẬT', 0, 36);

    ctx.restore();
  }

  download(filename = 'Chung_Nhan_Triet_Hoc_GenZ.png') {
    if (!this.canvas) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

window.DialecticCertificate = DialecticCertificate;
