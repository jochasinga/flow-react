import './App.css';
import data from './pets.json';
import { useState, useEffect } from 'react';
import AuthCluster from './AuthCluster';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

// TODO: Initialize the NFTStorage client

const uploadImageToStorage = (pet) => {
  // TODO: Upload the pet photo to NFT.storage
};

const mintToken = async (pet) => {
  // TODO: Mint the token and upload the image to NFT.storage
};

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
                { !!!ownerAddress ? '📦 Just Dropped' : `👛 ${ownerAddress}` }
              </p>
              <img
                className="Pet-photo"
                src={pet.photo}
                alt="pet"
              />
              <div className="Menu">
                <button className="Button-full">Mint</button>
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
