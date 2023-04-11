import classnames from 'classnames/bind';

import Heading from 'src/components/Heading';
interface CardType {
  title?: string;
  heading?: string;
  subheading?: string;
  className?: string;
  noShadow?: boolean;
}

export const Card: React.FC<CardType> = ({ title, heading, subheading, className = '', noShadow = false, children }) => (
  <div
    className={classnames(`p-10 bg-white rounded-3xl ${className}`, {
      'shadow-2xl': !noShadow,
    })}
  >
    {title ? <Heading text={title} /> : null}
    {heading ? <Heading text={heading} type='heading' /> : null}
    {subheading ? <Heading text={subheading} type='subheading' /> : null}
    {children}
  </div>
);

export default Card;
