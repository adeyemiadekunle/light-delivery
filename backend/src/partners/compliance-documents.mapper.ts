import { CreateComplianceDocumentDto } from './dto/create-compliance-document.dto';

export function buildComplianceDocumentCreates(documents?: CreateComplianceDocumentDto[]) {
  if (!documents?.length) {
    return {};
  }

  return {
    documents: {
      create: documents.map((document) => ({
        type: document.type,
        documentNumber: document.documentNumber,
        storageKey: document.storageKey,
        fileName: document.fileName,
        issuedAt: document.issuedAt ? new Date(document.issuedAt) : undefined,
        expiresAt: document.expiresAt ? new Date(document.expiresAt) : undefined,
        notes: document.notes,
      })),
    },
  };
}
