import React from 'react';
import * as LucideIcons from 'lucide-react';

export const DynamicIcon = ({ name, size = 18, color, className = '' }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.Tag;
  return <IconComponent size={size} color={color} className={className} />;
};

export default DynamicIcon;
