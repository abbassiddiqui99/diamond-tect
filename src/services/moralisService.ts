import Moralis from 'moralis';
import configEnv from 'src/config.env';
import { CHAIN_LIST_TYPE } from 'src/constant/WalletConstants';

export const getNFT = async ({ chain, address }: { chain: string; address: string }) => {
  try {
    const options = {
      chain: chain as CHAIN_LIST_TYPE,
      address: address,
    };
    const NFTs = await Moralis.Web3API.account.getNFTs(options);
    if (NFTs?.result?.length) {
      return NFTs.result
        .filter(item => {
          const meta = JSON.parse(item.metadata || '{}');
          return meta.image && meta.name && meta.description;
        })
        .map(item => {
          const meta = JSON.parse(item.metadata || '{}');
          const tokenUri = item.token_uri?.split('/');
          return {
            ...item,
            ipfsToken: tokenUri ? tokenUri[tokenUri.length - 1] : '',
            metadata: meta,
          };
        });
    }
    return NFTs;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return err?.message;
  }
};

export const getHistory = async (tokenId: string) => {
  try {
    return await Moralis.Web3API.token.getWalletTokenIdTransfers({
      address: configEnv.CONTRACT_ADDRESS.toLowerCase(),
      token_id: tokenId,
      chain: 'rinkeby',
    });
  } catch (error) {
    throw new Error();
  }
};
