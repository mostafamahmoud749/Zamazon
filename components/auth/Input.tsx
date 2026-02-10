type InputProps = {
  label: string;
  type: string;
  name: string;
};

export default function Input({ label, type, name }: InputProps) {
  return (
    <div className="mb-4 w-full font-bold">
      <label>
        {label}
        <input
          className="w-full border-1 border-gray-600 p-2 font-medium"
          type={type}
          name={name}
        />
      </label>
    </div>
  );
}
