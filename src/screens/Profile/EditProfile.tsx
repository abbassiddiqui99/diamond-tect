import * as React from 'react';
import { useRecoilState } from 'recoil';
import { MdModeEdit } from 'react-icons/md';
import { useMutation } from '@apollo/client';
import { BsFillPersonFill, BsCheckCircle } from 'react-icons/bs';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { authUser } from 'src/providers';
import Button from 'src/components/Button';
import Heading from 'src/components/Heading';
import { UPDATE_USER } from 'src/graphql/mutation';
import { useUserActions } from 'src/providers/user';
import FormInput from 'src/components/InputField/FormInput';
import { SOCIAL_MEDIA } from 'src/constant/commonConstants';
import { editProfileFields } from 'src/constant/AuthConstants';
import { createLoadingToast, updateToast } from 'src/utils/Toast';

interface IFormInput {
  name: string;
  facebook: string;
  twitter: string;
  website: string;
  socialKyc: string;
}
const EditProfile: React.FC = () => {
  const [updateUserMutation, { loading }] = useMutation(UPDATE_USER);
  const userActions = useUserActions();
  const [auth, setAuth] = useRecoilState(authUser);
  const user = auth?.user;
  const [avatar, setAvatar] = React.useState(user?.avatar);
  const [imageFile, setImageFile] = React.useState<File | null>();
  const getSocialLink = (type: SOCIAL_MEDIA) => {
    const socialLink = user?.socialMedia?.find(item => item.type === type);
    return socialLink?.link || '';
  };

  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      name: user?.name || '',
      facebook: getSocialLink(SOCIAL_MEDIA.FACEBOOK),
      twitter: getSocialLink(SOCIAL_MEDIA.TWITTER),
      website: getSocialLink(SOCIAL_MEDIA.WEBSITE),
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async value => {
    const payload = {
      name: value.name,
      socialMedia: [
        {
          link: value.facebook || '',
          type: SOCIAL_MEDIA.FACEBOOK,
        },
        {
          link: value.twitter || '',
          type: SOCIAL_MEDIA.TWITTER,
        },
        {
          link: value.website || '',
          type: SOCIAL_MEDIA.WEBSITE,
        },
      ],
    };
    const toastId = createLoadingToast();
    try {
      let imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        imageUrl = await userActions.uploadImage(formData);
      }

      const { data } = await updateUserMutation({
        variables: {
          updateUserData: {
            ...payload,
            avatar: imageUrl?.data?.imageUrl || avatar || '',
          },
        },
      });
      setAuth(currentValue => {
        if (!currentValue) return null;
        const user = currentValue.user && {
          ...currentValue.user,
          name: data?.updateUser?.name,
          avatar: data?.updateUser?.avatar || '',
          socialMedia: data?.updateUser.socialMedia || [],
        };
        return {
          ...currentValue,
          user,
        };
      });
      updateToast({ id: toastId, message: 'Profile Updated Successfully', type: 'success' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      updateToast({ id: toastId, message: error?.message });
    }
  };

  const onImageChangeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(URL.createObjectURL(event.target.files[0]));
      setImageFile(event.target.files[0]);
    }
  };

  return (
    <>
      {/* Change Image */}
      <div className='flex-col flex-center'>
        <div className='p-4 border border-gray-300 rounded-full w-36 h-36 hover:opacity-80'>
          <label className='cursor-pointer'>
            {avatar ? (
              <img className='object-cover w-full h-full rounded-full' src={avatar} alt='Profile image' />
            ) : (
              <BsFillPersonFill size='100%' color='gray' className='mt-1.5' />
            )}
            <div className='relative z-10 w-12 h-12 p-3 bg-blue-400 rounded-full bottom-12 left-20'>
              <MdModeEdit size='100%' color='white' />
            </div>
            <input name={'profile'} onChange={onImageChangeUpload} type='file' hidden accept='.png,.jpg,.jpeg' />
          </label>
        </div>
      </div>

      {/* Change Fields */}
      <div className='max-w-2xl mx-auto'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {editProfileFields?.map(item => (
            <React.Fragment key={item.name}>
              <Heading text={item.title} type='subheading' className='mb-0 text-center sm:text-left' />
              <Controller
                name={item.name as keyof IFormInput}
                control={control}
                rules={item.rules}
                render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                  <FormInput
                    type='text'
                    placeholder={item.placeholder}
                    name={name}
                    value={name === 'twitter' && user?.socialKyc?.twitter_handle ? `twitter.com/${user?.socialKyc?.twitter_handle}` : value}
                    onChange={onChange}
                    error={error?.message}
                    disabled={loading}
                    icon={
                      (name === 'twitter' || name === 'socialKyc') && user?.socialKyc?.verified ? (
                        <BsCheckCircle fontSize={24} color={'green'} />
                      ) : null
                    }
                  />
                )}
              />
            </React.Fragment>
          ))}
          <Button btnText='Save' type='submit' bold disabled={loading} loading={loading} full />
        </form>
      </div>
    </>
  );
};

export default EditProfile;
