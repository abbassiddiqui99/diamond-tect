import { gql } from '@apollo/client';
import { Features } from 'src/constant/features';

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserData: UpdateUserInput!) {
    updateUser(updateUserData: $updateUserData) {
      name
      avatar
      socialMedia {
        link
        type
      }
      profileSetting {
        status
        type
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($changePasswordData: ChangePasswordInput!) {
    changePassword(changePasswordData: $changePasswordData) {
      name
    }
  }
`;

export const UPDATE_NOTIFICATION_STATUS = gql`
  mutation UpdateNotificationStatus($input: [UpdateNotificationInput!]!) {
    updateNotificationStatus(input: $input) {
      message
    }
  }
`;

export const PROTECT_NFT = gql`
  mutation ${Features.PROTECT_NFT}($payload: ProtectNFTsInput!) {
    protectNft(payload: $payload) {
      id
    }
  }
`;

export const REQUEST_PROTECT_NFT = gql`
  mutation RequestProtectNFT {
    requestProtectNFT
  }
`;

export const TRIGGER_LOSS_PREVENTION = gql`
  mutation TriggerLossPrevention($protectedNftId: String!) {
    triggerLossPrevention(protectedNftId: $protectedNftId)
  }
`;

export const SUBSCRIPTION_NOTIFICATION_BADGE = gql`
  subscription Subscription($userId: String!) {
    notificationBadge(userId: $userId) {
      id
      message
      receiver {
        _id
        name
        username
        email
      }
      sender {
        _id
        email
        username
        name
      }
    }
  }
`;
export const UPDATE_PROTECTION_TIMER = gql`
  mutation UpdateProtecionDays($days: Float!) {
    updateProtectionDays(days: $days) {
      email
    }
  }
`;

export const RESET_PROTECTION_TIMER = gql`
  mutation ResetProtecionTimer {
    resetProtectionTimer
  }
`;
