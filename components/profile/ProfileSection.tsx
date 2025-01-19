import React from 'react';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Optional custom class
  icon?: React.ReactNode; // Optional icon
  divider?: boolean; // Optional divider
}

export default function ProfileSection({ title, children, className, icon, divider = false }: ProfileSectionProps) {
  return (
    <div className={`mb-6 ${className || ''}`}>
      <div className="flex items-center mb-4">
        {icon && <span className="mr-2">{icon}</span>} {/* Render icon if provided */}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {divider && <hr className="border-t border-gray-200 mb-4" />} {/* Render divider if enabled */}
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
}