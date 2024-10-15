import http from 'src/util/http';

const patchExportPdfId = async (bookId: string, deviceId: string) =>
  await http.patch(`exportPdf/${bookId}`, {
    headers: { 'x-api-device': deviceId },
  });

const patchExportPdfIdMemberMid = async (bookId: string, memberId: string, deviceId: string) =>
  await http.patch(`exportPdf/${bookId}/member/${memberId}`, {
    headers: { 'x-api-device': deviceId },
  });

export default {
  patchExportPdfId,
  patchExportPdfIdMemberMid,
};
