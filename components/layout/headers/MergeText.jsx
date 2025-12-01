export default function MergeText({ top, bottom }) {
  return (
    <div className="min-w-fit">
      <div className="text-xs text-gray-300">{top}</div>
      <div className="-mt-1 text-xs font-bold">{bottom}</div>
    </div>
  );
}
