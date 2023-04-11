import * as React from 'react';
import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';

import Button from 'src/components/Button';
import { NFTDetails } from 'src/types';
import { errorHandler } from 'src/utils/helpers';
import PopupModal from 'src/components/PopupModal';
import { UPDATE_SCORE_ID } from 'src/graphql/mint.graphql';
import { checkUniqueness } from 'src/services/http/restApi';

interface IUniquenessCheck {
  imgUrl: string;
  assetId: string;
  refetch: (variables?: Partial<OperationVariables>) => Promise<
    ApolloQueryResult<{
      getMint: NFTDetails;
    }>
  >;
}

const UniquenessCheck: React.FC<IUniquenessCheck> = ({ imgUrl, assetId, refetch }) => {
  const [loader, setLoader] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const [updateScoreId] = useMutation(UPDATE_SCORE_ID, {
    onCompleted: () => {
      refetch();
    },
  });

  const uniquenessCheck = async () => {
    try {
      setLoader(true);
      const res = await checkUniqueness([imgUrl]);
      updateScoreId({
        variables: {
          assetId,
          scoreId: res?.data?.id,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setShowModal(false);
      setLoader(false);
    }
  };

  return (
    <>
      <div className='gap-4 flex-between'>
        <Button btnText='Uniqueness Check' onClick={() => setShowModal(true)} className='w-full !text-sm sm:w-auto' />
      </div>
      <PopupModal
        show={showModal}
        title='Uniqueness Check'
        text='Click confirm to run the uniqueness check'
        onClose={() => setShowModal(false)}
        closeBtn={!loader}
        persistent
      >
        <div className='gap-4 flex-between'>
          <Button btnText='Cancel' full disabled={loader} onClick={() => setShowModal(false)} />
          <Button btnText='Confirm' full gradient disabled={loader} loading={loader} onClick={uniquenessCheck} />
        </div>
      </PopupModal>
    </>
  );
};

export default UniquenessCheck;
