import { InputHTMLAttributes, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', type = 'text', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={`
              w-full px-4 pt-6 pb-2 text-base
              bg-gray-50 border-2 rounded-xl
              transition-all duration-200
              focus:outline-none focus:border-blue-500 focus:bg-white
              ${error ? 'border-red-500' : 'border-gray-200'}
              ${className}
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(e.target.value.length > 0);
            }}
            onChange={(e) => setHasValue(e.target.value.length > 0)}
            {...props}
          />
          {label && (
            <label
              className={`
                absolute left-4 transition-all duration-200 pointer-events-none
                ${isFocused || hasValue || props.value
                  ? 'top-2 text-xs text-gray-500'
                  : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
                }
              `}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
