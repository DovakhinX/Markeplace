import "./Navbar.css";
import React from "react";
import { ethers } from "ethers";
import {Link} from 'react-router-dom';

function Navbar() {
  async function connect() {
    if (window.ethereum) {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let accounts = await provider.send("eth_requestAccounts", []);
    }
}

    return (
      <div className="Navbar">
        <h2>NFT Marakkech</h2>
        <Link to='/'>Home</Link>
        <Link to='/Listing'>Listing</Link>
        <Link to='/Purchases'>My Purchases</Link>

        <button onClick={connect}>CONNECT WALLET</button>

      
      </div>
    );
  }

export default Navbar;
