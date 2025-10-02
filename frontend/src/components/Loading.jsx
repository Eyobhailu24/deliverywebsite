
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6"></div>

      {/* Text with pulse */}
      <h2 className="text-xl font-semibold text-yellow-700 animate-pulse">
        Loading your restaurant...
      </h2>
      <p className="text-gray-500 mt-2">
        Please wait a moment 🍔
      </p>
    </div>
  );
}
