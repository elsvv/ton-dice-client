import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { DiceApi, DiceGlobalGame } from "services/DiceApi";
import { GamesList } from "./GamesList";

export const GlobalsList = observer(() => {
  console.log("GlobalsList rerender");

  const onAccept = useCallback((game: DiceGlobalGame) => {
    DiceApi.acceptGlobal(game);
  }, []);

  return (
    <GamesList
      title="Global games:"
      data={DiceApi.globals}
      onAccept={onAccept}
    />
  );
});
