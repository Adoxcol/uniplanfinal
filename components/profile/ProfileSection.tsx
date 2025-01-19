import React from 'react';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};

export default ProfileSection;