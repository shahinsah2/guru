import Link from "next/link";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Welcome to Guru Goutham</h1>
      <Link href={'/settings'} className="inline-block px-6 py-3 mt-4 rounded-full bg-blue-600 text-white text-lg font-semibold transition-all duration-300 ease-in-out hover:bg-blue-700 active:bg-blue-800">
        Click Here
      </Link>
    </div>
  );
}
