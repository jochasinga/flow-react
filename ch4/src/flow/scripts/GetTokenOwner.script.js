import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import raw from "./GetTokenOwner.cdc";

async function getTokenOwner(id) {
    try {
        let script = await(await fetch(raw)).text();
        const encoded = await fcl.send([
            fcl.script(script),
            fcl.args([fcl.arg(id, t.UInt64)])
        ]);
        const ownerAddress = await fcl.decode(encoded);
        return ownerAddress;
    } catch (err) {
        return { error: err };
    }
}

export default getTokenOwner;
