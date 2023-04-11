import * as React from 'react';
import Dots from 'src/components/Skeleton/Dots';
import Feed from 'src/components/Skeleton/Feed';
import Plan from 'src/components/Skeleton/Plan';
import Details from 'src/components/Skeleton/Details';
import History from 'src/components/Skeleton/History';
import NftView from 'src/components/Skeleton/NftView';
import MintForm from 'src/components/Skeleton/MintForm';
import MintCard from 'src/components/Skeleton/MintCard';
import Notification from 'src/components/Skeleton/Notification';

interface SkeletonType {
  type: keyof typeof SkeletonList;
  repeat?: number;
  className?: string;
}

const SkeletonList = {
  Dots,
  Details,
  History,
  NftView,
  Plan,
  Feed,
  MintForm,
  MintCard,
  Notification,
};

const Skeleton: React.FC<SkeletonType> = ({ type, repeat = 1, className = '' }) => {
  const Component = SkeletonList[type];
  const [skeleton, setSkeleton] = React.useState<string[]>([]);

  React.useEffect(() => {
    const arrSkeleton = new Array(repeat).fill(type);
    setSkeleton(arrSkeleton);
  }, [repeat, type]);

  return (
    <>
      {skeleton?.map((item, idx) => (
        <Component key={`${item}_${idx}`} className={className} />
      ))}
    </>
  );
};

export default Skeleton;
