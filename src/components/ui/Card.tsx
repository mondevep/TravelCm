import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card = ({ children, className = '', hover = false, onClick }: CardProps) => {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100
        transition-all duration-200
        ${hover ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
