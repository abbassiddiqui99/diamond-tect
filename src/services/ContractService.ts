import { ethers } from 'ethers';
import { showToast } from 'src/utils/Toast';

import configEnv from 'src/config.env';
import { MintContract } from 'src/contracts';
import { BURN_ADDRESS } from 'src/constant/WalletConstants';

export class ContractService {
  contractAddress: string;
  successionContractAddress: string;
  constructor() {
    this.contractAddress = configEnv.CONTRACT_ADDRESS;
    this.successionContractAddress = configEnv.SUCCESSION_CONTRACT_ADDRESS;
  }

  askContractToMintNft = async (ipfsURI: string, walletAddress: string) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(this.contractAddress, MintContract.abi, signer);

        const nftTxn = await connectedContract.safeMint(walletAddress, ipfsURI);

        await nftTxn.wait();
        return nftTxn.hash;
      } else {
        throw new Error("Couldn't find MetaMask");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err?.message);
    }
  };

  safeTransferAsset = async (addressTransferFrom: string, addressTransferTo: string, tokenId: string) => {
    try {
      if (addressTransferFrom === addressTransferTo) {
        throw new Error("Can't transfer to same wallet address");
      }
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(this.contractAddress, MintContract.abi, signer);
        const approve = await connectedContract.approve(this.contractAddress, Number(tokenId));
        await approve.wait();

        const transferNFT = await connectedContract.transferFrom(addressTransferFrom, addressTransferTo, tokenId);
        await transferNFT.wait();

        return transferNFT.hash;
      } else {
        throw new Error("Couldn't find MetaMask");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err?.message);
    }
  };

  safeSetApprovalForAll = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(this.contractAddress, MintContract.abi, signer);
        const approve = await connectedContract.setApprovalForAll(this.successionContractAddress, true);
        await approve.wait();
      } else {
        throw new Error('Something went wrong at contract service');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err?.message);
    }
  };

  askToBurn = async (userTokenId: string) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(this.contractAddress, MintContract.abi, signer);

        const nftTxn = await connectedContract.transferFrom(await signer.getAddress(), BURN_ADDRESS, userTokenId);

        await nftTxn.wait();
      } else {
        showToast({ message: 'Cannot find MetaMask extension', type: 'error' });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast({ message: 'Cannot find MetaMask extension', type: 'error' });
    }
  };
}
