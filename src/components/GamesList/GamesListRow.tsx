import { fromNano } from "ton";

import { WithGameKey } from "utils/types";

import { DiceInviteGame, DiceGlobalGame } from "services/DiceApi";

type Props<T extends DiceGlobalGame> = {
  data: WithGameKey<T>;
  onAccept: (data: T) => void;
};
export function GamesListRow<T extends DiceGlobalGame>({
  data,
  onAccept,
}: Props<T>) {
  return (
    <div>
      <p>Opponent: {data.creatorAddr?.toFriendly({ testOnly: true })}</p>
      <p>Bet: {fromNano(data.bet)}</p>
      <button onClick={() => onAccept(data)}>Accept</button>
    </div>
  );
}
