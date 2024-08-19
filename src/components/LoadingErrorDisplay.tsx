import React from 'react';

type LoadingErrorDisplayProps = {
  loading: boolean;
  error: string | null;
};

export const LoadingErrorDisplay: React.FC<LoadingErrorDisplayProps> = ({
  loading,
  error
}) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return null;
};
