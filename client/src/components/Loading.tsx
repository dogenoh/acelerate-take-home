import React from 'react';

type LoadingProps = {
  message: string;
};

const Loading = ({ message }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};

export default Loading;
