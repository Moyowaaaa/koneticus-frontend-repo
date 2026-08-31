export type PendingChatFile = {
  url: string;
  file: File;
};

export const MAX_CHAT_ATTACHMENTS = 4;
export const MAX_CHAT_DOCUMENT_BYTES = 10 * 1024 * 1024;

const DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const DOCUMENT_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

export const CHAT_DOCUMENT_ACCEPT = [
  ".pdf",
  ".doc",
  ".docx",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

const getExtension = (fileName: string) => {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
};

export const getChatAttachmentExtension = (name?: string | null) => {
  if (!name) return "";
  return getExtension(name);
};

export const isPdfAttachment = (attachment: {
  mimeType?: string | null;
  name?: string | null;
}) =>
  attachment.mimeType === "application/pdf" ||
  getChatAttachmentExtension(attachment.name) === "pdf";

export const isChatImageFile = (file: File) => file.type.startsWith("image/");

export const isChatDocumentFile = (file: File) => {
  if (isChatImageFile(file)) return false;
  if (DOCUMENT_MIME_TYPES.has(file.type)) return true;
  return DOCUMENT_EXTENSIONS.has(getExtension(file.name));
};

export const pickChatDocuments = (
  files: FileList | File[],
  remainingSlots: number,
): { accepted: File[]; error?: string } => {
  if (remainingSlots <= 0) {
    return { accepted: [], error: "You can attach up to 4 files" };
  }

  const accepted: File[] = [];
  let error: string | undefined;

  for (const file of Array.from(files)) {
    if (accepted.length >= remainingSlots) {
      error = "You can attach up to 4 files";
      break;
    }

    if (!isChatDocumentFile(file)) {
      error = `${file.name} isn’t a PDF, DOC, or DOCX`;
      continue;
    }

    if (file.size > MAX_CHAT_DOCUMENT_BYTES) {
      error = `${file.name} is larger than 10MB`;
      continue;
    }

    accepted.push(file);
  }

  return { accepted, error };
};

export const formatChatFileSize = (bytes: number) => {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
