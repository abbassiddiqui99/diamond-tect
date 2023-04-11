import * as React from 'react';
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import { ApolloProvider } from '@apollo/client';
import 'react-toastify/dist/ReactToastify.css';
import { client } from 'src/graphql/ApolloClient';
import { MoralisProvider } from 'react-moralis';

import configEnv from 'src/config.env';
import MainRoutes from 'src/routes/MainRoutes';
import { Environments } from './constant/environments';
import { LOCAL_CONSTANT } from 'src/constant/LocalConstant';
import { toastCustomStyle } from './constant/commonConstants';

const appId = process.env.REACT_APP_MORALIS_APP_ID || '';
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL || '';
const entryPassword = process.env.REACT_APP_ENTRY_PASSWORD || '';

const App = () => {
  const [render, setRender] = React.useState(false);

  // Performing environment check
  React.useEffect(() => {
    const isAlreadyAuthenticated = localStorage.getItem(LOCAL_CONSTANT.IS_AUTH);
    if (configEnv.ENV && [Environments.DEMO, Environments.DEVELOPMENT].includes(configEnv.ENV as Environments) && !isAlreadyAuthenticated) {
      let tryCount = 1;
      let matched = false;
      let input = prompt('Enter password to view content', '');

      while (tryCount < 3 && !render) {
        if (!input) return;

        if (input?.toLowerCase() === entryPassword.toLocaleLowerCase()) {
          setRender(true);
          tryCount = 3;
          matched = true;
          break;
        }

        tryCount++;
        input = prompt('Access Denied - Password Incorrect, Please Try Again.', '');
      }

      if (tryCount >= 3 && !matched) {
        alert('Sorry! Multiple incorrect entries.');
        return;
      }
    } else {
      setRender(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!render) {
    return <div />;
  }

  return (
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <RecoilRoot>
        <ApolloProvider client={client}>
          <MainRoutes />
          <ToastContainer style={toastCustomStyle} />
        </ApolloProvider>
      </RecoilRoot>
    </MoralisProvider>
  );
};

export default App;
