import * as React from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { useMutation } from '@apollo/client';

import Button from 'src/components/Button';
import Select from 'src/components/Select';
import { showToast } from 'src/utils/Toast';
import { errorHandler } from 'src/utils/helpers';
import PopupModal from 'src/components/PopupModal';
import LoadingText from 'src/components/LoadingText';
import { UPDATE_RIGHTS } from 'src/graphql/mint.graphql';
import { RIGHTS_LIST, LOADING_RIGHTS_ARRAY, AssignedRights } from 'src/constant/commonConstants';

interface IEditRights {
  id: string;
  ipfsToken: string;
  disabled?: boolean;
  rights: AssignedRights;
  onSuccess: (rights: string[]) => void;
}

const EditRights: React.FC<IEditRights> = ({ id, ipfsToken, disabled, rights, onSuccess }) => {
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [newRights, setNewRights] = React.useState(rights);

  const [updateRightsMutation] = useMutation(UPDATE_RIGHTS);

  const updateRights = async () => {
    try {
      if (id && ipfsToken) {
        setLoading(true);
        const res = await updateRightsMutation({
          variables: {
            updateRightsInput: {
              mintId: id,
              rights: [`${newRights}`, `${ipfsToken}`],
            },
          },
        });
        const updatedRights = res?.data?.updateTokenRights?.ipfsMetaData?.rights;
        onSuccess(updatedRights);
        showToast({
          message: 'Rights Updated Successfully',
          type: 'success',
        });
        setShow(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        btnText='Edit Rights'
        textSize='sm'
        preAppendIcon
        icon={<FiEdit3 />}
        disabled={disabled}
        className='my-0 rounded-lg'
        onClick={() => setShow(true)}
      />
      <PopupModal show={show} title='Edit Rights' closeBtn={!loading} persistent={loading} onClose={() => setShow(false)} noOverflow>
        <div className='mt-3'>
          <Select
            options={RIGHTS_LIST}
            value={RIGHTS_LIST[newRights]}
            onChange={val => setNewRights(RIGHTS_LIST.findIndex(item => item === val))}
            disabled={loading}
          />
        </div>
        <div className='my-2 flex-center'>
          <Button className='w-1/2' btnText='Save' loading={loading} disabled={loading || rights == newRights} onClick={updateRights} />
        </div>
        {loading ? <LoadingText textArray={LOADING_RIGHTS_ARRAY} /> : null}
      </PopupModal>
    </>
  );
};

export default EditRights;
