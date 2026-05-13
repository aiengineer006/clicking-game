import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Intro } from "@/components/game/Intro";
import { Game } from "@/components/game/Game";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Idea Storm — A Stimulation Clicker" },
      { name: "description", content: "Click to collect ideas. Survive the chaos. Beat the game." },
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
