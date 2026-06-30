import fs from "fs";
import path from "path";

const saveLocalFile = (file, folder = "") => {
  const uploadsDir = path.resolve("uploads", folder);
  fs.mkdirSync(uploadsDir, { recursive: true });
  const fileName = `${Date.now()}-${file.originalname}`.replace(/\s+/g, "-");
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, file.buffer);
  return `/uploads/${folder ? `${folder}/` : ""}${fileName}`.replace(/\\/g, "/");
};

export default saveLocalFile;
