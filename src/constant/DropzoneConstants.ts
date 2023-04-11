import { CATEGORY } from 'src/constant/commonConstants';

export const FILE_TYPES = 'image/jpeg, image/png, image/gif, image/svg+xml, video/webm, audio/mpeg, video/mp4';
export const ACCEPTED_FILE_TYPES = {
  [CATEGORY.Art]: 'image/jpeg, image/png, image/gif, image/svg+xml',
  [CATEGORY.Photography]: 'image/jpeg, image/png, image/gif',
  [CATEGORY.Music]: 'audio/mpeg',
  // [CATEGORY['3D Asset']]: 'image/jpeg, image/png,',
  [CATEGORY.Video]: 'video/webm, video/mp4',
  [CATEGORY.Other]: 'image/jpeg, image/png, image/gif, image/svg+xml, video/webm, audio/mpeg, video/mp4',
};
export const MAX_SIZE = 104857600; // 100MB
export const MAX_FILES = 1;
