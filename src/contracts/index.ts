import configEnv from 'src/config.env';
import DevMintContract from './HDMint.dev.json';
import DemoMintContract from './HDMint.demo.json';
import { Environments } from 'src/constant/environments';

const MintContracts: any = {
  [Environments.DEVELOPMENT]: DevMintContract,
  [Environments.DEMO]: DemoMintContract,
  [Environments.LOCAL]: DevMintContract,
};

export const MintContract = MintContracts[configEnv.ENV || Environments.LOCAL];
