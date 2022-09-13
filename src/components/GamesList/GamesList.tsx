import { DiceGlobalGame } from "services/DiceApi";

import { GamesListRow } from "./GamesListRow";

type Props<T> = {
  data: T[];
  title: string;
  onAccept: (game: T) => void;
};

export function GamesList<T extends DiceGlobalGame>({
  data,
  title,
  onAccept,
}: Props<T>) {
  console.log("rerender List");

  return (
    <div>
      <h3>{title}</h3>
      {data.map((g) => (
        <GamesListRow key={g.gameKey} data={g} onAccept={onAccept} />
      ))}
    </div>
  );
}
