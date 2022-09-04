import { useEffect, useState } from "react";
import { RemoteConnectPersistance, TonhubConnectProvider } from "react-ton-x";
import { Page } from "./Page";
import { Buffer } from "buffer";

// @ts-ignore
window.Buffer = Buffer;

const getInitState = (): RemoteConnectPersistance => {
  const prev = window.localStorage.getItem("storage");
  // @ts-ignore
  const parsed = JSON.parse(prev !== "undefined" ? prev : "null");

  return (
    parsed || {
      type: "initing",
    }
  );
};

function usePersistState<T>(init: T) {
  const [state, setState] = useState<T>(init);

  useEffect(() => {
    window.localStorage.setItem("storage", JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

const App = () => {
  // use any persistent state you want for remote connector
  const [connectionState, setConnectionState] =
    usePersistState<RemoteConnectPersistance>(getInitState());

  return (
    <TonhubConnectProvider
      network="sandbox"
      url={window.location.origin}
      name="TON Dice"
      // @ts-ignore
      connectionState={connectionState}
      // @ts-ignore
      setConnectionState={setConnectionState}
    >
      <Page />
    </TonhubConnectProvider>
  );
};

export default App;
