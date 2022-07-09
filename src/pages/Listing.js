import './Listing.css';
import axios from "axios";
import { ethers } from "ethers";
import Navbar from "../Components/Navbar.js";
import React, { useState, useEffect } from "react";


import NftMarket from "../artifacts/contracts/NftMarket.sol/NftMarket.json";

const NftMarketaddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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

  async function buy(item){
    if (typeof window.ethereum !== "undefined") {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      let market = new ethers.Contract(NftMarketaddress, NftMarket.abi, signer);
      let price= ethers.utils.parseUnits(item.price.toString(),'ether');
      let txn= await market.createMarketSale(item.tokenId,{value:price});
      await txn.wait();
      ProcureNft();




  }
}
if (renderState === "True" && !nft.length){
return (<div>
   <Navbar/>
  <h2 className="warning">No NFT Listed</h2>
  </div>);
}



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
              <button onClick={()=>buy(nf)}>BUY</button>

            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default Landing;
