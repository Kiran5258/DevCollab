import React from 'react';

const Avatar = ({ src, name, size = "md", className = "" }) => {
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setError(false);
  }, [src]);
  
  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-32 h-32 text-2xl",
    "2xl": "w-40 h-40 text-4xl"
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Check if src is the default or invalid
  const isDefault = !src || src.includes('default_avatar.png');

  if (error || isDefault) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shadow-inner`}>
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setError(true)}
      className={`${sizeClasses[size]} ${className} rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm`}
    />
  );
};

export default Avatar;
