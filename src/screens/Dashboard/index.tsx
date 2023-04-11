import * as React from 'react';

import Mint from 'src/screens/Mint';
import ArrowUp from 'src/components/ArrowUp';
import MintedNFTs from 'src/screens/Dashboard/MintedNFTs';

const Dashboard: React.FC = () => {
  const [scrollable, setScrollable] = React.useState(false);

  React.useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 450) {
        setScrollable(true);
      } else if (scrolled <= 450) {
        setScrollable(false);
      }
    };
    window.addEventListener('scroll', toggleVisible);
  }, []);

  return (
    <>
      {scrollable ? <ArrowUp /> : null}

      <Mint />
      <MintedNFTs />
    </>
  );
};

export default Dashboard;
