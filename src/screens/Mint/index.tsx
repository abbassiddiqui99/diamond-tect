import { useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom';
import classnames from 'classnames/bind';

import Button from 'src/components/Button';
import { Card } from 'src/components/Card';
import Heading from 'src/components/Heading';
import { useAuthActions } from 'src/providers/auth';
import { authUser, walletAddress } from 'src/providers';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';
import { ReactComponent as MintIcon } from 'src/assets/svgs/mint-icon.svg';
import { ReactComponent as RemintIcon } from 'src/assets/svgs/remint-icon.svg';

const Mint = () => {
  const authActions = useAuthActions();

  const auth = useRecoilValue(authUser);
  const address = useRecoilValue(walletAddress);

  const ListCard = ({
    icon,
    title,
    text,
    link,
    subheading,
    disabledBtn,
  }: {
    icon: React.ReactNode;
    title: string;
    text: string;
    link: string;
    subheading?: string;
    disabledBtn?: boolean;
  }) => (
    <Card className='flex-col h-full flex-between'>
      {icon}
      <Heading type='heading' text={title} className='mt-10 text-center' />
      {subheading ? <i className='text-xs text-center'>{subheading}</i> : null}
      {address ? (
        <Link
          to={link}
          className={classnames({
            'pointer-events-none': disabledBtn,
          })}
        >
          <Button btnText={text} className='w-40 text-xs sm:text-sm' disabled={disabledBtn} />
        </Link>
      ) : (
        <Button btnText={auth ? 'Please Connect Wallet' : 'Login to connect wallet'} disabled className='w-auto text-xs sm:text-sm' />
      )}
    </Card>
  );

  return (
    <div className='container mx-auto'>
      <div className='grid grid-cols-12 gap-4 mt-10 mb-10 md:grid-cols-8 lg:grid-cols-10'>
        <div className='h-full col-span-10 col-start-2 md:col-span-4 md:col-start-1 lg:col-span-4 lg:col-start-2'>
          <ListCard icon={<MintIcon />} title='Mint a new NFT' text='Mint NFT' link={PROTECTED_ROUTES.MINT_NFT} />
        </div>
        <div className='h-full col-span-10 col-start-2 md:col-span-4 lg:col-span-4'>
          <ListCard
            icon={<RemintIcon />}
            title='Remint an existing NFT'
            subheading='Requires being the original owner of the NFT'
            text='Remint NFT'
            link={PROTECTED_ROUTES.LOAD_NFT}
            disabledBtn={authActions.isUserOnFreePlan}
          />
        </div>
      </div>
    </div>
  );
};

export default Mint;
