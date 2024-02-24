export function Layout() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center"></main>
  );
}

export function BgCard() {
  return (
    <div className="w-4/5 rounded-lg mx-auto flex flex-col justify-center items-center p-3"></div>
  );
}

export function Heading() {
  return <h1 className="font-bold text-4xl">Head</h1>;
}
export function Subheading() {
  return <h2 className="font-semibold text-lg">Sub</h2>;
}

export function TextBg() {
  return <span className="ml-2 px-2.5 rounded-lg">span</span>;
}
