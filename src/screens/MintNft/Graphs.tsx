import * as React from 'react';

import Button from 'src/components/Button';
import Summary from 'src/components/UniquenessGraphs/Summary';
import { NftHistogramRange } from 'src/constant/commonConstants';
import GraphsContainer from 'src/components/UniquenessGraphs/GraphsContainer';
import { IChainTable, NftHistogramType, Uniqueness, UniquenessType } from 'src/types/graphs';
import { generateDomainDetails, generateNftScoreRange, generatetNftTableDetails } from 'src/services/UniquenessService';

interface GraphsType {
  data: Uniqueness;
}

const Graphs: React.FC<GraphsType> = ({ data }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [chainDetails, setChainDetails] = React.useState<IChainTable[]>();
  const [domainDetails, setDomainDetails] = React.useState<UniquenessType[]>();
  const [nftScoreDetails, setNftScoreDetails] = React.useState<NftHistogramType>(NftHistogramRange);

  React.useEffect(() => {
    if (data) {
      setDomainDetails(generateDomainDetails(data));
      setNftScoreDetails(generateNftScoreRange(data));
      setChainDetails(generatetNftTableDetails(data));
    }
  }, [data]);

  return (
    <>
      <div className='my-10 text-center'>
        <Summary
          tinEyeAvg={data.avgTinEyeScore}
          tinEyeTotal={data.tinEyeMatches.length}
          NftPortAvg={data.avgNFTPortScore}
          NftPortTotal={data.nftPortMatches.length}
        />
        {data.avgTinEyeScore > 0 || data.avgNFTPortScore > 0 ? (
          <Button
            btnText={showDetails ? 'Hide Details' : 'Show Details'}
            onClick={() => setShowDetails(!showDetails)}
            className='rounded'
          />
        ) : null}
      </div>

      {showDetails && domainDetails && nftScoreDetails ? (
        <GraphsContainer data={data} domainDetails={domainDetails} nftScoreDetails={nftScoreDetails} chainTable={chainDetails} />
      ) : null}
    </>
  );
};

export default Graphs;
