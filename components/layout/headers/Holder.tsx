export default function Holder({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-fit shrink-0 items-center justify-center border border-transparent hover:border-white [&>*]:flex [&>*]:h-full [&>*]:w-full [&>*]:items-center [&>*]:justify-center [&>*]:px-2">
      {children}
    </div>
  );
}
