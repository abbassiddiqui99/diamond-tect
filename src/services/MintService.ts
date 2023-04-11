import axios from 'axios';
import { GifReader } from 'omggif';
import { create, Options } from 'ipfs-http-client';

import { getResolvedAssetUrl } from 'src/services/http/restApi';
import { fileObjectForIPFS, getIpfsUrl } from 'src/utils/helpers';

const client = create(process.env.REACT_APP_IPFS_URL as Options);

export const uploadToIpfs = async (item: { path: string; content: File } | string, options?: Record<string, unknown>) => {
  return await client.add(item, options);
};

const getDuration = (file: File | string): Promise<number> => {
  return new Promise(resolve => {
    const videoPlayer = document.createElement('video');

    if (typeof file === 'string') {
      videoPlayer.setAttribute('src', file);
    } else {
      videoPlayer.setAttribute('src', URL.createObjectURL(file));
    }
    videoPlayer.load();
    videoPlayer.addEventListener('loadedmetadata', () => {
      resolve(videoPlayer.duration);
    });
  });
};

const getVideoCover = (file: File | string, seekTo = 0.0): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    // load the file to a video player
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('crossorigin', 'Anonymous');
    if (typeof file === 'string') {
      videoPlayer.setAttribute('src', file);
    } else {
      videoPlayer.setAttribute('src', URL.createObjectURL(file));
    }
    videoPlayer.load();
    videoPlayer.addEventListener('error', () => {
      reject('error when loading video file');
    });
    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener('loadedmetadata', () => {
      // seek to user defined timestamp (in seconds) if possible
      if (videoPlayer.duration < seekTo) {
        reject('video is too short.');
        return;
      }

      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener('seeked', () => {
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement('canvas');
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        // draw the video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        // return the canvas image as a blob
        // resolve(ctx?.canvas.toBlob('image/jpeg'));
        ctx?.canvas.toBlob(blob => {
          resolve(blob);
        }, 'image/jpeg');
      });
    });
  });
};

export const generateFrames = async (file: File | string, frames?: number) => {
  const framesArr = new Array(frames).fill(0);

  let url = '';
  if (typeof file === 'string') {
    url = await getResolvedAssetUrl(file);
  }
  const duration = await getDuration(url || file);
  const noOfFrames = duration / (frames || 5);

  const unresolved = framesArr.map(async (_, idx) => {
    const value = await getVideoCover(file, noOfFrames * (idx + 1));
    if (value) {
      return new File([value], 'name');
    }
  });
  const ipfsArray: string[] = [];
  for await (const resolved of unresolved) {
    if (resolved) {
      const ipfsToken = await uploadToIpfs(fileObjectForIPFS(resolved));
      ipfsArray.push(getIpfsUrl(ipfsToken.cid.toString()));
    }
  }
  const imageArray = await Promise.all(ipfsArray);
  return imageArray;
};

const getGifImage = async (file: File | string) => {
  let blob: Blob;
  let arrayBuffer: ArrayBuffer;
  if (typeof file === 'string') {
    const response = await axios.get(file, { responseType: 'blob' });
    blob = response.data;
    arrayBuffer = await blob.arrayBuffer();
  } else {
    arrayBuffer = await file.arrayBuffer();
  }
  const intArray = new Uint8Array(arrayBuffer);
  const reader = new GifReader(intArray);
  const info = reader.frameInfo(0);

  const image = new ImageData(info.width, info.height);
  reader.decodeAndBlitFrameRGBA(0, image.data);
  const value = await ImageDataToBlob(image);
  if (value) {
    return new File([value], 'name');
  }
};

const ImageDataToBlob = (imageData: ImageData): Promise<Blob | null> => {
  const width = imageData.width;
  const height = imageData.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx?.putImageData(imageData, 0, 0);
  return new Promise(resolve => {
    canvas.toBlob(resolve);
  });
};

export const getGifFrame = async (file: File | string) => {
  const gifFrame = await getGifImage(file);
  if (gifFrame) {
    const gifIpfs = await uploadToIpfs(fileObjectForIPFS(gifFrame));
    return getIpfsUrl(gifIpfs.cid.toString());
  }
};
