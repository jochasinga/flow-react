import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import getAccountTokenIdsScript from "./flow/scripts/GetAccountTokenIds.cdc";
import setupReceiverAccountTx from "./flow/transactions/SetupReceiverAccount.cdc";

// Get all the token IDs an account own, given the account's address.
async function getAccountTokenIds(addr) {
  let cadence = await (await fetch(getAccountTokenIdsScript)).text();
  const encoded = await fcl.send([
    fcl.script(cadence),
    fcl.args([fcl.arg(addr, t.Address)])
  ]);
  return await fcl.decode(encoded);
}

// Set up the Collection resource for the user
async function setupReceiverAccount() {
    let cadence = await(await fetch(setupReceiverAccountTx)).text();
    const txId = await fcl.mutate({ cadence, limit: 35 });
    return txId;
}

const AuthCluster = () => {
  const [user, setUser] = useState({ loggedIn: null });
  const [accountReady, setAccountReady] = useState(false);
  useEffect(() => {
    fcl.currentUser().subscribe(async (user) => {
      setUser(user);
      if (user.loggedIn) {
        try {
          let ids = await getAccountTokenIds(user.addr);
          if (ids) {
              setAccountReady(true);
          }
        } catch (err) {
          console.error(err);
          const txId = await setupReceiverAccount();
          if (txId) {
              setAccountReady(true);
              window.alert(`Account ${user.addr} is ready to receive NFTs!`);
          }
        }
      }
    });
  }, []);

  return (
    <div className="v-center">
      {
        user.loggedIn
          ? (
              <>
                <span>{ accountReady ? '✔️' : '❌' }</span>
                <span>{user?.addr}</span>
                <button className="Button-primary" onClick={fcl.unauthenticate}>
                    Log Out
                </button>
              </>
          ) : (
              <>
                <button className="Button-primary" onClick={fcl.logIn}>
                  Log In
                </button>
                <button className="Button-primary" onClick={fcl.signUp}>
                  Sign Up
                </button>
              </>
          )
      }
    </div>
  );
}

export default AuthCluster;