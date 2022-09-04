import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { useTonhubConnect } from "react-ton-x";
import { Address, Builder, Cell, toNano } from "ton";

const GAME_ADDR = "kQDs7CSjlu2WEqrYyk4h_rKKvvbvKf4jDxFgO6NOUmCbiOdq";

export const Page = () => {
  const connect = useTonhubConnect();
  const [oppInput, setOppInput] = useState("");

  if (connect.state.type === "initing") {
    return <span>Waiting for session</span>;
  }
  if (connect.state.type === "pending") {
    return (
      <div>
        <QRCode
          value={connect.state.link}
          size={256}
          quietZone={0}
          removeQrCodeBehindLogo
          fgColor="#002457"
        />
        <a href={connect.state.link}>Authorize</a>
      </div>
    );
  }

  const handlePlay = async () => {
    const { address } = Address.parseFriendly(oppInput);

    const payload = new Builder()
      .storeUint(0, 32)
      .storeAddress(address)
      .endCell()
      .toBoc()
      .toString("base64");

    await connect.api.requestTransaction({
      value: toNano(1).toString(10),
      to: GAME_ADDR,
      payload,
    });
  };

  const handleTake = async () => {
    const payload = new Builder()
      .storeUint(66, 32)
      .endCell()
      .toBoc()
      .toString("base64");

    await connect.api.requestTransaction({
      value: toNano(1).toString(10),
      to: GAME_ADDR,
      payload,
    });
  };

  return (
    <>
      <p>
        Your address:{" "}
        <span>{connect.state.address.toFriendly({ testOnly: true })}</span>
      </p>

      <input
        value={oppInput}
        placeholder="opponent address"
        onChange={(e) => setOppInput(e.target.value)}
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
      </div>

      <button onClick={handlePlay}>Play</button>
      <button onClick={handleTake}>Take</button>
    </>
  );
};
