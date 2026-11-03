type AddressProps = {
  name?: string | null;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export default function Address({
  name,
  street,
  city,
  state,
  postalCode,
  country,
  isDefault,
}: AddressProps) {
  return (
    <ul className="mt-6">
      <li className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-semibold">Home</h3>
            {isDefault && <span className="text-xs text-gray-500">Default address</span>}
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            {name}
            <br />
            {street}
            <br />
            {city}, {state} {postalCode}, {country}{' '}
          </p>
        </div>
        <button
          type="button"
          className="focus-visible:outline-dark_blue shrink-0 cursor-pointer py-1 text-sm text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Remove
        </button>
      </li>
    </ul>
  );
}
