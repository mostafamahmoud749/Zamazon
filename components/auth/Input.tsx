
type InputProps={
  label:string
  type:string
}

export default function Input({ label, type }:InputProps) {
  return (
    <div className="mb-4 font-bold w-full">
      <label>
        {label}
        <input
          className="w-full font-medium  border-gray-600 border-1 p-2"
          type={type}
          name="email"
        />
      </label>
    </div>
  );
}
