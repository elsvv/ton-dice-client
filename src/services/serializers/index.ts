import { Cell, parseDict } from "ton";

export function deserializeInvites(boc: string) {
  const dict = Cell.fromBoc(Buffer.from(boc, "base64"))[0].beginParse();

  const dictMap = parseDict(dict, 64, (gameSlice) => {
    const creatorAddr = gameSlice.readAddress();
    const oppAddr = gameSlice.readAddress();
    const bet = gameSlice.readCoins();

    return {
      creatorAddr: creatorAddr!,
      oppAddr: oppAddr!,
      bet,
    };
  });

  return Array.from(dictMap, ([gameKey, value]) => ({
    ...value,
    gameKey,
  }));
}

export function deserializeGlobals(boc: string) {
  const dict = Cell.fromBoc(Buffer.from(boc, "base64"))[0].beginParse();

  const dictMap = parseDict(dict, 64, (gameSlice) => {
    const creatorAddr = gameSlice.readAddress();
    const bet = gameSlice.readCoins();

    return {
      creatorAddr: creatorAddr!,
      bet,
    };
  });

  return Array.from(dictMap, ([gameKey, value]) => ({
    ...value,
    gameKey,
  }));
}
