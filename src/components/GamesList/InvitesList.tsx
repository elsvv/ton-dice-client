import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { DiceApi, DiceInviteGame } from "services/DiceApi";
import { GamesList } from "./GamesList";

export const InvitesList = observer(() => {
  console.log("InvitesList rerender");

  const onAccept = useCallback((game: DiceInviteGame) => {
    DiceApi.acceptInvite(game);
  }, []);

  return (
    <GamesList
      title="Your invites:"
      data={DiceApi.invites}
      onAccept={onAccept}
    />
  );
});
