import SignHeader from "@/components/auth/SignHeader";

export default function SignLayout({ children }) {
  return (
    <>
      <SignHeader />
      <main className="w-11/12 m-auto">
        <div className="font-bold md:hidden text-xl my-4 max-w-[400px] m-auto">Welcome</div>
        {children}
      </main>
    </>
  );
}
