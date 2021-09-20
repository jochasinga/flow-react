import {ec as EC} from "elliptic";
import {SHA3} from "sha3";


function hash(message) {
    const sha = new SHA3(256);
    sha.update(Buffer.from(message, "hex"));
    return sha.digest()
}

function sign(privateKey, message) {
    const ec = new EC("p256");
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
    const msgHash = hash(message);
    const sig = key.sign(msgHash);
    const n = 32;
    const r = sig.r.toArrayLike(Buffer, "be", n);
    const s = sig.s.toArrayLike(Buffer, "be", n);

    return Buffer.concat([r, s]).toString("hex");
}

export default sign;