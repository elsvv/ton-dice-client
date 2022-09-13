import { useConnection } from "hooks/useConnection";
import { useFetchGames } from "hooks/useFetchGames";
import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { DiceApi } from "services/DiceApi";
import { Address, toNano } from "ton";
import { AppConfig } from "../config";
import { GlobalsList } from "./GamesList/GlobalsList";
import { InvitesList } from "./GamesList/InvitesList";

export const Page = () => {
  const connect = useConnection();
  const [oppInput, setOppInput] = useState("");
  const [bet, setBet] = useState("1");
  const [globalBet, setGlobalBet] = useState("1");
  useFetchGames();

  if (connect.state.type === "initing") {
    return <span>Waiting for session</span>;
  }
  if (connect.state.type === "pending") {
    return (
      <div>
        <QRCode
          value={connect.state.link}
          logoImage={"/android-chrome-192x192.png"}
          size={256}
          quietZone={0}
          eyeRadius={8}
          removeQrCodeBehindLogo
          fgColor="#333333"
        />
        <a href={connect.state.link}>Authorize</a>
      </div>
    );
  }

  const handleInvite = async () => {
    await DiceApi.sendInvite(Address.parse(oppInput), toNano(bet));
  };

  const handleCreateGlobal = () => {
    DiceApi.createGlobalGame(toNano(globalBet));
  };

  // };

  return (
    <>
      <h3>Current dice smc:</h3>
      <code>{AppConfig.GAME_ADDR}</code>
      <h3>Your address: </h3>
      <code>{connect.state.address.toFriendly({ testOnly: true })}</code>

      <h4>Enter opponent address to create an invite: </h4>
      <p>
        <input
          value={oppInput}
          placeholder="opponent address"
          onChange={(e) => setOppInput(e.target.value)}
        />
      </p>
      <input
        type="number"
        value={bet}
        placeholder="Your bet"
        onChange={(e) => setBet(e.target.value)}
      />
      <div>
        <button
          onClick={() =>
            setOppInput("kQD8apVzbb-F-acbu2FAed5i0Tdm9o4JbTGghhhVhXLBm8kv")
          }
        >
          Slava
        </button>
        <button
          onClick={() =>
            setOppInput("kQCoglWY0cBAaqcSC5pbBXw0OLsBNEq5bqFSpWwrcyktRP_q")
          }
        >
          Lenya
        </button>
        <button
          onClick={() =>
            setOppInput("kQD_3QV9nlkEsLIpUieLN7gY871TPkPOHkJ1qYPDsu_vhdmN")
          }
        >
          Xiaomi
        </button>
      </div>
      <div>
        <button onClick={handleInvite}>Invite to game</button>
        <hr />
        <h4>Or create global game with just a bet: </h4>
        <div>
          <input
            type="number"
            value={globalBet}
            placeholder="Create global bet"
            onChange={(e) => setGlobalBet(e.target.value)}
          />
          <button onClick={handleCreateGlobal}>Create game</button>
        </div>
        <hr />
      </div>
      <InvitesList />
      <GlobalsList />
      {/* <div>
        <button onClick={handleTake}>Take</button>
      </div> */}
    </>
  );
};
