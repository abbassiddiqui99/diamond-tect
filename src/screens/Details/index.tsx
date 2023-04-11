import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { FiExternalLink } from 'react-icons/fi';

import Card from 'src/components/Card';
import configEnv from 'src/config.env';
import { authUser } from 'src/providers';
import Badge from 'src/components/Badge';
import config from 'src/config.env/index';
import Heading from 'src/components/Heading';
import Tooltip from 'src/components/Tooltip';
import Skeleton from 'src/components/Skeleton';
import DetailsTab from 'src/components/DetailsTab';
import UserAvatar from 'src/components/UserAvatar';
import { useAuthActions } from 'src/providers/auth';
import AssetViewer from 'src/components/AssetViewer';
import EditRights from 'src/screens/Details/EditRights';
import { etherscanFilter, NFTDetails } from 'src/types';
import AssetsActions from 'src/components/AssetsActions';
import OnDemandCheck from 'src/components/OnDemandCheck';
import { GET_NFT_DETAILS } from 'src/graphql/mint.graphql';
import UniquenessCheck from 'src/components/UniquenessCheck';
import UniquessnessScore from 'src/components/UniquenessScore';
import HistorySection from 'src/screens/Details/HistorySection';
import { getResolvedAssetUrl } from 'src/services/http/restApi';
import FormTextarea from 'src/components/InputField/FormTextarea';
import ShareButton from 'src/components/AssetsActions/ShareButton';
import TransferButton from 'src/components/AssetsActions/transferButton';
import GraphsContainer from 'src/components/UniquenessGraphs/GraphsContainer';
import { IChainTable, NftHistogramType, UniquenessType } from 'src/types/graphs';
import { formatAddress, addMetaTags, getAssetTypeFromUrl, isCurrentOwner } from 'src/utils/helpers';
import { generateDomainDetails, generateNftScoreRange, generatetNftTableDetails } from 'src/services/UniquenessService';
import { ASSET_TYPE, AssignedRights, MINT_TYPE, NftHistogramRange, RIGHTS_LIST } from 'src/constant/commonConstants';

const UserDetails: React.FC<{ avatar?: string; name: string; title: string }> = ({ avatar, name, title }) => (
  <div className='mb-10 flex-between'>
    <div className='flex items-center gap-4'>
      <UserAvatar source={avatar} />
      <div className='text-sm'>
        <p className=' text-slate-500'>{title}</p>
        <h5 className='font-bold'>{name}</h5>
      </div>
    </div>
  </div>
);

