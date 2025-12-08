// Base44 integrations removed - no longer using Base44 API

// Stub exports to prevent import errors
export const Core = {};

export const InvokeLLM = () => Promise.resolve({ response: '' });

export const SendEmail = () => Promise.resolve({ success: true });

export const UploadFile = () => Promise.resolve({ file_url: '' });

export const GenerateImage = () => Promise.resolve({ image_url: '' });

export const ExtractDataFromUploadedFile = () => Promise.resolve({ data: {} });

export const CreateFileSignedUrl = () => Promise.resolve({ url: '' });

export const UploadPrivateFile = () => Promise.resolve({ file_url: '' });
