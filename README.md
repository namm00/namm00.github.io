# SafeLayer — AI Safety Field Guide

Một website tĩnh dùng để học cấu trúc và cách hoạt động của một trang web thông thường. Dự án không dùng framework, database, API key hay dịch vụ backend.

## Cấu trúc

- `index.html`: nội dung và cấu trúc ngữ nghĩa của trang.
- `style.css`: màu sắc, bố cục, responsive, dark/light theme và animation.
- `script.js`: menu mobile, tìm kiếm/lọc, FAQ, tình huống tương tác và checklist.
- `README.md`: hướng dẫn dự án.

## Chạy trên máy

Cách đơn giản nhất là mở trực tiếp `index.html`. Để mô phỏng website thật tốt hơn, chạy một local server:

```bash
python3 -m http.server 8000
```

Sau đó mở `http://localhost:8000`.

## Website hoạt động như thế nào?

1. Trình duyệt tải `index.html` để tạo nội dung trang.
2. Dòng `<link rel="stylesheet" href="style.css">` tải CSS để tạo giao diện.
3. Dòng `<script src="script.js"></script>` tải JavaScript để thêm tương tác.
4. Khi người dùng đánh dấu checklist hoặc đổi theme, JavaScript lưu lựa chọn vào `localStorage` trong trình duyệt. Không có dữ liệu nào được gửi lên server.

## Đưa lên GitHub Pages miễn phí

1. Push các file lên nhánh `main` của một repository GitHub public.
2. Mở repository trên GitHub, vào **Settings → Pages**.
3. Trong **Build and deployment**, chọn **Deploy from a branch**.
4. Chọn branch **main**, thư mục **/(root)** rồi bấm **Save**.
5. Chờ GitHub build xong. Địa chỉ thường có dạng `https://ten-tai-khoan.github.io/ten-repository/`.

Mỗi lần bạn push thay đổi mới lên `main`, GitHub Pages sẽ tự cập nhật website.

## Giới hạn của website tĩnh

Website này phù hợp để hiển thị nội dung và chạy logic trong trình duyệt. Nếu sau này cần đăng nhập, dữ liệu dùng chung giữa nhiều người, thanh toán hoặc giữ bí mật API key, bạn sẽ cần backend hoặc một dịch vụ phù hợp. Không đặt mật khẩu hay API key trong HTML/JavaScript vì ai truy cập trang cũng có thể xem mã nguồn.