const Details: React.FC = () => {
  const authActions = useAuthActions();

  const [details, setDetails] = React.useState<NFTDetails>();
  const params = useParams();
  const [mintHash, setMintHash] = React.useState('');
  const [getDetails, { loading, data, refetch, error }] = useLazyQuery<{ getMint: NFTDetails }>(GET_NFT_DETAILS, {
    fetchPolicy: 'network-only',
  });
  const [assetType, setAssetType] = React.useState<ASSET_TYPE>();
  const [chainDetails, setChainDetails] = React.useState<IChainTable[]>();
  const [domainDetails, setDomainDetails] = React.useState<UniquenessType[]>();
  const [nftScoreDetails, setNftScoreDetails] = React.useState<NftHistogramType>(NftHistogramRange);
  const [openDisclosure, setOpenDisclosure] = React.useState(false);
  const auth = useRecoilValue(authUser);

  React.useEffect(() => {
    const fetchDetails = async () => {
      if (params.mintHash || (params.tokenId && params.contractAddress)) {
        setMintHash(params?.mintHash || '');
        getDetails({
          variables: { contractAddress: params.contractAddress, mintHash: params.mintHash, tokenId: params.tokenId },
        });
      }
    };

    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  React.useEffect(() => {
    const fetchDetails = async () => {
      const detail = data?.getMint;
      if (detail?.ipfsMetaData) {
        const type = await getAssetTypeFromUrl(detail.ipfsMetaData?.image);
        setAssetType(type);
        const resolvedImage = await getResolvedAssetUrl(detail.ipfsMetaData.image);
        addMetaTags(resolvedImage, detail.ipfsMetaData.name, detail.ipfsMetaData.description);
      }
      if (detail?.detailedScore) {
        if (detail.detailedScore?.tinEyeMatches) {
          setDomainDetails(generateDomainDetails(detail.detailedScore));
        }
        if (detail.detailedScore?.nftPortMatches) {
          setNftScoreDetails(generateNftScoreRange(detail.detailedScore));
          setChainDetails(generatetNftTableDetails(detail.detailedScore));
        }
      }
    };

    fetchDetails();
    setDetails(data?.getMint);
  }, [data?.getMint]);

  React.useEffect(() => {
    return () => addMetaTags('', 'Heera Digital', 'The Diamond Standard for Digital Asset Rights Management');
  }, []);

  const onUpdateRightsSuccess = (updatedRights: string[]) => {
    const temp: NFTDetails = JSON.parse(JSON.stringify(details));
    if (temp?.ipfsMetaData?.rights) {
      temp.ipfsMetaData.rights[0] = updatedRights[0];
      temp.ipfsMetaData.rights[1] = updatedRights[1];
      setDetails(temp);
    }
  };

  return (
    <div className='container mx-auto'>
      {loading ? (
        <Card className='mx-2 my-10'>
          <Skeleton type='Details' />
        </Card>
      ) : null}
      {!loading && details ? (
        <Card className='mx-2 my-10'>
          <div className='grid grid-cols-1 gap-6 pb-10 border-b-2 lg:grid-cols-2'>
            <div>
              <AssetViewer
                image={details.ipfsMetaData.image}
                animation_url={details.ipfsMetaData.animation_url}
                effect='blur'
                draggable={false}
              />
              <div className='gap-1 mt-6 flex-center'>
                <ShareButton ipfsMetaData={details.ipfsMetaData} />
                {isCurrentOwner(details.creator, details.owner, auth?.user) && details.type !== MINT_TYPE.LAZY_MINT ? (
                  <TransferButton asset={details} refetch={refetch} />
                ) : null}
              </div>
            </div>
            <div className='flex flex-col lg:ml-9'>
              <AssetsActions asset={details} mintHash={mintHash} />
              <div>
                <div className='break-all'>
                  <div className='mt-5 mb-10 text-3xl font-bold leading-normal sm:text-6xl word-break'>{details.ipfsMetaData.name}</div>
                  {details.ipfsMetaData?.description ? (
                    <div className='mb-10'>
                      <FormTextarea value={details.ipfsMetaData.description} className='!bg-white' disabled />
                    </div>
                  ) : null}
                  {details.owner?.name ? <UserDetails title='Owner' avatar={details?.owner.avatar} name={details?.owner.name} /> : null}
                  {details.creator?.name ? (
                    <UserDetails title='Creator' avatar={details?.creator.avatar} name={details?.creator.name} />
                  ) : null}
                </div>

                {details?.detailedScore ? <UniquessnessScore score={details.detailedScore} /> : null}

                {Array.isArray(details?.ipfsMetaData?.rights) && details?.ipfsMetaData.rights[0] ? (
                  <div className='my-5'>
                    <Heading type='subheading' text='Rights' />
                    {details?.ipfsMetaData?.rights[1] ? (
                      <div className='font-semibold flex-between'>
                        <div className='flex gap-3'>
                          <div>{RIGHTS_LIST[Number(details?.ipfsMetaData.rights[0])]}</div>
                          <a
                            href={`${config.BASE_URL}/rights/${details?.ipfsMetaData.rights[1]}`}
                            target='_blank'
                            rel='noreferrer'
                            className='font-normal underline'
                          >
                            <Tooltip icon={<FiExternalLink size={20} />} text='View Rights' />
                          </a>
                        </div>
                        {isCurrentOwner(details?.creator, details?.owner, auth?.user) ? (
                          <EditRights
                            id={details.id}
                            ipfsToken={details.ipfsToken}
                            rights={details.ipfsMetaData?.rights[0] as unknown as AssignedRights}
                            onSuccess={onUpdateRightsSuccess}
                            disabled={authActions.isUserOnFreePlan}
                          />
                        ) : null}
                      </div>
                    ) : (
                      <div className='flex-between'>
                        <div>{RIGHTS_LIST[Number(details?.ipfsMetaData.rights[0])]}</div>
                        {isCurrentOwner(details?.creator, details?.owner, auth?.user) ? (
                          <EditRights
                            id={details.id}
                            ipfsToken={details.ipfsToken}
                            rights={details.ipfsMetaData?.rights[0] as unknown as AssignedRights}
                            onSuccess={onUpdateRightsSuccess}
                            disabled={authActions.isUserOnFreePlan}
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                ) : null}

                {details.type === MINT_TYPE.MINT ? (
                  <div className='mb-5'>
                    <Heading type='subheading' text='Details' />
                    {details.contractAddress ? (
                      <div>
                        Contract Address:{' '}
                        <a
                          href={`${configEnv.ETHERSCAN_URL}/${etherscanFilter.ADDRESS}/${details.contractAddress}`}
                          className='transition hover:text-secondary-blue'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <strong>{formatAddress(details.contractAddress)}</strong>
                        </a>
                      </div>
                    ) : null}
                    {details?.tokenId ? (
                      <div>
                        Token ID:{' '}
                        <a
                          href={`${configEnv.ETHERSCAN_URL}/${etherscanFilter.BLOCK_TOKEN}/${configEnv.CONTRACT_ADDRESS}?a=${details.tokenId}`}
                          className='transition hover:text-secondary-blue'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <strong>{details.tokenId}</strong>
                        </a>
                      </div>
                    ) : null}
                    <div>
                      Token Standard: <strong>ERC-721</strong>
                    </div>
                  </div>
                ) : null}

                <HistorySection assetId={details?.id} />
              </div>
              <div className='flex justify-end'>
                {details.type === MINT_TYPE.LAZY_MINT ? <Badge text='Gasless Mint' /> : null}
                {details.type === MINT_TYPE.RE_MINT ? <Badge text='Remint' color='purple' /> : null}
              </div>
            </div>
          </div>

          {/* Graphs */}
          {domainDetails &&
          details.detailedScore &&
          (details.detailedScore?.avgNFTPortScore > 0 || details.detailedScore?.avgTinEyeScore > 0) &&
          auth ? (
            <DetailsTab
              className='pt-10'
              title='How unique is this digital asset?'
              openDisclosure={openDisclosure}
              setOpenDisclosure={setOpenDisclosure}
            >
              <GraphsContainer
                data={details.detailedScore}
                domainDetails={domainDetails}
                nftScoreDetails={nftScoreDetails}
                chainTable={chainDetails}
              />
            </DetailsTab>
          ) : null}
          {!details?.detailedScore && details?.creator?.username === auth?.user?.username && !authActions.isUserOnFreePlan ? (
            <UniquenessCheck
              refetch={refetch}
              imgUrl={details?.frames && details?.frames?.length ? details?.frames[0] : details?.ipfsMetaData?.image}
              assetId={details.id}
            />
          ) : null}
          {assetType === ASSET_TYPE.IMAGE &&
          details?.ipfsMetaData?.image &&
          !details?.ipfsMetaData?.animation_url &&
          details.detailedScore &&
          auth ? (
            <OnDemandCheck imgUrl={details.ipfsMetaData.image} assetId={details.id} setOpenDisclosure={setOpenDisclosure} />
          ) : null}
        </Card>
      ) : null}
      {!loading && !data && !details ? <div className='mt-1 text-center'>No NFT Found</div> : null}
      {error ? <div className='mt-1 text-sm text-center text-red-500'>{error?.message}</div> : null}
    </div>
  );
};

export default Details;
