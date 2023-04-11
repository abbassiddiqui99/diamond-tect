import classnames from 'classnames/bind';

interface BadgeType {
  text: string;
  className?: string;
  color?: 'blue' | 'purple';
}

const Badge: React.FC<BadgeType> = ({ text, className = '', color = 'blue' }) => {
  return (
    <div
      className={classnames(`p-2 text-sm text-center border-2 rounded-lg ${className}`, {
        'bg-secondary-blue/10 border-secondary-blue/60': color === 'blue',
        'bg-secondary-purple/10 border-secondary-purple/60': color === 'purple',
      })}
    >
      {text}
    </div>
  );
};

export default Badge;
