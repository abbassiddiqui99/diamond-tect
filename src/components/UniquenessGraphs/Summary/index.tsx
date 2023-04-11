import Heading from 'src/components/Heading';

interface SummaryType {
  tinEyeAvg: number | string;
  tinEyeTotal: number | string;
  NftPortAvg: number | string;
  NftPortTotal: number | string;
}

const Summary: React.FC<SummaryType> = ({ tinEyeAvg, tinEyeTotal, NftPortAvg, NftPortTotal }) => {
  return (
    <>
      {tinEyeTotal && tinEyeTotal > 0 ? (
        <Heading
          type='heading'
          text={`Your asset has an average matching score of ${tinEyeAvg}% over ${tinEyeTotal} matches found online.`}
        />
      ) : (
        <Heading type='heading' text='We found no links matching your asset online' className='mb-0' />
      )}
      {NftPortTotal && NftPortTotal > 0 ? (
        <Heading
          type='heading'
          text={`We found the following ${NftPortTotal} NFTs on Ethereum & Polygon with on average ${NftPortAvg}% match with your asset.`}
          className='mb-0'
        />
      ) : (
        <Heading type='heading' text='We found no NFTs on Ethereum & Polygon matching your asset' />
      )}
    </>
  );
};

export default Summary;
