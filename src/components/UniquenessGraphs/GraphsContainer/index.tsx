import * as React from 'react';
import { BiCopy, BiImage } from 'react-icons/bi';
import { TableColumn } from 'react-data-table-component';

import Heading from 'src/components/Heading';
import Tooltip from 'src/components/Tooltip';
import Bar from 'src/components/UniquenessGraphs/Bar';
import Table from 'src/components/UniquenessGraphs/Table';
import Scatter from 'src/components/UniquenessGraphs/Scatter';
import Doughnut from 'src/components/UniquenessGraphs/Doughnut';
import { IChainTable, NftHistogramType, Uniqueness, UniquenessType } from 'src/types/graphs';
import ExpandedBacklinks from 'src/components/UniquenessGraphs/GraphsContainer/ExpandedBacklinks';
import { copyToClipboard, formatAddress, validIpfsURL, validTokenOpenSeaURL } from 'src/utils/helpers';

interface GraphsContainerType {
  data: Uniqueness;
  domainDetails: UniquenessType[];
  nftScoreDetails: NftHistogramType;
  chainTable?: IChainTable[];
}

const columns: TableColumn<UniquenessType>[] = [
  {
    name: 'Domain',
    sortable: true,
    selector: row => row[0],
  },
  {
    name: 'Backlinks',
    sortable: true,
    selector: row => row[1].links.length,
  },
  {
    name: 'Average Score',
    sortable: true,
    selector: row => row[1].avgScore,
  },
];

const GraphsContainer: React.FC<GraphsContainerType> = ({ data, domainDetails = [], chainTable, nftScoreDetails }) => {
  const [copiedIndex, setCopiedIndex] = React.useState(-1);

  const chainTableColumns: TableColumn<IChainTable>[] = [
    {
      id: 1,
      name: 'File Url',
      sortable: true,
      selector: row => row.fileUrl,
      cell: row =>
        row.fileUrl ? (
          <a href={validIpfsURL(row.fileUrl)} target='_blank' rel='noreferrer' className='transition hover:text-secondary-blue'>
            <Tooltip text='View Asset' position='right' icon={<BiImage size={24} />} />
          </a>
        ) : (
          ''
        ),
    },
    {
      id: 2,
      name: 'Contract Address',
      sortable: true,
      width: '200px',
      selector: row => row.contractAddress,
      cell: (row, index) =>
        row.contractAddress ? (
          <div className='w-full flex-between'>
            <a
              href={`https://etherscan.io/address/${row.contractAddress}`}
              target='_blank'
              rel='noreferrer'
              className='text-blue-500 hover:underline'
            >
              {formatAddress(row.contractAddress)}
            </a>
            <Tooltip
              icon={
                <BiCopy
                  onClick={() => {
                    copyToClipboard(row.contractAddress);
                    setCopiedIndex(index);
                  }}
                  className='cursor-pointer'
                />
              }
              text={copiedIndex === index ? 'Copied' : 'Copy to Clipboard.'}
            />
          </div>
        ) : (
          ''
        ),
    },
    {
      id: 3,
      name: 'Token ID',
      sortable: true,
      width: '200px',
      selector: row => row.tokenId,
      cell: row =>
        row.tokenId && row.contractAddress && row.chain ? (
          <a
            href={validTokenOpenSeaURL(row.tokenId, row.contractAddress, row.chain)}
            target='_blank'
            rel='noreferrer'
            className='text-xs truncate text-secondary-blue hover:underline'
          >
            {row.tokenId}
          </a>
        ) : (
          ''
        ),
    },
    {
      id: 4,
      name: 'Score',
      sortable: true,
      width: '150px',
      selector: row => row.score,
    },
    {
      id: 5,
      name: 'Chain',
      sortable: true,
      width: '150px',
      selector: row => row.chain.toSentenceCase(),
    },
    {
      id: 6,
      name: 'Cached File Url',
      sortable: true,
      width: '150px',
      selector: row => row.cachedFileUrl,
      cell: row =>
        row.cachedFileUrl ? (
          <a href={validIpfsURL(row.cachedFileUrl)} target='_blank' rel='noreferrer' className='transition hover:text-secondary-blue'>
            <Tooltip text='View Asset' position='right' icon={<BiImage size={24} />} />
          </a>
        ) : (
          ''
        ),
    },
    {
      id: 7,
      name: 'Mint Date',
      sortable: true,
      width: '300px',
      selector: row => row.mintDate,
    },
  ];

  return (
    <>
      {data.tinEyeMatches && data.tinEyeMatches?.length > 0 ? (
        <div className='mt-10'>
          <div className='flex-center'>
            <Heading className='mb-8' type='subheading' text='Similarity across the web' />
          </div>
          {/* TABLE WITH 3 COLUMNS */}
          <Table columns={columns} gridData={domainDetails} expandableRows expandableRowsComponent={ExpandedBacklinks} />
          <div className='grid h-full grid-cols-1 gap-4 my-20 md:h-80 md:grid-cols-2'>
            {/* DOUGHNUT GRAPH */}
            <div>
              <Doughnut data={domainDetails} />
            </div>
            {/* Average Score Scatter Plot */}
            <div>
              <Scatter total={data.tinEyeMatches.length} average={data.avgTinEyeScore} xLabel='Average Score' yLabel='Matches' />
            </div>
          </div>
        </div>
      ) : null}
      {data.nftPortMatches && data.nftPortMatches.length > 0 ? (
        <div className='mt-10'>
          <div className='flex-center'>
            <Heading type='subheading' text='Similarity on-chain' />
          </div>
          {/* TABLE WITH 2 COLUMNS */}
          {chainTable ? <Table columns={chainTableColumns} gridData={chainTable} defaultSortFieldId={4} /> : null}
          <div className='grid h-full grid-cols-1 gap-4 my-20 md:h-80 md:grid-cols-2'>
            {/* Bar Graph */}
            <div>
              <Bar data={nftScoreDetails} xLabel='Score Range' yLabel='Number of Matches' xMax={120} />
            </div>
            {/* Average Score Scatter Plot */}
            <div>
              <Scatter total={data.nftPortMatches.length} average={data.avgNFTPortScore} xLabel='Average Score' yLabel='Matches' />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default GraphsContainer;
