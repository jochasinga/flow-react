import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import raw from "./GetAccountTokenIds.cdc";

async function getAccountTokenIds(addr) {
    try {
        let script = await(await fetch(raw)).text();
        const encoded = await fcl.send([
            fcl.script(script),
            fcl.args([fcl.arg(addr, t.Address)])
        ]);
        const ids = await fcl.decode(encoded);
        return ids.sort((a, b) => a - b);
    } catch (err) {
        return { error: err };
    }
}

export default getAccountTokenIds;
