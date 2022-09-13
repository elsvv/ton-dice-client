import BN from "bn.js";
import { observable, makeAutoObservable } from "mobx";
import { Address, Builder, Cell, fromNano, toNano, TonClient } from "ton";

import { listEqualByKey } from "utils/compareByKey";

import { AppConfig } from "../config";
import { deserializeInvites, deserializeGlobals } from "./serializers";
import { TxApi } from "./TxApi";

const RESERVED_FEE = toNano("0.05");

enum Opcodes {
  sendInvite = 10,
  acceptInvite = 11,
  cancelInvite = 12,
  createGlobal = 20,
  acceptGlobal = 21,
  cancelGlobal = 22,
  withdraw = 666,
}

export type DiceGlobalGame = {
  gameKey: string;
  creatorAddr: Address;
  bet: BN;
};

export interface DiceInviteGame extends DiceGlobalGame {
  oppAddr: Address;
}

class DiceApiClass {
  private client: TonClient;
  private gameAddr: Address;
  invites: DiceInviteGame[] = [];
  globals: DiceGlobalGame[] = [];

  constructor({
    endpoint,
    gameAddrStr,
    apiKey,
  }: {
    endpoint: string;
    gameAddrStr: string;
    apiKey?: string;
  }) {
    this.client = new TonClient({ endpoint, apiKey: apiKey });
    this.gameAddr = Address.parse(gameAddrStr);

    makeAutoObservable<DiceApiClass>(this, {
      invites: observable,
      globals: observable,

      // setInvites: action,
      // setGlobals: action,
    });
  }

  async getAllGames(addr: Address) {
    const oppAddrCell = new Cell();
    oppAddrCell.bits.writeAddress(addr);

    const { stack } = await this.client.callGetMethod(
      this.gameAddr,
      "get_game_invites",
      [["tvm.Slice", oppAddrCell.toBoc({ idx: false }).toString("base64")]]
    );

    const [invitesRaw, fInvitesRaw, globalRaw, fGlobalRaw] = stack;

    const fInvites = parseInt(fInvitesRaw[1]);
    const fGlobal = parseInt(fGlobalRaw[1]);

    this.setInvites(fInvites ? deserializeInvites(invitesRaw[1].bytes) : []);
    this.setGlobals(fGlobal ? deserializeGlobals(globalRaw[1].bytes) : []);
  }

  private setInvites(newInvites: DiceInviteGame[]) {
    if (!listEqualByKey(this.invites, newInvites, "gameKey")) {
      this.invites = newInvites;
    }
  }

  private setGlobals(newGlobals: DiceGlobalGame[]) {
    if (!listEqualByKey(this.globals, newGlobals, "gameKey")) {
      this.globals = newGlobals;
    }
  }

  async sendInvite(oppAddr: Address, bet: BN) {
    const payload = new Builder()
      .storeUint(Opcodes.sendInvite, 32)
      .storeAddress(oppAddr)
      .endCell()
      .toBoc()
      .toString("base64");

    await TxApi.requestTransaction({
      value: bet.add(RESERVED_FEE).toString(10),
      text: `Play with ${oppAddr.toFriendly({
        testOnly: true,
      })} with ${fromNano(bet)} TONs bet? (${fromNano(
        RESERVED_FEE
      )} - fees in TONs will return back after success transaction)`,
      to: this.gameAddr.toFriendly(),
      payload,
    });
  }

  async createGlobalGame(bet: BN) {
    const payload = new Builder()
      .storeUint(Opcodes.createGlobal, 32)
      .endCell()
      .toBoc()
      .toString("base64");

    await TxApi.requestTransaction({
      value: bet.add(RESERVED_FEE).toString(10),
      text: `Create Global game with ${fromNano(bet)} TONs bet? (${fromNano(
        RESERVED_FEE
      )} - fees in TONs will return back after success transaction)`,
      to: this.gameAddr.toFriendly(),
      payload,
    });
  }

  async acceptGlobal({ creatorAddr, bet, gameKey }: DiceGlobalGame) {
    const payload = new Builder()
      .storeUint(Opcodes.acceptGlobal, 32)
      .storeUint(parseInt(gameKey), 64)
      .endCell()
      .toBoc()
      .toString("base64");

    await TxApi.requestTransaction({
      value: bet.add(RESERVED_FEE).toString(10),
      text: `Accept invite  from ${creatorAddr.toFriendly({
        testOnly: true,
      })} with ${fromNano(bet)} TONs bet? (${fromNano(
        RESERVED_FEE
      )} - fees in TONs will return back after success transaction)`,
      to: this.gameAddr.toFriendly(),
      payload,
    });
  }

  async acceptInvite({ creatorAddr, bet, gameKey }: DiceInviteGame) {
    const payload = new Builder()
      .storeUint(Opcodes.acceptInvite, 32)
      .storeAddress(creatorAddr)
      .storeUint(parseInt(gameKey), 64)
      .endCell()
      .toBoc()
      .toString("base64");

    console.log("this.gameAddr", this);

    await TxApi.requestTransaction({
      value: bet.add(RESERVED_FEE).toString(10),
      text: `Accept invite  from ${creatorAddr.toFriendly({
        testOnly: true,
      })} with ${fromNano(bet)} TONs bet? (${fromNano(
        RESERVED_FEE
      )} - fees in TONs will return back after success transaction)`,
      to: this.gameAddr.toFriendly(),
      payload,
    });
  }
}

export const DiceApi = new DiceApiClass({
  endpoint: AppConfig.RPC_URL,
  gameAddrStr: AppConfig.GAME_ADDR,
  apiKey: AppConfig.API_KEY,
});
