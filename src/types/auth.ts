export interface IFormInput {
  email: string;
  password: string;
}

export enum RESEND_EMAIL_TYPE {
  Enable = 'Enable',
  Login2FA = 'Login2FA',
  VerifyEmail = 'VerifyEmail',
  ResetPassword = 'ResetPassword',
}
