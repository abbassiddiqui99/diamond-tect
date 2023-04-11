import configEnv from 'src/config.env';
import pjson from '../../../package.json';
import { Environments } from 'src/constant/environments';

const Version: React.FC = () => {
  if (configEnv.ENV && [Environments.DEMO, Environments.DEVELOPMENT].includes(configEnv.ENV as Environments)) {
    return (
      <a target='_blank' rel='noreferrer' href={`${configEnv.VERSIONING_LINK}`}>
        <p className='w-full text-xs text-center text-slate-400'>Version {pjson.version}</p>
      </a>
    );
  }
  return null;
};

export default Version;
