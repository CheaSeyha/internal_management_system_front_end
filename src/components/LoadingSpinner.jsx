export default function LoadingSpinner() {
  return (
    <div className="flex w-full flex-col h-screen justify-center items-center">
      <div className="animate-spin rounded-full h-12 font w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="font-KantumruyPro mt-2 font-bold">Loading...</p>
    </div>
  );
}
