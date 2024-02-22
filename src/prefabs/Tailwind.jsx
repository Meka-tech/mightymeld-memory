export function Layout() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center"></main>
  );
}

export function BgCard() {
  return (
    <div className="w-4/5 rounded-lg ml-auto mr-auto flex flex-col justify-center items-center p-3"></div>
  );
}

export function Heading() {
  return <h1 className="text-4xl font-bold"> Head</h1>;
}
export function Subheading() {
  return <h2 className="text-lg font-semibold"> sub</h2>;
}

export function TextSpan() {
  return <span className="ml-2 px-2.5 rounded-lg">span</span>;
}
