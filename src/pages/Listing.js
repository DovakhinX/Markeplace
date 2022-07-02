import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Navbar from "../Components/Navbar.js";
import './Listing.css';

import NftMarket from "../artifacts/contracts/NftMarket.sol/NftMarket.json";

const NftMarketaddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

function Landing() {
  const [nft, setnft] = useState([]);
  const [renderState, setrenderState] = useState("False");
  useEffect(() => {
    ProcureNft();
  }, []);

  async function ProcureNft() {
    if (typeof window.ethereum !== "undefined") {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      let market = new ethers.Contract(NftMarketaddress, NftMarket.abi, signer);
      let data = await market.fetchItemsListed();
     
      let items = await Promise.all(data.map(async i => {
          const tokenUri = await market.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name:meta.data.name,
            description:meta.data.description,
          };  
          return item;
        })
      );
      setnft(items);
      setrenderState("True");
    }
  }
 if (renderState === "True" && !nft.length)
    return <h2 className="warning">No NFT Listed</h2>;

  return (
    <>
     <Navbar/>
    <div className="Main">
    <h2>Listed NFT</h2>
      <div className="box">
        <div>
          {nft.map((nf, i) => (
            <div key={i} className='itembox'>
              <p>{nf.name}</p>
              <p> {nf.price} Eth</p>
              <img src={nf.image} className="image" alt="NFT"/>
              <p>{nf.description}</p>

            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default Landing;
