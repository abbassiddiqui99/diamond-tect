import TwoFA from 'src/screens/Profile/TwoFA';
import SocialKyc from 'src/screens/Profile/SocialKyc';
import UpdateTimer from 'src/screens/Profile/UpdateTimer';

const Settings: React.FC = () => (
  <div className='max-w-2xl mx-auto mt-10'>
    <TwoFA />
    <UpdateTimer />
    <SocialKyc />
  </div>
);

export default Settings;
