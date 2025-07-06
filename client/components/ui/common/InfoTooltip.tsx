"use client";

import React from 'react';
import { Tooltip } from 'react-tooltip';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { IconType } from 'react-icons';

interface InfoTooltipProps {
  id: string;
  content: React.ReactNode;
  children?: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  iconClassName?: string;
  icon?: IconType;
}

export function InfoTooltip({
  id,
  content,
  children,
  placement = 'top',
  className = '',
  iconClassName = 'w-5 h-5',
  icon: Icon = IoInformationCircleOutline
}: InfoTooltipProps) {
  return (
    <>
      <button
        data-tooltip-id={id}
        data-tooltip-place={placement}
        className={`text-blue-500 hover:text-blue-600 transition-colors ${className}`}
        type="button"
      >
        {children || <Icon className={iconClassName} />}
      </button>
      <Tooltip 
        id={id}
        className="max-w-xs z-50"
        style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
      >
        {content}
      </Tooltip>
    </>
  );
}