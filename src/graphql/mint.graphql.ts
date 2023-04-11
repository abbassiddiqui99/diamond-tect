import { gql } from '@apollo/client';
import { Features } from 'src/constant/features';

export const GET_MINT_FEED = gql`
  query MintFeed($mintType: [MintType!], $offset: Int, $limit: Int) {
    mintFeed(mintType: $mintType, offset: $offset, limit: $limit) {
      id
      tokenId
      contractAddress
      hashId
      isProtected
      score {
        avgNFTPortScore
        avgTinEyeScore
        totalNFTPortResults
        totalTinEyeResults
      }
      type
      creator {
        avatar
        name
      }
      owner {
        avatar
        name
      }
      ipfsMetaData {
        name
        image
        rights
        animation_url
      }
    }
    mintFeedAggregate(mintType: $mintType) {
      count
    }
  }
`;

export const GET_NFT_DETAILS = gql`
  query GetMint($mintHash: String, $tokenId: String, $contractAddress: String) {
    getMint(mintHash: $mintHash, tokenId: $tokenId, contractAddress: $contractAddress) {
      id
      ipfsToken
      scoreId
      isProtected
      detailedScore {
        totalBacklinks
        avgNFTPortScore
        avgTinEyeScore
        totalNFTPortResults
        totalTinEyeResults
        tinEyeMatches {
          backlinks
          domain
          score
        }
        nftPortMatches {
          cachedFileUrl
          chain
          contractAddress
          fileUrl
          cachedFileUrl
          mintDate
          score
          tokenId
        }
      }
      frames
      type
      creator {
        username
        walletAddress
        name
        avatar
      }
      owner {
        walletAddress
        name
        avatar
      }
      ipfsMetaData {
        description
        image
        name
        rights
        animation_url
      }
      tokenId
      transactionHash
      contractAddress
    }
  }
`;

export const UPDATE_SCORE_ID = gql`
  mutation UpdateScoreId($assetId: String!, $scoreId: String!) {
    updateScoreId(assetId: $assetId, scoreId: $scoreId) {
      scoreId
      score {
        avgNFTPortScore
        avgTinEyeScore
        nftPortMatches {
          cachedFileUrl
          chain
          contractAddress
          fileUrl
          mintDate
          score
          tokenId
        }
        tinEyeMatches {
          backlinks
          domain
          score
        }
        totalBacklinks
        totalNFTPortResults
        totalTinEyeResults
      }
    }
  }
`;

export const MINT_NFT = gql`
  mutation ${Features.MINT}($mintNft: MintInput!) {
    initializeMint(mintNFT: $mintNft) {
      creator {
        name
      }
      frames
      id
      hashId
      tokenId
      type
      transactionHash
      assetType
      ipfsMetaData {
        name
        description
        image
      }
      ipfsToken
      status
    }
  }
`;

export const REMINT_NFT = gql`
  mutation ${Features.REMINT}(
    $ipfsMetaData: IPFSMetaDataInput!
    $ipfsToken: String!
    $assetType: AssetType
    $contractAdress: String!
    $tokenId: String!
    $scoreId: String!
  ) {
    initializeRemint(
      remintNFT: {
        ipfsMetaData: $ipfsMetaData
        ipfsToken: $ipfsToken
        assetType: $assetType
        contractAdress: $contractAdress
        tokenId: $tokenId
        scoreId: $scoreId
      }
    ) {
      id
      ipfsToken
      creator {
        avatar
      }
    }
  }
`;

export const UPDATE_RIGHTS = gql`
  mutation ${Features.EDIT_RIGHTS}($updateRightsInput: UpdateRightsInput!) {
    updateTokenRights(updateRightsInput: $updateRightsInput) {
      ipfsMetaData {
        rights
      }
    }
  }
`;

export const TRANSFER_ASSET = gql`
  mutation ${Features.TRANSFER_ASSET}($mintId: String!, $transferStatus: TransferAssetStatus!, $walletAddress: String!) {
    transferAssetOwner(mintId: $mintId, transferStatus: $transferStatus, walletAddress: $walletAddress) {
      creator {
        walletAddress
        _id
      }
      owner {
        walletAddress
        _id
      }
    }
  }
`;
