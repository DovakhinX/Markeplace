require("@nomiclabs/hardhat-waffle");

const fs=require("fs");

const privateKey=fs.readFileSync(".secret").toString();
const projectId="de38a6c3ab9b4ff3934521fcd4e13129";


module.exports = {
  networks:{
    hardhat:{
      chainId:1337
    },
    mumbai:{
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts:[privateKey]
    },
    mainnet:{
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts:[privateKey]
    }
  },
  solidity: "0.8.4",
  paths:{
    artifacts:'./src/artifacts'
}
};
