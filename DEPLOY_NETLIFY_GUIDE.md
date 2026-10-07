# 🚀 HƯỚNG DẪN DEPLOY LÊN NETLIFY & KÍCH HOẠT GROQ AI PROXY

> **Mục tiêu:** Deploy website lên Netlify miễn phí 100%. Bất kỳ ai vào web đều có AI thông minh (LLaMA-3.3-70B) hoạt động trực tiếp, trả lời siêu tốc trong 0.5s mà **KHÔNG CẦN NHẬP BẤT KỲ API KEY NÀO**!

---

## BƯỚC 1: LẤY GROQ API KEY MIỄN PHÍ (30 GIÂY)
1. Truy cập vào: **[https://console.groq.com/keys](https://console.groq.com/keys)**
2. Đăng nhập nhanh bằng tài khoản Google (Gmail) hoặc GitHub.
3. Nhấn nút **"Create API Key"**.
4. Đặt tên bất kỳ (ví dụ: `triethoc-ai`) rồi nhấn **Submit**.
5. Copy mã khóa vừa tạo (mã có dạng `gsk_xxxxxxxxxxxxxxxxxxxxxx`).

*(Groq hoàn toàn miễn phí, tốc độ ~300 tokens/giây, không bị chặn IP Việt Nam như Google AI Studio).*

---

## BƯỚC 2: DEPLOY LÊN NETLIFY TỪ GITHUB (1 PHÚT)
1. Đẩy mã nguồn dự án của bạn lên một repository trên **GitHub**.
2. Truy cập vào: **[https://app.netlify.com](https://app.netlify.com)**
3. Đăng nhập bằng GitHub.
4. Nhấn **"Add new site"** ➔ chọn **"Import an existing project"** ➔ chọn **GitHub**.
5. Chọn repository dự án Triết học của bạn.
6. Netlify sẽ tự động nhận diện file `netlify.toml` đã được cấu hình sẵn trong dự án:
   - **Publish directory:** `.`
   - **Functions directory:** `netlify/functions`
7. Nhấn nút **"Deploy site"**.

---

## BƯỚC 3: CẤU HÌNH BIẾN MÔI TRƯỜNG TRÊN NETLIFY (BƯỚC QUAN TRỌNG NHẤT ⭐)
Để Serverless Function trên Netlify có thể dùng Groq API phục vụ cho mọi khách truy cập:

1. Trong trang quản trị dự án trên Netlify, vào mục **Site configuration** (hoặc **Site settings**).
2. Ở menu bên trái, chọn **Environment variables** (Biến môi trường).
3. Nhấn **Add a variable** (hoặc **Add single variable**):
   - **Key:** `GROQ_API_KEY`
   - **Value:** Dán mã `gsk_...` bạn đã lấy ở Bước 1 vào.
   - **Scopes:** Chọn *All scopes* (hoặc mặc định).
4. Nhấn **Create variable**.
5. Vào tab **Deploys** ➔ Nhấn **Trigger deploy** ➔ chọn **Deploy site** để Netlify cập nhật biến môi trường mới.

---

## 🎯 KẾT QUẢ SAU KHI HOÀN TẤT
- Bạn đã có đường link web công khai dạng: `https://ten-du-an.netlify.app`.
- Bất kỳ ai truy cập đường link này:
  - Khám bệnh tại **"Bác Sĩ Triết Học AI"**: Nhận toa thuốc phân tích mâu thuẫn và quy luật tức thì.
  - Chat cùng **Cụ Marx** & **Lênin**: Đối đáp biện chứng hài hước và sâu sắc.
  - Thách đấu tại **"Đấu Trường Phản Biện"**: AI chấm điểm và bẻ luận điểm siêu sắc bén.
  - **KHÔNG CẦN cài đặt, KHÔNG CẦN đăng ký, KHÔNG CẦN nhập API key!**
- Nếu mạng chập chờn hoặc mất kết nối: Hệ thống tự động kích hoạt **Offline Dialectic Engine** dự phòng, đảm bảo thuyết trình không bao giờ bị lỗi hay đứng hình.
