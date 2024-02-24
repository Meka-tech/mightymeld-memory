export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back className="h-16 w-16 rounded-xl bg-indigo-300" flip={flip} />
      );
    case "flipped":
      return (
        <Front className="flex items-center justify-center h-16 w-16 bg-indigo-500 rounded-xl text-white">
          <Content
            style={{
              width: "80%",
              height: "80%",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="flex items-center justify-center h-16 w-16 text-indigo-300">
          <Content
            style={{
              width: "80%",
              height: "80%",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return <div onClick={flip} className={className}></div>;
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}
