export function Layout() {
  return (
    <main className="h-screen w-full flex flex-col items-center justify-center"></main>
  );
}

export function BgCard() {
  return (
    <div className="w-4/5 rounded-lg mx-auto flex flex-col justify-center items-center p-3 "></div>
  );
}

export function Heading() {
  return <h1 className="text-4xl font-bold">Head</h1>;
}

export function Subheading() {
  return <h2 className="text-lg font-semibold">Sub</h2>;
}

export function TextSpan() {
  return <span className="ml-2 rounde-lg px-2.5">span</span>;
}

export function FlexBox() {
  return <div className="flex w-full items-center"></div>;
}

export function Button() {
  return <button className="h-10 px-4 rounded-lg ">Button</button>;
}
