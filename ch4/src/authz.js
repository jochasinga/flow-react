import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";


function hash(message) {
  const sha = new SHA3(256);
  sha.update(Buffer.from(message, "hex"));
  return sha.digest()
}

export function sign(privateKey, message) {
  const ec = new EC("p256");
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const msgHash = hash(message);
  const sig = key.sign(msgHash);
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
}

async function authz(account) {
  return {
    ...account,
    addr: "0xf8d6e0586b0a20c7",
    keyId: 0,
    signingFunction: async (signable) => ({
      f_type: "CompositeSignature",
      f_vsn: "1.0.0",
      addr: "0xf8d6e0586b0a20c7",
      keyId: 0,
      signature: sign(process.env.REACT_APP_EMULATOR_PRIVATE_KEY, signable.message)
    })
  }
}

export default authz;