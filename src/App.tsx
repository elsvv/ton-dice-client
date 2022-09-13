import { RemoteConnectPersistance, TonhubConnectProvider } from "react-ton-x";

import { usePersistState } from "hooks/usePersistState";

import { Page } from "./components/Page";

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

const App = () => {
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
