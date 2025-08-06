export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="text-red-500 text-lg">{message}</div>
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="flex items-center gap-2"
      >
        <RefreshCw size={16} />
        Retry
      </Button>
    </div>
  );
}