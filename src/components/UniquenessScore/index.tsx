import Heading from 'src/components/Heading';
import { Uniqueness } from 'src/types/graphs';

const UniquessnessScore: React.FC<{ score: Uniqueness; className?: string }> = ({ score, className }) => {
  return (
    <div className={className}>
      <Heading type='subheading' text='Johri Matching Index' />
      <div className='flex gap-2'>
        <div>Overall:</div>
        <div>
          <strong>{score.avgTinEyeScore}</strong>% match over <strong>{score.totalTinEyeResults}</strong> backlinks
        </div>
      </div>
      <div className='flex gap-2'>
        <div>NFT:</div>
        <div>
          <strong>{score.avgNFTPortScore}</strong>% match over <strong>{score.totalNFTPortResults}</strong> NFT(s)
        </div>
      </div>
    </div>
  );
};

export default UniquessnessScore;
