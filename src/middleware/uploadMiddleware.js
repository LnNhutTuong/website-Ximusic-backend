import multer from "multer";
import path from "path";
import fs from "fs";

const createUploadMiddleware = (folderPath) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // folderPath truyền vào có thể là 'genre' hoặc 'song/thumb'
      const dir = `uploads/${folderPath}/`;

      // fs.mkdirSync với { recursive: true } sẽ tự động tạo toàn bộ các thư mục con
      // Ví dụ: tự tạo 'uploads', sau đó tạo 'song', rồi tạo 'thumb' nếu chúng chưa tồn tại
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // Lấy tên file gốc hoặc đặt tên theo fieldname
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
      );
    },
  });

  return multer({ storage: storage });
};

export default createUploadMiddleware;
