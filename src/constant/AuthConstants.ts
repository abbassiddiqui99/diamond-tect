import { UseFormGetValues } from 'react-hook-form';
import { ResetPasswordData, SignUpData } from 'src/types';
import { ROUTES } from 'src/constant/NavigationConstant';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const socials = ['Facebook', 'Twitter', 'Website'];

export const checkRedirectUrl = (url: string) => {
  const arr = url.split('/');

  if (arr[1] && !arr[2]) {
    for (const [_, value] of Object.entries(ROUTES)) {
      if (`/${arr[1]}` == value) {
        // for single route eg: /paymentUpdate
        return false;
      }
    }
  }

  return true;
};

export const emailField = {
  name: 'email',
  title: 'Email',
  placeholder: 'Email Address',
  rules: {
    required: 'Email is Required',
    pattern: { value: emailRegex, message: 'Invalid Email Address' },
  },
};

const passwordField = {
  name: 'password',
  title: 'Password',
  placeholder: 'Password',
  rules: {
    required: 'Password is required',
  },
};

const oldpasswordField = {
  name: 'oldPassword',
  title: 'Old Password',
  placeholder: 'Old Password',
  rules: {
    required: 'Old Password is required',
  },
};
const newPasswordField = {
  name: 'password',
  title: 'New Password',
  placeholder: 'New Password',
  rules: {
    required: 'This field is required',
    pattern: {
      value: passwordRegex,
      message:
        'Password length must be at least 8 characters long and it must contain at-least one lowercase, uppercase, number and symbol.',
    },
  },
};

const nameField = {
  name: 'name',
  title: 'Full Name',
  placeholder: 'Full Name',
  rules: {
    required: 'This field is required',
    minLength: { value: 4, message: 'Full Name should be atleast 4 character long' },
  },
};

const usernameField = {
  name: 'username',
  title: 'Username',
  placeholder: 'Username',
  rules: {
    required: 'This field is required',
    minLength: { value: 3, message: 'Username should be atleast 3 character long' },
  },
};

const registerPasswordField = {
  name: 'password',
  title: 'Password',
  placeholder: 'Password',
  rules: {
    required: 'This field is required',
    pattern: {
      value: passwordRegex,
      message:
        'Password length must be at least 8 characters long and it must contain at-least one lowercase, uppercase, number and symbol.',
    },
  },
};

const socialFields = socials.map(item => ({
  name: item.toLowerCase(),
  title: item,
  placeholder: `${item} url (optional)`,
  rules: {}, // Todo: add rules to only accept URL
}));

const confirmPasswordField = (getValues: UseFormGetValues<SignUpData | ResetPasswordData>) => ({
  name: 'confirmPassword',
  title: 'Confirm Password',
  placeholder: 'Confirm Password',
  rules: {
    required: 'This field is required',
    validate: {
      matchPassword: (value?: string) => value === getValues().password || 'Passwords do not match',
    },
  },
});

const confirmNewPasswordField = (getValues: UseFormGetValues<SignUpData | ResetPasswordData>) => ({
  name: 'confirmPassword',
  title: 'Confirm New Password',
  placeholder: 'Confirm New Password',
  rules: {
    required: 'This field is required',
    validate: {
      matchPassword: (value?: string) => value === getValues().password || 'Passwords do not match',
    },
  },
});

export const loginFields = [emailField, passwordField];
export const editProfileFields = [nameField, ...socialFields];
export const resetPasswordFields = [registerPasswordField, confirmPasswordField];
export const changePasswordFields = [oldpasswordField, newPasswordField, confirmNewPasswordField];
export const registerFields = [nameField, usernameField, emailField, registerPasswordField, confirmPasswordField];
