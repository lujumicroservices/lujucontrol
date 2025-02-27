import React from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns/format';

type FieldDisplayProps = {
  icon?: string; // Icon for the field (optional)
  value: string | number | null; // Value to display
  format?: string; // Format for dates or numbers (optional)
  isEmail?: boolean; // Whether the value is an email (optional)
  isLink?: boolean; // Whether the value is a link (optional)
  concatenate?: (string | number | null)[]; // List of values to concatenate (optional)
};

/**
 * Reusable component for displaying a field in a read-only view.
 */
function FieldDisplay({ icon, value, format: formatType, isEmail, isLink, concatenate }: FieldDisplayProps) {
  // Format the value if a format is provided
  const formattedValue = formatType && value ? format(new Date(value), formatType) : value;

  // Handle concatenation of multiple values
  const displayValue = concatenate ? concatenate.filter(Boolean).join(', ') : formattedValue;

  return (
    <div className="flex">
      {icon && <FuseSvgIcon>{icon}</FuseSvgIcon>}
      <div className="ml-6">
        {isEmail ? (
          <a className="hover:underline text-primary-500" href={`mailto:${value}`}>
            {value}
          </a>
        ) : isLink ? (
          <a className="hover:underline text-primary-500" href={value as string}>
            {value}
          </a>
        ) : (
          displayValue || 'Not provided'
        )}
      </div>
    </div>
  );
}

export default FieldDisplay;