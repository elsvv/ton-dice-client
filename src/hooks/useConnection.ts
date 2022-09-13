import { useEffect } from "react";
import { useTonhubConnect } from "react-ton-x";
import { TxApi } from "services/TxApi";

export function useConnection() {
  const connect = useTonhubConnect();

  useEffect(() => {
    TxApi.setTonhubApi(connect.api);
  }, [connect]);

  return connect;
}
