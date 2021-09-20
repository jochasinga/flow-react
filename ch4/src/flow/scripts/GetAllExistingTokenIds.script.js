import * as fcl from "@onflow/fcl";
import raw from "./GetAllExistingTokenIds.cdc";

async function getAllExistingTokenIds() {
    try {
        let script = await(await fetch(raw)).text();
        const encoded = await fcl.send([fcl.script(script)]);
        const ids = await fcl.decode(encoded);
        return ids.sort((a, b) => a - b);
    } catch (err) {
        return { error: err };
    }
}

export default getAllExistingTokenIds;
