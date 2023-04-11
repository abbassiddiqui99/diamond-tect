import { gql } from '@apollo/client';

export const GET_USER_QUERY = gql`
  query GetUser {
    getUser {
      name
      walletAddress
      profileSetting {
        status
        type
      }
      socialKyc {
        verified
        signature
        twitter_handle
      }
      activePlan {
        name
        price
        currency
        type
      }
      upcomingPlan {
        name
        price
        currency
        type
      }
      protectionTimer
      protectionDays
    }
  }
`;

export const GET_WALLET_NFT = gql`
  query GetWalletNFT($chain: String!, $walletAddress: String!) {
    getWalletNFTs(chain: $chain, walletAddress: $walletAddress) {
      token_address
      ipfsToken
      token_id
      metadata {
        name
        animation_url
        description
        image
        name
        rights
      }
    }
  }
`;

export const TRANSACTION_HISTORY = gql`
  query GetTransactionHistory($assetId: String!) {
    getTransactionHistory(assetId: $assetId) {
      asset
      contractAddress
      fromAddress
      id
      toAddress
      transactionHash
      type
      user
      createdAt
    }
  }
`;

export const GET_USER_NFT_QUERY = gql`
  query GetUserNft {
    getUser {
      nfts {
        ipfsToken
        id
        contractAddress
        tokenId
        hashId
        isProtected
        ipfsMetaData {
          name
          rights
          image
          animation_url
        }
        type
        score {
          avgNFTPortScore
          avgTinEyeScore
          totalNFTPortResults
          totalTinEyeResults
        }
      }
    }
  }
`;

export const VERIFY_TWEET_QUERY = gql`
  query VerifyTweet($kycData: KycData!) {
    verifyTweet(kycData: $kycData) {
      _id
      socialKyc {
        signature
        twitter_handle
        verified
      }
    }
  }
`;

export const DISCONNECT_TWITTER_QUERY = gql`
  query DisconnectTwitter {
    disconnectTwitter {
      _id
      socialKyc {
        signature
        twitter_handle
        verified
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($offset: Int, $limit: Int) {
    getNotifications(offset: $offset, limit: $limit) {
      id
      status
      sender {
        avatar
      }
      type
      createdAt
      message
    }
    getNotificationsAggregate {
      total
    }
  }
`;

export const GET_PROTECTED_NFTS = gql`
  query GetProtectedNFTs($offset: Int, $limit: Int) {
    getProtectedNfts(limit: $limit, offset: $offset) {
      id
      itemId
      asset {
        chain
        contractAddress
        hashId
        tokenId
      }
      successorAdress
      type
    }
    getProtectedNftsAggregate {
      total
    }
  }
`;
