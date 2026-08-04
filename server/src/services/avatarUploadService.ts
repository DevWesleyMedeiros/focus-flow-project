// TODO: Serviço de upload de avatar - configurar credenciais Cloudinary
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

// Inicializa Cloudinary apenas se as credenciais existirem
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Configuração do multer para upload em memória
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não suportado. Use JPG, PNG ou WebP."));
    }
  },
});

// Função stub para upload - implementação real depende das credenciais
export const uploadAvatar = async (
  buffer: Buffer,
  userId: string,
): Promise<string | null> => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn("Cloudinary não configurado - upload de avatar desativado");
    return null;
  }

  try {
    // Upload real só acontece se as credenciais estiverem configuradas
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "focusflow/avatars", public_id: userId },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error("Erro no upload do avatar:", error);
    return null;
  }
};
