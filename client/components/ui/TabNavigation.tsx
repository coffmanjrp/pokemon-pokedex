import React from 'react';

interface TabInfo<T extends string> {
  id: T;
  label: string;
  count?: number;
  icon?: string;
}

interface TabNavigationProps<T extends string> {
  tabs: TabInfo<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  variant?: 'underline' | 'pills' | 'buttons';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses = {
  underline: {
    container: 'border-b border-gray-200',
    tab: 'px-4 py-3 font-medium text-sm border-b-2 transition-colors',
    active: 'border-blue-500 text-blue-600',
    inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
  },
  pills: {
    container: 'bg-gray-100 p-1 rounded-lg',
    tab: 'px-3 py-2 text-sm font-medium rounded-md transition-colors',
    active: 'bg-white text-blue-600 shadow-sm',
    inactive: 'text-gray-600 hover:text-gray-800',
  },
  buttons: {
    container: 'flex gap-2',
    tab: 'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
    active: 'bg-blue-500 text-white',
    inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  },
};

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
};

export function TabNavigation<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  variant = 'underline',
  size = 'md',
  className = '',
}: TabNavigationProps<T>) {
  const classes = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  return (
    <div className={`${classes.container} ${className}`}>
      <nav className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${classes.tab} ${sizeClass} ${
              activeTab === tab.id ? classes.active : classes.inactive
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}