import { t } from 'i18next';
import http from 'src/util/http';

const patchExportPdfId = async (bookId: string, deviceId: string) => {
  try {
    return await http.patch(`exportPdf/${bookId}`, {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const patchExportPdfIdMemberMid = async (bookId: string, memberId: string, deviceId: string) => {
  try {
    return await http.patch(`exportPdf/${bookId}/member/${memberId}`, {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

export default {
  patchExportPdfId,
  patchExportPdfIdMemberMid,
};
