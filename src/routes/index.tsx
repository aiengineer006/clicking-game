import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Intro } from "@/components/game/Intro";
import { Game } from "@/components/game/Game";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "JUST CLICK — A Pencil-Drawn Stimulation Clicker" },
      { name: "description", content: "Click to collect bulbs. Survive the hand-drawn chaos. Beat the game." },
    ],
  }),
});

function Index() {
  const [introDone, setIntroDone] = useState(false);
  return (
    <>
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <Game onIntroDone={introDone} />
    </>
  );
}
