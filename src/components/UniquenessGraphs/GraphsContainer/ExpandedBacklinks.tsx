import * as React from 'react';
import { BiCopy } from 'react-icons/bi';
import DataTable from 'react-data-table-component';

import Tooltip from 'src/components/Tooltip';
import { UniquenessType } from 'src/types/graphs';
import { copyToClipboard } from 'src/utils/helpers';

const ExpandedBacklinks: React.FC<{ data: UniquenessType }> = ({ data }) => {
  const [copiedIndex, setCopiedIndex] = React.useState(-1);

  if (data) {
    return (
      <DataTable
        noHeader
        pagination
        noTableHead
        data={data[1].links}
        columns={[
          {
            cell: (row, index) => (
              <div className='w-full gap-5 px-5 flex-between'>
                <a href={row} target='_blank' rel='noreferrer' className='text-xs text-secondary-blue hover:underline'>
                  {row}
                </a>
                <Tooltip
                  position='left'
                  icon={
                    <BiCopy
                      onClick={() => {
                        copyToClipboard(row);
                        setCopiedIndex(index);
                      }}
                      className='cursor-pointer'
                    />
                  }
                  text={copiedIndex === index ? 'Copied' : 'Copy to Clipboard.'}
                />
              </div>
            ),
          },
        ]}
        paginationComponentOptions={{ noRowsPerPage: true }}
      />
    );
  } else {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
};

export default ExpandedBacklinks;
