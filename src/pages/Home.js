
import NftMarket from "../artifacts/contracts/NftMarket.sol/NftMarket.json";

import "./Home.css";
import { ethers } from "ethers";
import React, { useState } from "react";
import Navbar from "../Components/Navbar.js";
import {create} from 'ipfs-http-client';

function Home() {
  let [fileurl,setfileurl]=useState(null);
  let [name, setname] = useState("");
  let [price, setprice] = useState(0);
  let [description, setdescription] = useState("");

  const client=create("https://ipfs.infura.io:5001/");
  const NftMarketaddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  



  async function fileHandling(e){
    const file=e.target.files[0]
    try{
      const adding=await client.add(
        file,{
          progress: (prog)=>console.log(`Received:${prog}`)
        }
      )
      const url=`https://ipfs.infura.io/ipfs/${adding.path}`;
      setfileurl(url);
    }catch(error){
      console.log('Error Uploading:',error)
    }
  }

async function uploadToIPFS(){
  if (!name || !description || !price || !fileurl) return;
  const data = JSON.stringify({
    name,description,image: fileurl
  })
  try {
    const adding = await client.add(data);
    const url = `https://ipfs.infura.io/ipfs/${adding.path}`;
    return url;
  } catch (error) {
    console.log('Error uploading file: ', error);
  }  
}

  async function createNFT(){
    if (typeof window.ethereum !== "undefined") {
      const url=await uploadToIPFS();
      console.log(url);
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
    
      let Price=ethers.utils.parseUnits(price,'ether');
      let market=new ethers.Contract(NftMarketaddress,NftMarket.abi,signer);
      let listprice= await market.getListingPrice();
       listprice=listprice.toString();
      let txn=await market.createToken(url,Price,{value:listprice});
      await txn.wait();
      


  }
}

  return (
    <>
    <Navbar />
    <div className="Main">
      <br/>
      <h2>Create your own NFT</h2>
      <br/>
      <div className="NFT">
        <label>Name</label>
        <input placeholder="Enter NFT Name" className="ItemName" onChange={(e)=>{setname(e.target.value)}}  />
        <br />
        <br />
        <label>Price </label>
        <input placeholder="Enter NFT Price" className="ItemName" onChange={(e)=>{setprice(e.target.value)}}/>
        <br />
        <br />
        <label>Description </label>
        <textarea placeholder="Enter NFT Description" className="ItemName" onChange={(e)=>{setdescription(e.target.value)}} />
        <br />
        <br />
        <input type="file" className="File" name="NFT" onChange={fileHandling}/>
        <br />
        <br />
        {fileurl &&(
          <img width='350' src={fileurl} alt="NFT"/>
        )}
         <br />
        <button onClick={createNFT}>Create your NFT</button>
        
     
      </div>
    </div>
    
    </>
    
  );
}


export default Home;
