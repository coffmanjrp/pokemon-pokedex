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
    tab: 'px-2 sm:px-4 py-3 font-medium text-xs sm:text-sm border-b-2 transition-colors flex-1 sm:flex-initial min-w-0',
    active: 'border-blue-500 text-blue-600',
    inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
  },
  pills: {
    container: 'bg-gray-100 p-1 rounded-lg',
    tab: 'px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors flex-1 sm:flex-initial min-w-0',
    active: 'bg-white text-blue-600 shadow-sm',
    inactive: 'text-gray-600 hover:text-gray-800',
  },
  buttons: {
    container: 'flex gap-1 sm:gap-2',
    tab: 'px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex-1 sm:flex-initial min-w-0',
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
      <nav className="flex w-full overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${classes.tab} ${sizeClass} ${
              activeTab === tab.id ? classes.active : classes.inactive
            } whitespace-nowrap touch-manipulation`}
            style={{ minHeight: '44px' }}
          >
            <span className="flex items-center gap-1 sm:gap-2 justify-center">
              {tab.icon && <span className="text-sm">{tab.icon}</span>}
              <span className="truncate">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`hidden sm:inline-flex ml-2 px-2 py-1 text-xs rounded-full ${
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