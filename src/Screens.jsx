import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook
];

export function StartScreen({ start }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("leaderboard")) {
      setLeaderboard(JSON.parse(localStorage.getItem("leaderboard")));
    }
  }, []);
  return (
    <>
      <main className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden max-w-sm mx-auto">
        <div className="w-4/5 rounded-lg mx-auto flex flex-col justify-center items-center p-3 bg-pink-100/50 text-pink-500 h-3/5">
          <h1 className="text-4xl font-bold mb-10">Memory</h1>
          <h2 className="text-lg font-semibold mb-10">
            Flip over tiles looking for pairs
          </h2>
          <div>
            <button
              onClick={start}
              className="bg-gradient-to-b from-pink-400 to-pink-500 rounded-full h-10 w-32 text-2xl font-semibold text-center text-white shadow-xl active:from-pink-500 active:to-pink-500"
            >
              Play
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setShowLeaderboard(true);
              }}
              className="bg-gradient-to-b from-pink-400 to-pink-500 rounded-full h-10 w-fit px-8 text-2xl font-semibold text-center text-white shadow-xl active:from-pink-500 active:to-pink-500 mt-4"
            >
              Leaderboard
            </button>
          </div>
        </div>

        <div
          className={`w-full h-screen absolute z-10 bg-white flex items-center p-2 duration-300 ${
            !showLeaderboard && "translate-x-full"
          }`}
        >
          <div className="w-4/5 rounded-lg mx-auto flex flex-col  items-center p-3 bg-pink-500/10 h-4/5 ">
            <h1 className="text-3xl font-bold text-pink-500 mb-4">
              Leaderboard
            </h1>
            <div className="w-full flex flex-col items-center h-4/5 px-2 overflow-y-scroll">
              <div className="w-full flex justify-between items-center mb-2 text-pink-500 font-bold">
                <h2>Name</h2>
                <h2>Time</h2>
              </div>

              {leaderboard.map((item, i) => {
                return (
                  <div
                    className="w-full rounded-lg px-4 py-1 bg-pink-400 text-white flex items-center justify-between mb-2"
                    key={i}
                  >
                    <h2 className="font-bold text-lg ">{item.name}</h2>
                    <h2 className="font-bold">{item.time} s</h2>
                  </div>
                );
              })}
            </div>
            <button
              className="bg-gradient-to-b from-pink-400 to-pink-500 rounded-xl h-10 w-fit px-4 text-lg font-semibold text-center text-white shadow-xl active:from-pink-500 active:to-pink-500 mt-4 mr-auto"
              onClick={() => {
                setShowLeaderboard(false);
              }}
            >
              Back
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [timer, setTimer] = useState(120);
  const [isPlaying, setIsPlaying] = useState(true);
  const [HintTile, setHintTile] = useState("");
  const [hasHint, setHasHint] = useState(true);
  const [hasWon, setHasWon] = useState(false);
  const [betterTime, setBetterTime] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState("");
  const [bestTime, setBestTime] = useState(0);
  const tileCount = 16;

  useEffect(() => {
    if (localStorage.getItem("leaderboard")) {
      setLeaderboard(JSON.parse(localStorage.getItem("leaderboard")));
    }
  }, []);

  useEffect(() => {
    if (leaderboard.length > 0) {
      const Time = leaderboard.find(
        (entry) => entry.time === Math.max(...leaderboard.map((e) => e.time))
      )?.time;
      setBestTime(Time);
    }
  }, [leaderboard]);

  //timer countDown
  useEffect(() => {
    if (isPlaying) {
      const TimerInterval = setInterval(() => {
        setTimer(timer - 1);
      }, [1000]);

      return () => clearInterval(TimerInterval);
    }
  }, [timer]);

  // player loses
  useEffect(() => {
    if (failCount === 5 || timer === 1) {
      setIsPlaying(false);
    }
  }, [failCount, timer]);

  //restart or play again
  const Restart = () => {
    setFailCount(0);
    setTryCount(0);
    getTiles(true);
    setTimer(120);
    setHasHint(true);
    setHintTile("");
    setHasWon(false);
    setBetterTime(false);
    setIsPlaying(true);
  };

  //end game
  const Endgame = () => {
    end();
  };

  //save new best time
  const SaveTime = () => {
    if (username === "") {
      return;
    }
    localStorage.setItem(
      "leaderboard",
      JSON.stringify([{ name: username, time: timer }, ...leaderboard])
    );
    Endgame();
  };

  //shuffle tiles randomly
  const Shuffle = () => {
    const arrayCopy = [...tiles];

    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }

    setTiles(arrayCopy);
  };

  const getTiles = (restart = false) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (!restart) {
      if (tiles) return tiles;
    }

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100
        });
        newState = "matched";
      } else {
        setFailCount(failCount + 1);
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setIsPlaying(false);
            setHasWon(true);
            if (timer > bestTime) {
              setTimeout(() => setBetterTime(true), [1000]);
            }
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state
      }));
    });
  };

  //get one hint per game
  const GetHint = () => {
    let length = tiles.length;
    const randomTile = Math.random(0, length + 1);
    if (hasHint) {
      setHintTile(tiles[Math.floor(randomTile)]);
      setHasHint(false);
    }
  };

  getTiles();

  return (
    <>
      <main className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden max-w-sm mx-auto">
        <div
          className={`w-full flex items-center justify-center mb-10 absolute top-12 duration-150 ${
            isPlaying ? " -translate-x-full" : ""
          } `}
        >
          <div
            className={`px-2 py-1 rounded-lg ${
              hasWon
                ? "bg-sky-500/10 text-sky-500"
                : "bg-red-500/10 text-red-500"
            } `}
          >
            <h1 className="font-bold text-xl ">
              {hasWon ? "You Won !" : "You Lost !"}
            </h1>
          </div>
        </div>

        <div className="flex w-full items-center mb-10 px-4">
          <h2 className="text-lg font-semibold  text-indigo-400">
            Tries
            <span className="ml-2 rounded-lg px-2.5 bg-indigo-200">
              {tryCount}
            </span>
          </h2>
          <h2 className="text-lg font-semibold ml-3 text-red-500">
            Fails
            <span className="ml-2 rounded-lg px-2.5 bg-red-500/10">
              {failCount}/5
            </span>
          </h2>
          <h2 className="text-lg font-semibold ml-auto text-emerald-500">
            Time
            <span className="ml-2 rounded-lg px-2.5 bg-emerald-500/10">
              {timer}s
            </span>
          </h2>
        </div>
        <div className="w-4/5 rounded-lg mx-auto flex flex-col justify-center items-center p-3 bg-indigo-50 h-fit">
          <div className="grid grid-cols-4 w-full h-full gap-2">
            {tiles?.map((tile, i) => (
              <Tile
                key={i}
                flip={() => {
                  isPlaying ? flip(i) : null;
                }}
                {...tile}
                isPlaying={isPlaying}
                hint={tile.content === HintTile.content}
              />
            ))}
          </div>
        </div>
        <div className="flex w-full items-center mt-4 px-4">
          <button
            className="h-10 px-2 rounded-lg text-lg font-semibold bg-indigo-500 text-white "
            onClick={Restart}
          >
            {isPlaying ? "Restart" : "Play again"}
          </button>
          <button
            className="h-10 px-2 rounded-lg text-lg font-semibold bg-red-500 text-white ml-2 "
            onClick={Endgame}
          >
            End game
          </button>
          <button
            className={`h-10 px-2 rounded-lg text-lg font-semibold text-white ml-auto ${
              !hasHint ? "bg-emerald-500/30" : "bg-emerald-500 "
            }`}
            onClick={GetHint}
          >
            Hint
          </button>
          <button
            className="h-10 px-2 rounded-lg text-lg font-semibold bg-sky-500 text-white ml-2"
            onClick={Shuffle}
          >
            Shuffle
          </button>
        </div>
        <div
          className={`absolute w-full h-screen top-0 z-10 bg-white flex flex-col items-center justify-center duration-150 
${!betterTime && "translate-y-full"}`}
        >
          <div className="w-4/5 flex flex-col items-center p-2 rounded-xl bg-sky-500/5 ">
            <h1 className="text-2xl font-bold mb-10 text-sky-500">
              New Best-Time
            </h1>
            <div className="flex items-center justify-between w-60">
              <input
                placeholder="Username"
                className=" bg-blue-500/10 rounded-lg p-2  placeholder:text-blue-500/50 text-lg font-bold text-blue-500 focus:outline-none w-4/5"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <h2 className="text-xl font-bold text-sky-500">{timer}s</h2>
            </div>
            <button
              className="h-10 w-32 px-4 rounded-lg bg-sky-500 text-white mt-10 \n font-bold"
              onClick={SaveTime}
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
