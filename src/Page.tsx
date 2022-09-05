import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { useTonhubConnect } from "react-ton-x";
import { Address, Builder, toNano } from "ton";

const GAME_ADDR = "kQC-zXuKMppoxaZltslgb0_2l_bDvtmc5-QjnaN-jiq9qVzi";
const RESERVED_FEE = 0.1;

export const Page = () => {
  const connect = useTonhubConnect();
  const [oppInput, setOppInput] = useState("");
  const [bet, setBet] = useState(1);

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
          fgColor="#333333"
        />
        <a href={connect.state.link}>Authorize</a>
      </div>
    );
  }

  const handlePlay = async () => {
    const address = Address.parse(oppInput);

    const payload = new Builder()
      .storeUint(10, 32)
      .storeAddress(address)
      .endCell()
      .toBoc()
      .toString("base64");

    await connect.api.requestTransaction({
      value: toNano(bet + RESERVED_FEE).toString(10),
      text: `Play with ${oppInput} with ${bet} TONs bet? (0.1 - fees TONs will return back after success transaction)`,
      to: GAME_ADDR,
      payload,
    });
  };

  const handleTake = async () => {
    const payload = new Builder()
      .storeUint(666, 32)
      .endCell()
      .toBoc()
      .toString("base64");

    await connect.api.requestTransaction({
      value: toNano(0.1 + RESERVED_FEE).toString(10),
      text: "Take profit from smc? Ypu have to be a smc's owner",
      to: GAME_ADDR,
      payload,
    });
  };

  return (
    <>
      <h3>Current dice smc:</h3>
      <code>{GAME_ADDR}</code>
      <h3>Your address: </h3>
      <code>{connect.state.address.toFriendly({ testOnly: true })}</code>

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
        onChange={(e) => setBet(parseFloat(e.target.value))}
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
      <hr />
      <div>
        <button onClick={handlePlay}>Play dice</button>
        <div>
          <code>Play dice with selected opponent</code>
        </div>
      </div>
      {/* <div>
        <button onClick={handleTake}>Take</button>
      </div> */}
    </>
  );
};
