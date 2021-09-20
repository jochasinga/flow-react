import sign from "./sign";

export async function authz(account) {
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