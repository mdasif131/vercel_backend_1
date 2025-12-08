import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..'); 

export const getValidImagePath = filename => {
  if (!filename || typeof filename !== 'string') return null;

  const cleanFilename = path.basename(filename);
  const uploadDir = path.join(projectRoot, 'uploads');
  const filePath = path.join(uploadDir, cleanFilename);

  const resolvedUploadDir = path.resolve(uploadDir);
  const resolvedFilePath = path.resolve(filePath);

  if (!resolvedFilePath.startsWith(resolvedUploadDir + path.sep)) {
    throw new Error('Invalid file path');
  }

  return resolvedFilePath;
};


