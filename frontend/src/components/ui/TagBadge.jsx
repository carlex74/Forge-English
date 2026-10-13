import React from 'react';
import { getTagInfo } from '../../core/utils/tagStyles';

export const TagBadge = ({ tag, onClick, isSelected = false, size = 'sm', showIcon = false }) => {
  const info = getTagInfo(tag);

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size] || 'text-[10px] px-2 py-0.5';

  const clickableClasses = onClick
    ? 'cursor-pointer hover:opacity-85 hover:scale-105 active:scale-95 transition-transform'
    : '';

  const selectedClasses = isSelected
    ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-slate-900 shadow-sm'
    : '';

  return (
    <span
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(tag);
        }
      }}
      title={info.fullDescription || `${tag.type}: ${tag.description}`}
      className={`inline-flex items-center gap-1 font-semibold rounded-full border uppercase tracking-wider transition-all select-none ${sizeClasses} ${info.classes} ${clickableClasses} ${selectedClasses}`}
    >
      {showIcon && info.icon && <span className="text-[10px]">{info.icon}</span>}
      <span className="truncate max-w-[140px]">{info.label}</span>
    </span>
  );
};
