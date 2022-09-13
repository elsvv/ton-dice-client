import { TonhubApi, TransactionRequest } from "react-ton-x/dist/types";

class TxApiClass {
  private tonhubApi: TonhubApi | null = null;

  setTonhubApi(tapi: TonhubApi) {
    this.tonhubApi = tapi;
  }

  async requestTransaction(rxReq: TransactionRequest) {
    if (!this.tonhubApi) throw new Error("No TON connection");

    return this.tonhubApi.requestTransaction(rxReq);
  }
}

export const TxApi = new TxApiClass();
