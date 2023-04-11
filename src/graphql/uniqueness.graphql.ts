import { gql } from '@apollo/client';
import { Features } from 'src/constant/features';

export const GET_ONDEMAND_UNIQUENESS_SCORE = gql`
  query ${Features.ON_DEMAND_CHECKS}($assetId: String!, $assetUrl: String!) {
    onDemandUniquenessCheck(assetId: $assetId, assetUrl: $assetUrl) {
      assetId
      avgNFTPortScore
      avgTinEyeScore
      createdAt
      deleted
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
      updatedAt
      userId
    }
  }
`;

export const GET_EXISTING_ONDEMAND_SCORE = gql`
  query GetExistingOnDemandAssetScore($assetId: String!) {
    existingOnDemandAssetScore(assetId: $assetId) {
      assetId
      avgNFTPortScore
      avgTinEyeScore
      createdAt
      deleted
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
      updatedAt
      userId
    }
  }
`;
