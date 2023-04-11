import axios from 'axios';
import dayjs from 'dayjs';

import configEnv from 'src/config.env';
import { showToast } from 'src/utils/Toast';
import { Creator, IUser, tokenHistory } from 'src/types';
import { ACCEPTED_FILE_TYPES } from 'src/constant/DropzoneConstants';
import { ASSET_TYPE, BROWSERS, MINT_TYPE, UNIQUENESS_ACCEPTED_TYPES } from 'src/constant/commonConstants';
import { BURN_ADDRESS, CHAIN_LIST_TYPE, MINT_ADDRESS, OneNetworkName } from 'src/constant/WalletConstants';

export const getBrowserName = () => {
  const sUsrAg = navigator.userAgent;
  let browser = BROWSERS.Chrome;

  if (sUsrAg.indexOf('Firefox') > -1) {
    browser = BROWSERS.Firefox;
  } else if (sUsrAg.indexOf('SamsungBrowser') > -1) {
    browser = BROWSERS.Samsung;
  } else if (sUsrAg.indexOf('Opera') > -1 || sUsrAg.indexOf('OPR') > -1) {
    browser = BROWSERS.Opera;
  } else if (sUsrAg.indexOf('Trident') > -1) {
    browser = BROWSERS.Explorer;
  } else if (sUsrAg.indexOf('Edge') > -1) {
    browser = BROWSERS.Edge;
  } else if (sUsrAg.indexOf('Chrome') > -1) {
    browser = BROWSERS.Chrome;
  } else if (sUsrAg.indexOf('Safari') > -1) {
    browser = BROWSERS.Safari;
  } else {
    browser = BROWSERS.Unknown;
  }

  return browser;
};

export const getFileSizeinMB = (size: number) => {
  return `${(size * 1e-6).toFixed(2)} MB`;
};

export const convertToHex = (chainId: number): OneNetworkName => {
  return `0x${Number(chainId).toString(16)}` as OneNetworkName;
};

export const formatDate = (date: Date | string) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatDateTime = (date: Date | string) => {
  const _date = dayjs(date).format('MMMM DD, YYYY');
  const _time = dayjs(date).format('hh:mm A');
  return `${_date} at ${_time}`;
};

export const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;

export const roundToNearestMultipleOfFive = (val: number) => {
  return 5 * Math.round(val / 5);
};

const donutGraphColors = {
  red: ['#EC7063', '#E74C3C', '#C0392B'],
  green: ['#229954', '#16A085', '#2ECC71'],
  yellow: ['#F5B041', '#F39C12', '#d4ac0d'],
};

export const generateColorForDonutGraph = (score: number) => {
  // GREEN
  if (score <= 10) {
    return donutGraphColors.green[0];
  } else if (score <= 15) {
    return donutGraphColors.green[1];
  } else if (score <= 20) {
    return donutGraphColors.green[2];
  }
  // YELLOW
  else if (score <= 30) {
    return donutGraphColors.yellow[0];
  } else if (score <= 40) {
    return donutGraphColors.yellow[1];
  } else if (score <= 50) {
    return donutGraphColors.yellow[2];
  }
  // RED
  else if (score <= 60) {
    return donutGraphColors.red[0];
  } else if (score <= 80) {
    return donutGraphColors.red[1];
  }
  return donutGraphColors.red[2];
};

export const getAverage = (value: number, count: number) => {
  return parseFloat((value / count).toFixed(2));
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const getIpfsUrl = (token: string) => {
  return `${configEnv.IPFS_URL_CONTACT}${token}`;
};

export const getAssetType = (asset: File) => {
  if (asset.type === 'image/gif') {
    return ASSET_TYPE.GIF;
  }
  if (ACCEPTED_FILE_TYPES.Video.includes(asset.type)) {
    return ASSET_TYPE.VIDEO;
  }
  if (ACCEPTED_FILE_TYPES.Photography.includes(asset.type)) {
    return ASSET_TYPE.IMAGE;
  }
};
export const getAssetTypeFromUrl = async (url: string) => {
  try {
    const response = await axios.get(url);
    const headers = response.headers['content-type'];

    if (headers === 'image/gif') {
      return ASSET_TYPE.GIF;
    }
    return ASSET_TYPE[headers.split('/')?.[0].toUpperCase() as ASSET_TYPE];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err?.message);
  }
};

export const uniquenessAccepted = (asset: File) => {
  return UNIQUENESS_ACCEPTED_TYPES.includes(asset.type);
};

export const getHistoryFields = (tokenHistory: tokenHistory) => {
  const history = {
    transaction_address: tokenHistory.transaction_hash,
    trigger_by: tokenHistory.to_address,
    action: 'minted by',
  };
  if (tokenHistory.from_address !== MINT_ADDRESS && tokenHistory.from_address) {
    history.trigger_by = tokenHistory.from_address;
    history.action = `transferred by`;
    if (tokenHistory.to_address === BURN_ADDRESS) {
      history.action = `burned by`;
    } else if (tokenHistory.from_address === tokenHistory.to_address) {
      history.action = `remint by`;
    }
  }
  return history;
};

export const getUrlContentType = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.headers['content-type'].split('/')?.[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err?.message);
  }
};

export const validIpfsURL = (url: string) => {
  const URL_TOKEN = /^ipfs:\/\/ipfs\/?/;
  const substringURL = url.replace(URL_TOKEN, '');
  if (substringURL.length !== url.length) {
    return `${configEnv.IPFS_URL_CONTACT}${substringURL}`;
  }
  return url;
};

export const validTokenOpenSeaURL = (tokenID: string, contractAddress: string, chain: string) => {
  return `${configEnv.OPENSEA_URL}/${chain === CHAIN_LIST_TYPE['polygon'] ? 'matic' : ''}/${contractAddress}/${tokenID}`;
};

export const addMetaTags = (image: string, name: string, description: string) => {
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', image);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', name);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
};

export const fileObjectForIPFS = (file: File) => {
  return {
    path: file.name,
    content: file,
  };
};

export const isCurrentOwner = (creator?: Creator, owner?: Creator, user?: IUser) => {
  return (owner?.walletAddress || creator?.walletAddress) === user?.walletAddress;
};

export const getNFTTypesBasedURL = (type: MINT_TYPE, mintedHashId?: string) => {
  if (type === MINT_TYPE.MINT || type === MINT_TYPE.RE_MINT) {
    return `/hd-contract/${mintedHashId}`;
  }
  return `/gasless/${mintedHashId}`;
};

export const errorHandler = (
  error: {
    response: { data: { status: number }; status: number };
    graphQLErrors: { extensions: { response: { status: number }; exception: { response: { status: number } } } }[];
    message: string;
  },
  showDefaultToast = true,
) => {
  if (
    error?.response?.data?.status === 401 ||
    error?.response?.status === 401 ||
    error?.graphQLErrors?.[0]?.extensions?.response?.status === 401 ||
    error?.graphQLErrors?.[0]?.extensions?.exception?.response?.status === 401 ||
    error?.message === '401'
  ) {
    return false;
  }

  if (
    error?.response?.data?.status === 403 ||
    error?.response?.status === 403 ||
    error?.graphQLErrors?.[0]?.extensions?.response?.status === 403 ||
    error?.graphQLErrors?.[0].extensions?.exception?.response?.status === 403 ||
    error?.message === '403'
  ) {
    return false;
  }

  if (showDefaultToast) showToast({ message: error?.message, type: 'error' });
  return true;
};

export const openUrlInNewTab = (url = '') => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};
