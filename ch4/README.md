# Chapter 4: Minting Token

Build a `mintToken` function that interact with the prepared cadence transaction to mint
the token and uploads the asset to NFT.storage with [nft.storage](https://nft.storage) client.

### Files
From the base [`./src`](./src) directory:
- [App.js](./src/App.js)
- [flow/transactions/MintPetToken.cdc](./flow/transactions/MintPetToken.cdc)
- [authz.js](./src/authz.js)

> ⚠️ **Important**   
> Add your NFT.Storage API key to the `.env.local` file before running 
> React. The `NFTStorage` client in this chapter will look for an 
> environment variable `REACT_APP_NFTSTORAGE_API_KEY` in the `.env.local` file.

The complete code in `App.js` should resembles the following (see [ch5/src/App.js](../ch5/src/App.js)):

```jsx

import './App.css';
import data from './pets.json';
import { useState, useEffect } from 'react';
import AuthCluster from './AuthCluster';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { NFTStorage, File } from "nft.storage";
import authz from "./authz";
import mintTokenTx from "./flow/transactions/MintPetToken.cdc";

// Initialize the NFTStorage client
const client = new NFTStorage({
  token: process.env.REACT_APP_NFTSTORAGE_API_KEY
});

// Upload image to NFT.storage
const uploadImageToStorage = async (pet) => {
  const url = await fetch(pet?.photo);
  const data = await url.blob();
  const filename = pet.name + ".jpg";
  const metadata = await client.store({
    ...pet,
    // description and image are mandatory attributes
    description: `Data of ${pet.name}`,
    image: new File([data], filename, { type: "image/jpg" }),
  });
  return {
    ...metadata, 
    web2: cidToWeb2Url(metadata.data.image.href) 
  };
}

export const mintToken = async (pet) => {
  // Get raw Cadence transaction code
  const code = await (await fetch(mintTokenTx)).text();

  // Convert the pet object to t.Dictionary type according to 
  // the PetShopContract definition.
  const metadata = Object.keys(pet).map((k) => {
    return { key: k, value: pet[k] };
  });

  try {
    // Create a "typed" payload
    const payload = fcl.args([
      fcl.arg(
        metadata,
        t.Dictionary({ key: t.String, value: t.String }),
      )
    ]);

    // Send the transaction to the emulator, passing the imported
    // `authz` authorization function instead of the default `fcl.authz`.
    const encoded = await fcl.send([
      fcl.transaction(code),
      fcl.payer(authz),
      fcl.proposer(authz),
      fcl.authorizations([authz]),
      fcl.limit(35),
      payload,
    ]);

    let _txId = await fcl.decode(encoded);

    // If on-chain transaction was successful, upload the image to NFT.storage
    let petData = await uploadImageToStorage(pet);

    return petData;
  } catch (err) {
    console.error(err);
  }
}

// A helper to convert ipfs URL to http URL for the <img/> tag.
function cidToWeb2Url(uri) {
  let url = new URL(uri);
  if (url.protocol === "ipfs:") {
    let [cid, filename] = url.pathname.slice(2).split('/');
    return `https://${cid}.ipfs.dweb.link/${filename}`;
  }
}

const Nav = () => (
  <nav className="App-nav">
    <AuthCluster />
  </nav>
);

function App() {
  const [pets, setPets] = useState([]);
  const [ownerAddress, setOwnerAddress] = useState(null);
  useEffect(() => {
    // Set just one pet so it's easier to work with.
    setPets([data.pets.pop()]);
  }, []);
  return (
    <div className="App">
      <Nav />
      <div className="App-content">
        {
          pets.map((pet, i) =>
            <div key={i} className="Pet-container">
              <p className="Pet-heading">
                {!!!ownerAddress ? '📦 Just Dropped' : `⬇️ ${ownerAddress}`}
              </p>
              <img className="Pet-photo"
                src={pet.photo}
                alt="pet"
              />
              <div className="Menu">
                <button
                  disabled={!!ownerAddress} 
                  className="Button-full" 
                  onClick={async () => {
                    const imageUrl = (await mintToken(pet)).web2;

                    // We update the state so the UI displays the image hosted on NFT.storage
                    // instead of the local filesystem before it was minted.
                    let newPet = { ...pet, photo: imageUrl };
                    setPets([newPet]);

                    // Just update the `ownerAddress` state to a mock address.
                    setOwnerAddress("0xMarketplace");
                }}>
                  Mint
                </button>
                <button className="Button-full">Adopt</button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;

```


