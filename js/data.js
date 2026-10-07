/**
 * DATA REPOSITORY: TRIẾT HỌC CHO GEN Z
 * Dữ liệu chuẩn xác theo Giáo trình Triết học Mác - Lênin (Bộ GD&ĐT)
 * Được biên soạn dưới góc nhìn ứng dụng thực tiễn cho đời sống và sinh viên.
 */

const PHILO_DATA = {
  // 1. PHÒNG KHÁM BIỆN CHỨNG: BẮT BỆNH TÂM LÝ - KÊ ĐƠN TRIẾT HỌC
  prescriptions: [
    {
      id: "overthinking",
      name: "Overthinking & Trì Hoãn Vô Tận",
      icon: "🧠",
      tag: "Học tập & Hành động",
      symptom: "Nghĩ quá nhiều kịch bản xấu, lên kế hoạch hoàn hảo trên giấy nhưng không dám bắt đầu, sợ sai lầm nên trì hoãn từ ngày này qua tháng nọ.",
      diagnosis: "Bệnh lý: Tách rời Lý luận khỏi Thực tiễn. Rơi vào vũng lầy của chủ nghĩa duy tâm chủ quan, xem nhẹ hoạt động thực tiễn khách quan.",
      law: "Nguyên lý về Vai trò của Thực tiễn đối với Nhận thức",
      quote: "Ý kiến cho rằng thực tiễn là tiêu chuẩn của chân lý... đòi hỏi người ta phải gắn liền nhận thức với cuộc sống.",
      quoteAuthor: "V.I. Lênin",
      cure: [
        "Thực tiễn là cơ sở, động lực và tiêu chuẩn duy nhất của chân lý: Mọi suy nghĩ trong đầu chỉ là giả thuyết cho đến khi bạn bắt tay vào kiểm chứng.",
        "Ngừng tìm kiếm sự hoàn hảo trên lý thuyết: Hãy hạ tiêu chuẩn bước đầu, làm một bản nháp tệ còn hơn một ý tưởng vĩ đại trong đầu.",
        "Quy tắc 5 phút biện chứng: Bắt tay vào làm ngay 5 phút. Hành động thực tế sẽ tự sinh ra phản hồi và năng lượng mới (Vật chất quyết định ý thức)."
      ],
      actionBadge: "Liều dùng: Bắt tay làm ngay trong 5 phút tới!"
    },
    {
      id: "impatient",
      name: "Nản Lòng Vì Cố Gắng Chưa Thấy Kết Quả",
      icon: "⏳",
      tag: "Phát triển bản thân",
      symptom: "Học ngoại ngữ 2 tuần chưa nói được, tập gym 1 tháng chưa thấy cơ, làm đồ án vài hôm thấy bế tắc rồi muốn bỏ cuộc vì nghĩ mình không có năng khiếu.",
      diagnosis: "Bệnh lý: Nôn nóng đốt cháy giai đoạn. Vi phạm quy luật chuyển hóa từ những thay đổi về lượng dẫn đến những thay đổi về chất.",
      law: "Quy luật Lượng - Chất (Từ những thay đổi về lượng dẫn đến sự thay đổi về chất và ngược lại)",
      quote: "Sự phát triển không diễn ra theo đường thẳng mà trải qua những bước nhảy vọt sau một quá trình tích lũy lâu dài về lượng.",
      quoteAuthor: "Ph. Ăng-ghen",
      cure: [
        "Hiểu về 'Độ' (Khoảng giới hạn): Bạn đang trong khoảng Độ tích lũy, nơi lượng đổi nhưng chất cũ chưa thể đổi ngay. Đây là giai đoạn tích lũy ngầm.",
        "Tập trung chạm đến 'Điểm nút': Mỗi từ vựng bạn học, mỗi trang sách bạn đọc là một đơn vị lượng. Đủ lượng ắt chạm Điểm nút.",
        "Chờ đợi 'Bước nhảy': Khi tích lũy đủ về lượng, bước nhảy về chất sẽ tự động diễn ra. Đừng đòi hỏi kết quả của bước nhảy khi lượng chưa tích lũy đủ 10%!"
      ],
      actionBadge: "Liều dùng: Tích lũy thêm 30 ngày kiên trì không phán xét!"
    },
    {
      id: "conflict",
      name: "Xung Đột Teamwork & Khủng Hoảng Nội Tâm",
      icon: "⚡",
      tag: "Quan hệ & Giao tiếp",
      symptom: "Cãi nhau nảy lửa khi làm bài tập nhóm, bất đồng quan điểm với gia đình, hoặc nội tâm tự giằng xé giữa đam mê cá nhân và kỳ vọng xã hội.",
      diagnosis: "Bệnh lý: Sợ hãi mâu thuẫn, muốn trốn tránh hoặc triệt tiêu ý kiến đối lập một cách siêu hình, không hiểu mâu thuẫn chính là nguồn gốc phát triển.",
      law: "Quy luật Thống nhất và Đấu tranh của các mặt đối lập (Hạt nhân của phép biện chứng)",
      quote: "Sự phát triển là cuộc 'đấu tranh' của các mặt đối lập.",
      quoteAuthor: "V.I. Lênin",
      cure: [
        "Mâu thuẫn là khách quan và phổ biến: Bất cứ sự vật, hiện tượng hay mối quan hệ nào cũng chứa đựng các mặt đối lập bên trong nó.",
        "Không có mâu thuẫn thì không có tiến bộ: Một nhóm toàn người gật đầu đồng ý sẽ tạo ra sản phẩm tầm thường. Tranh luận chính là động lực để tìm ra giải pháp tối ưu.",
        "Tìm kiếm sự 'Thống nhất' ở nấc thang cao hơn: Giải quyết mâu thuẫn không phải là tiêu diệt người bất đồng, mà là tìm ra điểm giao thoa để cùng phát triển."
      ],
      actionBadge: "Liều dùng: Biến tranh cãi thành buổi phản biện xây dựng!"
    },
    {
      id: "failure-fear",
      name: "Sợ Thất Bại & Mắc Kẹt Trong Quá Khứ",
      icon: "🔄",
      tag: "Tâm lý & Nghị lực",
      symptom: "Vừa trượt môn, chia tay người yêu hoặc phỏng vấn thất bại liền suy sụp, cảm thấy mọi công sức đổ sông đổ bể và tương lai mù mịt.",
      diagnosis: "Bệnh lý: Nhìn nhận sự việc theo quan điểm Siêu hình (xem thất bại là dấu chấm hết, cô lập sự việc khỏi dòng chảy vận động).",
      law: "Quy luật Phủ định của phủ định (Khuynh hướng phát triển theo đường xoắn ốc)",
      quote: "Sự phát triển dường như lặp lại những giai đoạn đã qua... nhưng lặp lại dưới một hình thức khác, ở một trình độ cao hơn.",
      quoteAuthor: "V.I. Lênin",
      cure: [
        "Phủ định biện chứng có tính kế thừa: Thất bại hôm nay không phải là hủy diệt sạch trơn, mà là một bước phủ định để bạn giữ lại kinh nghiệm và loại bỏ cách làm sai.",
        "Đường xoắn ốc đi lên: Con đường thành công không phải đường thẳng mà là hình xoắn ốc. Có những lúc bạn tưởng mình tụt lùi về vạch xuất phát, nhưng thực chất bạn đang đứng ở vị trí cao hơn với tầm nhìn mới.",
        "Cái mới tất yếu sẽ chiến thắng cái cũ: Bản thân bạn sau cú vấp ngã sẽ là một phiên bản 'chất mới' mạnh mẽ hơn nhiều lần."
      ],
      actionBadge: "Liều dùng: Đúc kết 3 bài học kế thừa và tái xuất phát!"
    },
    {
      id: "peer-pressure",
      name: "Áp Lực Đồng Trang Lứa (Peer Pressure)",
      icon: "👥",
      tag: "Định vị bản thân",
      symptom: "Lướt mạng xã hội thấy bạn bè mua xe, đi thực tập công ty lớn, khoe thành tích thì thấy mình kém cỏi, vô dụng, tự ti tột độ.",
      diagnosis: "Bệnh lý: Nhầm lẫn giữa 'Hiện tượng' và 'Bản chất', xem xét con người tách rời 'Điều kiện lịch sử - cụ thể'.",
      law: "Cặp phạm trù Bản chất - Hiện tượng & Quan điểm Lịch sử - Cụ thể",
      quote: "Bản chất biểu hiện qua hiện tượng; hiện tượng là sự biểu hiện của bản chất... Nhưng hiện tượng không bao giờ phản ánh đầy đủ bản chất.",
      quoteAuthor: "Giáo trình Triết học Mác - Lênin",
      cure: [
        "Hiện tượng trên mạng chỉ là bề nổi: Thứ bạn thấy trên Facebook/LinkedIn chỉ là hiện tượng đã qua chọn lọc, chưa chắc đã phản ánh bản chất thực tế cuộc sống của họ.",
        "Nguyên lý Lịch sử - Cụ thể: Mỗi người có xuất phát điểm, hoàn cảnh gia đình, nguồn lực và tiến trình tích lũy khác nhau. So sánh khập khiễng là phản khoa học.",
        "Tập trung vào điều kiện của chính mình: Hãy xem xét bản thân trong mối liên hệ cụ thể của riêng bạn để tìm ra quy luật phát triển phù hợp nhất."
      ],
      actionBadge: "Liều dùng: Tắt mạng xã hội 3 tiếng, tập trung vào việc của mình!"
    },
    {
      id: "loss-focus",
      name: "Mất Phương Hướng & Thiếu Kỷ Luật",
      icon: "🧭",
      tag: "Mục tiêu cuộc sống",
      symptom: "Không biết mình thích gì, đặt ra 10 mục tiêu cùng lúc rồi không làm được cái nào, cả ngày lướt video ngắn trong vô thức.",
      diagnosis: "Bệnh lý: Chưa xác định được 'Mâu thuẫn chủ yếu' và vai trò chỉ đạo của 'Vật chất đối với Ý thức'.",
      law: "Mối quan hệ Biện chứng giữa Vật chất và Ý thức & Cặp phạm trù Nguyên nhân - Kết quả",
      quote: "Không phải ý thức của con người quyết định sự tồn tại của họ; trái lại, sự tồn tại xã hội của họ quyết định ý thức của họ.",
      quoteAuthor: "C. Mác",
      cure: [
        "Sắp xếp lại môi trường vật chất: Muốn có ý thức tập trung, trước hết phải dọn dẹp bàn học, tắt thông báo điện thoại, ngủ đủ giấc (Vật chất quyết định ý thức).",
        "Tìm ra mâu thuẫn chủ yếu: Trong vô vàn việc cần làm, việc nào là 'điểm chốt' giải quyết xong sẽ tháo gỡ các việc khác? Tập trung 80% sức lực vào nó.",
        "Gieo nguyên nhân tất yếu: Bạn không thể mong có kết quả điểm cao nếu nguyên nhân bạn gieo mỗi ngày là 6 tiếng cày TikTok."
      ],
      actionBadge: "Liều dùng: Chọn 1 việc quan trọng nhất ngày mai để hoàn thành!"
    }
  ],

  // 2. BỘ THẺ BÀI KHAI SÁNG (DAILY PHILOSOPHY TAROT)
  tarotCards: [
    {
      id: "card-leap",
      title: "Bước Nhảy Vọt (The Leap)",
      subtitle: "Quy luật Lượng - Chất",
      symbol: "⚡",
      rarity: "Huyền thoại",
      keywords: ["Chuyển hóa", "Đột phá", "Thành quả"],
      message: "Những chuỗi ngày bạn thầm lặng nỗ lực không hề vô nghĩa. Bạn đang tiến rất gần đến Điểm nút rồi. Hôm nay, hãy chuẩn bị tinh thần cho một bước nhảy đột phá!",
      advice: "Dám thử thách làm một việc vượt khỏi vùng an toàn thường ngày.",
      color: "from-amber-500 to-red-600"
    },
    {
      id: "card-nodal",
      title: "Điểm Nút (The Nodal Point)",
      subtitle: "Quy luật Lượng - Chất",
      symbol: "📍",
      rarity: "Hiếm",
      keywords: ["Kiên nhẫn", "Tích lũy", "Giới hạn"],
      message: "Nước ở 99 độ C vẫn chưa sôi, nhưng chỉ cần thêm 1 độ C nữa là trạng thái mới sẽ xuất hiện. Đừng dừng lại ngay trước ngưỡng cửa của sự biến đổi!",
      advice: "Cố gắng thêm một chút nữa, dù đó chỉ là 1 trang sách hay 1 bài tập.",
      color: "from-red-600 to-rose-700"
    },
    {
      id: "card-conflict",
      title: "Mặt Đối Lập (The Opposites)",
      subtitle: "Quy luật Mâu thuẫn",
      symbol: "☯️",
      rarity: "Hiếm",
      keywords: ["Động lực", "Xung đột", "Cân bằng"],
      message: "Bất đồng quan điểm hôm nay không phải để chia rẽ, mà là để gợi mở chân lý. Hãy lắng nghe cả mặt đối lập để có cái nhìn toàn diện.",
      advice: "Đừng vội phán xét một ý kiến trái chiều; hãy tìm hạt nhân hợp lý trong đó.",
      color: "from-blue-600 to-indigo-800"
    },
    {
      id: "card-spiral",
      title: "Đường Xoắn Ốc (The Spiral)",
      subtitle: "Quy luật Phủ định của phủ định",
      symbol: "🌀",
      rarity: "Sử thi",
      keywords: ["Kế thừa", "Tiến hóa", "Tái sinh"],
      message: "Có vẻ như bạn đang quay lại điểm xuất phát, nhưng thực ra bạn đang ở tầng cao hơn. Mọi bài học cũ đều là hành trang cho phiên bản nâng cấp của bạn.",
      advice: "Bỏ qua mặc cảm quá khứ, trân trọng những trải nghiệm đã rèn giũa bản thân.",
      color: "from-purple-600 to-indigo-900"
    },
    {
      id: "card-practice",
      title: "Thực Tiễn Tối Cao (The Practice)",
      subtitle: "Nguyên lý Thực tiễn",
      symbol: "🔨",
      rarity: "Huyền thoại",
      keywords: ["Hành động", "Chân lý", "Trải nghiệm"],
      message: "Một ounce thực tiễn có giá trị hơn cả một tấn lý thuyết suông. Mọi băn khoăn của bạn chỉ có thể giải tỏa khi bạn thực sự bắt tay vào hành động.",
      advice: "Biến ý tưởng thành sản phẩm thực tế, dù là sản phẩm sơ khai nhất.",
      color: "from-emerald-600 to-teal-800"
    },
    {
      id: "card-matter",
      title: "Vật Chất Khách Quan (Objective Reality)",
      subtitle: "Bản thể luận Duy vật",
      symbol: "🌍",
      rarity: "Phổ biến",
      keywords: ["Khách quan", "Thực tế", "Tỉnh táo"],
      message: "Thế giới không vận hành theo ý muốn chủ quan của bạn. Tôn trọng quy luật khách quan và điều kiện thực tế là bước đầu tiên của người thông thái.",
      advice: "Nhìn nhận sự việc đúng như nó đang là, không tự huyễn hoặc bản thân.",
      color: "from-amber-600 to-stone-800"
    },
    {
      id: "card-essence",
      title: "Bản Chất Thấu Suốt (The Essence)",
      subtitle: "Bản chất & Hiện tượng",
      symbol: "👁️",
      rarity: "Hiếm",
      keywords: ["Sâu sắc", "Phân tích", "Chân thực"],
      message: "Đừng để những hào nhoáng bề ngoài đánh lừa bạn. Hiện tượng thường xuyên xuyên tạc bản chất. Hãy đi sâu vào cấu trúc bên trong của vấn đề.",
      advice: "Tự hỏi 'Tại sao?' ít nhất 3 lần trước khi đưa ra quyết định quan trọng.",
      color: "from-cyan-600 to-blue-900"
    },
    {
      id: "card-necessity",
      title: "Tất Nhiên & Tự Do (Necessity & Freedom)",
      subtitle: "Tất nhiên & Ngẫu nhiên",
      symbol: "🦅",
      rarity: "Sử thi",
      keywords: ["Làm chủ", "Quy luật", "Tự do"],
      message: "Tự do không phải là muốn làm gì thì làm một cách mù quáng, mà là nhận thức được cái tất nhiên để hành động phù hợp với quy luật.",
      advice: "Nắm vững luật chơi trước khi muốn trở thành người chiến thắng xuất sắc.",
      color: "from-yellow-500 to-amber-700"
    }
  ],

  // 3. ĐẤU TRƯỜNG TÌNH HUỐNG & TRẮC NGHIỆM BIỆN CHỨNG
  quizScenarios: [
    {
      id: 1,
      scenario: "Bạn làm trưởng nhóm bài tập lớn. Hai thành viên cãi vã gay gắt về hướng giải quyết đề tài, không khí cực kỳ căng thẳng. Theo Triết học Mác - Lênin, bạn nên hành xử thế nào?",
      options: [
        {
          text: "Bắt cả hai im lặng, tự mình quyết định hết để giữ hòa khí bằng mọi giá.",
          isCorrect: false,
          feedback: "Sai lầm! Đây là cách giải quyết siêu hình, dập tắt mâu thuẫn giả tạo thay vì tận dụng nó để phát triển bài làm."
        },
        {
          text: "Đuổi bớt một bạn ra khỏi nhóm để triệt tiêu hoàn toàn mâu thuẫn.",
          isCorrect: false,
          feedback: "Sai lầm! Mâu thuẫn là khách quan, đuổi người này thì mâu thuẫn khác vẫn nảy sinh trong nội bộ."
        },
        {
          text: "Tổ chức phiên phản biện: Yêu cầu mỗi bên chỉ ra hạt nhân hợp lý của đối phương, từ đó tổng hợp thành giải pháp ưu việt hơn.",
          isCorrect: true,
          feedback: "Chính xác! Bạn đã vận dụng 'Quy luật Thống nhất và Đấu tranh của các mặt đối lập' - biến xung đột thành động lực phát triển."
        },
        {
          text: "Kệ họ tự cãi nhau, khi nào chán thì làm tiếp, thuận theo tự nhiên.",
          isCorrect: false,
          feedback: "Sai lầm! Đây là thái độ buông xuôi duy tâm, thiếu vai trò định hướng biện chứng của chủ thể."
        }
      ]
    },
    {
      id: 2,
      scenario: "Bạn muốn chuyển ngành sang IT hoặc Thiết kế đồ họa nhưng mới học 1 tháng thấy quá khó, code toàn lỗi và muốn bỏ cuộc. Lời khuyên triết học nào đúng đắn nhất?",
      options: [
        {
          text: "Bỏ ngay đi, vì chứng tỏ bạn sinh ra không có 'gen' công nghệ (Duy tâm tiền định).",
          isCorrect: false,
          feedback: "Sai lầm! Bạn đang rơi vào cái bẫy định mệnh luận, phủ nhận khả năng biến đổi của con người qua thực tiễn."
        },
        {
          text: "Hiểu rằng 1 tháng là lượng tích lũy quá nhỏ trong khoảng 'Độ'; cần kiên trì nạp đủ lượng để tạo 'Bước nhảy' biến đổi chất lượng tư duy.",
          isCorrect: true,
          feedback: "Xuất sắc! 'Quy luật Lượng - Chất' dạy rằng không có chuyên gia nào sinh ra đã giỏi mà không qua giai đoạn tích lũy lượng âm thầm."
        },
        {
          text: "Cứ thức trắng 3 đêm liền để học cấp tốc lấy chứng chỉ trong tuần sau.",
          isCorrect: false,
          feedback: "Sai lầm! Đốt cháy giai đoạn một cách chủ quan duy ý chí sẽ dẫn đến kiệt sức và thất bại."
        },
        {
          text: "Đợi khi nào có cảm hứng dồi dào thì mới ngồi vào học tiếp.",
          isCorrect: false,
          feedback: "Sai lầm! Cảm hứng là ý thức phụ thuộc vào môi trường rèn luyện thực tiễn, không thể ngồi chờ sung rụng."
        }
      ]
    },
    {
      id: 3,
      scenario: "Trí tuệ nhân tạo (AI như ChatGPT) ngày càng thông minh. Một số bạn bè bảo AI sắp có ý thức và sẽ thống trị con người hoàn toàn. Góc nhìn Triết học Mác - Lênin phản hồi ra sao?",
      options: [
        {
          text: "Đúng rồi, máy tính tính toán nhanh hơn người nên chắc chắn đã có ý thức cao hơn người.",
          isCorrect: false,
          feedback: "Sai! Tốc độ tính toán logic không đồng nghĩa với ý thức xã hội và cảm xúc con người."
        },
        {
          text: "AI chỉ là công cụ mô phỏng quá trình tư duy; ý thức là thuộc tính riêng của vật chất có tổ chức cao (bộ não người) gắn liền với lao động và đời sống xã hội.",
          isCorrect: true,
          feedback: "Chuẩn xác tuyệt đối! Nguồn gốc xã hội của ý thức bắt nguồn từ Lao động và Ngôn ngữ trong quan hệ người - người. AI không có hoạt động xã hội thực tế này."
        },
        {
          text: "AI có linh hồn riêng do các lập trình viên thổi vào qua các dòng mã thuật toán.",
          isCorrect: false,
          feedback: "Sai lầm! Đây là quan điểm duy tâm thần bí."
        },
        {
          text: "AI hoàn toàn vô dụng, không có giá trị gì đối với sự tiến bộ của văn minh nhân loại.",
          isCorrect: false,
          feedback: "Sai lầm! Đánh giá siêu hình, phủ nhận sự phát triển của công cụ lao động và lực lượng sản xuất."
        }
      ]
    },
    {
      id: 4,
      scenario: "Bạn dành 6 tháng làm một dự án khởi nghiệp sinh viên nhưng bị thất bại thảm hại, mất cả tiền lẫn công sức. Góc nhìn 'Phủ định của phủ định' an ủi bạn thế nào?",
      options: [
        {
          text: "Đó là sự sụp đổ tuyệt đối, bạn trắng tay và nên từ bỏ vĩnh viễn con đường khởi nghiệp.",
          isCorrect: false,
          feedback: "Sai! Đó là phủ định sạch trơn siêu hình kiểu 'đổ nước bẩn đổ luôn cả đứa trẻ'."
        },
        {
          text: "Thất bại này là bước phủ định thứ nhất; bạn giữ lại bài học kinh nghiệm (tính kế thừa) để ở chu kỳ sau tái xuất phát ở một trình độ cao hơn theo đường xoắn ốc.",
          isCorrect: true,
          feedback: "Rất chuẩn! Phủ định biện chứng luôn mang tính khách quan và kế thừa. Bạn không trắng tay, bạn vừa mua được bài học xương máu!"
        },
        {
          text: "Đổ lỗi cho vận xui và đi xem bói để giải hạn phong thủy.",
          isCorrect: false,
          feedback: "Sai lầm! Lạc vào tư tưởng duy tâm mê tín dị đoan."
        },
        {
          text: "Lặp lại y hệt mô hình cũ vì tin rằng kiên trì mù quáng thế nào cũng thành công.",
          isCorrect: false,
          feedback: "Sai lầm! Không phủ định cái sai cũ thì sẽ mãi dậm chân tại chỗ."
        }
      ]
    },
    {
      id: 5,
      scenario: "Bạn đọc hàng trăm cuốn sách self-help, nghe podcast làm giàu mỗi ngày nhưng điểm số và tài chính vẫn chẳng thay đổi gì. Lý do triết học cốt lõi là gì?",
      options: [
        {
          text: "Do số lượng sách chưa đủ, cần phải đọc thêm 500 cuốn nữa mới linh nghiệm.",
          isCorrect: false,
          feedback: "Sai! Lượng lý thuyết không tự động biến thành hiện thực nếu thiếu cầu nối."
        },
        {
          text: "Lý luận bị tách rời khỏi thực tiễn. Thực tiễn mới là động lực, mục đích và tiêu chuẩn duy nhất của chân lý.",
          isCorrect: true,
          feedback: "Hoan hô! C. Mác từng nói: 'Các nhà triết học từ trước đến nay chỉ giải thích thế giới bằng nhiều cách khác nhau, song vấn đề là cải tạo thế giới'."
        },
        {
          text: "Do sách self-help hoàn toàn độc hại, không nên đọc bất kỳ cuốn sách nào.",
          isCorrect: false,
          feedback: "Sai! Cực đoan siêu hình. Sách có giá trị định hướng nếu được áp dụng vào thực tế."
        },
        {
          text: "Do vũ trụ chưa gửi tín hiệu Luật Hấp Dẫn tới bạn.",
          isCorrect: false,
          feedback: "Sai! Lại là quan điểm duy tâm thần bí."
        }
      ]
    }
  ],

  // 4. TRÍCH DẪN KINH ĐIỂN TRUYỀN CẢM HỨNG
  famousQuotes: [
    {
      quote: "Các nhà triết học từ trước đến nay chỉ giải thích thế giới bằng nhiều cách khác nhau, song vấn đề là cải tạo thế giới.",
      author: "C. Mác",
      work: "Luận cương về Phoi-ơ-bắc (1845)"
    },
    {
      quote: "Học, học nữa, học mãi.",
      author: "V.I. Lênin",
      work: "Về công tác của các tổ chức Đoàn thanh niên"
    },
    {
      quote: "Ý thức của con người không chỉ phản ánh thế giới khách quan, mà còn sáng tạo ra thế giới khách quan.",
      author: "V.I. Lênin",
      work: "Bút ký triết học"
    },
    {
      quote: "Không có lý luận cách mạng thì cũng không thể có phong trào cách mạng.",
      author: "V.I. Lênin",
      work: "Làm gì? (1902)"
    },
    {
      quote: "Tự do là nhận thức được cái tất yếu.",
      author: "Ph. Ăng-ghen",
      work: "Chống Đuy-rinh"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PHILO_DATA;
}
