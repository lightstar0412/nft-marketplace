import { Address, Contract, Giver, ProviderRpcClient, Transaction } from "locklift";
import { Ed25519KeyPair } from "everscale-standalone-client";

// Reimplements this class if you need to use custom giver contract
export class SimpleGiver implements Giver {
  public giverContract: Contract<typeof giverAbi>;

  constructor(ever: ProviderRpcClient, readonly keyPair: Ed25519KeyPair, address: string) {
    const giverAddr = new Address(address);
    this.giverContract = new ever.Contract(giverAbi, giverAddr);
  }

  public async sendTo(sendTo: Address, value: string): Promise<{ transaction: Transaction; output?: {} }> {
    return this.giverContract.methods
      .sendTransaction({
        value: value,
        dest: sendTo,
        bounce: false,
      })
      .sendExternal({ publicKey: this.keyPair.publicKey });
  }
}

const giverAbi = {
  "ABI version": 2,
  header: ["time", "expire"],
  functions: [
    {
      name: "upgrade",
      inputs: [{ name: "newcode", type: "cell" }],
      outputs: [],
    },
    {
      name: "sendTransaction",
      inputs: [
        { name: "dest", type: "address" },
        { name: "value", type: "uint128" },
        { name: "bounce", type: "bool" },
      ],
      outputs: [],
    },
    {
      name: "getMessages",
      inputs: [],
      outputs: [
        {
          components: [
            { name: "hash", type: "uint256" },
            { name: "expireAt", type: "uint64" },
          ],
          name: "messages",
          type: "tuple[]",
        },
      ],
    },
    {
      name: "constructor",
      inputs: [],
      outputs: [],
    },
  ],
  events: [],
} as const;

export class GiverWallet implements Giver {
  public giverContract: Contract<typeof giverWallet>;

  constructor(private readonly ever: ProviderRpcClient,readonly keyPair: Ed25519KeyPair, private readonly address: string) {
    const giverAddr = new Address(address);
    this.giverContract = new ever.Contract(giverWallet, giverAddr);
  }

  public async sendTo(sendTo: Address, value: string): Promise<{ transaction: Transaction; output?: {} }> {
    console.log(await this.ever.getBalance(this.giverContract.address))
    return this.giverContract.methods
      .sendTransaction({
        value: value,
        dest: sendTo,
        bounce: false,
        flags: 3,
        payload: "",
      })
      .sendExternal({ publicKey: this.keyPair.publicKey });
  }
}

const giverWallet = {
  "ABI version": 2,
  header: ["pubkey", "time", "expire"],
  functions: [
    {
      name: "sendTransaction",
      inputs: [
        { name: "dest", type: "address" },
        { name: "value", type: "uint128" },
        { name: "bounce", type: "bool" },
        { name: "flags", type: "uint8" },
        { name: "payload", type: "cell" },
      ],
      outputs: [],
    },
  ],
  events: [],
} as const;
export class TestnetGiver implements Giver {
  public giverContract: Contract<typeof testnetGiverAbi>;

  constructor(ever: ProviderRpcClient, readonly keyPair: Ed25519KeyPair, address: string) {
      const giverAddr = new Address(address);
      this.giverContract = new ever.Contract(testnetGiverAbi, giverAddr);
  }

  public async sendTo(sendTo: Address, value: string): Promise<{ transaction: Transaction; output?: {} }> {
      return this.giverContract.methods
          .sendGrams({
              dest: sendTo,
              amount: value
          })
          .sendExternal({ publicKey: this.keyPair.publicKey });
  }
}

const testnetGiverAbi = {
  "ABI version": 2,
  header: ["pubkey", "time", "expire"],
  functions: [
     {
          name: "sendGrams",
          inputs: [
              {name: "dest", type: "address"},
              {name: "amount", type: "uint64"}
          ],
          outputs: []
     }
  ],
  events: []
} as const;

export class GiverWalletV2 implements Giver {
  constructor(
    private readonly ever: ProviderRpcClient,
    readonly keyPair: Ed25519KeyPair,
    private readonly address: string,
  ) {}
  sendTo(sendTo: Address, value: string) {
    return this.ever.sendMessage({
      sender: new Address(this.address),
      recipient: sendTo,
      amount: value, // 10 EVER
      bounce: false,
    });
  }
}