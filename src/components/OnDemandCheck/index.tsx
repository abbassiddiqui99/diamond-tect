import * as React from 'react';
import { useLazyQuery } from '@apollo/client';

import Button from 'src/components/Button';
import { errorHandler } from 'src/utils/helpers';
import PopupModal from 'src/components/PopupModal';
import { useAuthActions } from 'src/providers/auth';
import Summary from 'src/components/UniquenessGraphs/Summary';
import { NftHistogramRange } from 'src/constant/commonConstants';
import GraphsContainer from 'src/components/UniquenessGraphs/GraphsContainer';
import { IChainTable, NftHistogramType, Uniqueness, UniquenessType } from 'src/types/graphs';
import { generateDomainDetails, generateNftScoreRange, generatetNftTableDetails } from 'src/services/UniquenessService';
import { GET_EXISTING_ONDEMAND_SCORE, GET_ONDEMAND_UNIQUENESS_SCORE } from 'src/graphql/uniqueness.graphql';

interface IOnDemandCheck {
  imgUrl: string;
  assetId: string;
  setOpenDisclosure?: React.Dispatch<React.SetStateAction<boolean>>;
}

const OnDemandCheck: React.FC<IOnDemandCheck> = ({ imgUrl, assetId, setOpenDisclosure }) => {
  const authActions = useAuthActions();

  const [showModal, setShowModal] = React.useState(false);
  const [showGraphs, setShowGraphs] = React.useState(false);
  const [newDetails, setNewDetails] = React.useState<Uniqueness | null>(null);
  const [getExistingOnDemandScore, { loading, data }] = useLazyQuery(GET_EXISTING_ONDEMAND_SCORE);
  const [getOnDemandScore, { loading: onDemandCheckLoading, data: onDemandScore }] = useLazyQuery(GET_ONDEMAND_UNIQUENESS_SCORE, {
    notifyOnNetworkStatusChange: true,
  });

  const [chainDetails, setChainDetails] = React.useState<IChainTable[]>();
  const [domainDetails, setDomainDetails] = React.useState<UniquenessType[]>();
  const [nftScoreDetails, setNftScoreDetails] = React.useState<NftHistogramType>(NftHistogramRange);

  const onDemandCheck = async () => {
    try {
      await getOnDemandScore({
        variables: { assetId, assetUrl: imgUrl },
      });
      if (setOpenDisclosure) setOpenDisclosure(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setShowModal(false);
    }
  };

  React.useEffect(() => {
    getExistingOnDemandScore({
      variables: { assetId },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (data?.existingOnDemandAssetScore) {
      setNewDetails(data?.existingOnDemandAssetScore);
    }
  }, [loading, data]);

  React.useEffect(() => {
    if (onDemandScore?.onDemandUniquenessCheck) {
      setNewDetails(onDemandScore?.onDemandUniquenessCheck);
    }
  }, [onDemandCheckLoading, onDemandScore]);

  React.useEffect(() => {
    if (newDetails) {
      if (newDetails.tinEyeMatches) {
        setDomainDetails(generateDomainDetails(newDetails));
      }
      if (newDetails.nftPortMatches) {
        setNftScoreDetails(generateNftScoreRange(newDetails));
        setChainDetails(generatetNftTableDetails(newDetails));
      }
      // waiting for previous modal to fully close
      if (onDemandScore?.onDemandUniquenessCheck) {
        setTimeout(() => {
          setShowGraphs(true);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDetails]);

  return (
    <div>
      <div className='gap-4 flex-between'>
        <Button
          btnText='On-Demand Check'
          onClick={() => setShowModal(true)}
          className='w-full !text-sm sm:w-auto'
          disabled={authActions.isUserOnFreePlan}
        />
        {newDetails ? (
          <Button
            btnText='Show Results'
            disabled={authActions.isUserOnFreePlan}
            gradient
            onClick={() => setShowGraphs(true)}
            className='w-full sm:w-auto'
          />
        ) : null}
      </div>
      <PopupModal
        show={showModal}
        title='On Demand Uniqueness Check'
        text='Are you sure you want to check for uniqueness again?'
        onClose={() => setShowModal(false)}
        closeBtn={!onDemandCheckLoading}
        persistent
      >
        <div className='gap-4 flex-between'>
          <Button btnText='Cancel' full disabled={onDemandCheckLoading} onClick={() => setShowModal(false)} />
          <Button btnText='Confirm' full gradient disabled={onDemandCheckLoading} loading={onDemandCheckLoading} onClick={onDemandCheck} />
        </div>
      </PopupModal>
      {newDetails && domainDetails ? (
        <PopupModal show={showGraphs} title='On Demand Uniqueness Check' onClose={() => setShowGraphs(false)} large closeBtn persistent>
          {newDetails.totalTinEyeResults === 0 && newDetails.totalNFTPortResults === 0 ? (
            <div className='h-40 flex-center'>We found no similar asset across the web and on-chain</div>
          ) : null}
          {newDetails.totalTinEyeResults !== 0 && newDetails.totalNFTPortResults !== 0 ? (
            <div className='my-5 text-center'>
              <Summary
                tinEyeAvg={newDetails.avgTinEyeScore}
                tinEyeTotal={newDetails.tinEyeMatches?.length}
                NftPortAvg={newDetails.avgNFTPortScore}
                NftPortTotal={newDetails.nftPortMatches?.length}
              />
            </div>
          ) : null}
          <GraphsContainer data={newDetails} domainDetails={domainDetails} nftScoreDetails={nftScoreDetails} chainTable={chainDetails} />
        </PopupModal>
      ) : null}
    </div>
  );
};

export default OnDemandCheck;
