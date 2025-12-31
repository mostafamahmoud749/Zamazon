export default function ProductImg({ img }) {
  return (
    <div className="max-w-[450px] aspect-square w-full m-auto">
      <img src={img} alt="Product" className="h-full w-full object-contain" />
    </div>
  );
}
