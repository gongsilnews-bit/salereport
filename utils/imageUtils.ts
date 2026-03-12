
/**
 * 클라이언트 사이드에서 이미지 용량을 압축하는 유틸리티입니다.
 * Firestore 1MB 제한 문제를 해결하기 위해 이미지의 최대 너비를 제한하고 품질을 조절합니다.
 */
export const compressImage = (base64Str: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // 최대 너비 기준 비율 조정
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      // JPEG 포맷으로 압축 (용량 감소 효과가 가장 큼)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.onerror = () => {
      resolve(base64Str); // 에러 발생 시 원본 반환
    };
  });
};
