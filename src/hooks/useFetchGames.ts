import { useEffect } from "react";
import { useTonhubConnect } from "react-ton-x";
import { DiceApi } from "services/DiceApi";

const POLLING_TIME = 4000;

export function useFetchGames() {
  const connect = useTonhubConnect();

  useEffect(() => {
    let timer: NodeJS.Timer;

    if (connect.state.type === "online") {
      timer = setInterval(() => {
        // @ts-ignore
        DiceApi.getAllGames(connect.state.address);
      }, POLLING_TIME);

      return () => {
        clearInterval(timer);
      };
    }
  }, [connect]);
}
