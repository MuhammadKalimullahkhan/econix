const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-6 h-6">
        {/* Animated Gradient Circle */}

        <div className="absolute inset-0 rounded-full outline border-primary border-4 border-t-transparent border-r-transparent animate-spin bg-green-50"></div>

        {/* Inner Circle */}
        <div className="absolute inset-2 rounded-full bg-green-200"></div>
      </div>
    </div>
  );
};

export default Loading;
