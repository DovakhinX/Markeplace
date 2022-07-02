
const hre = require("hardhat");

async function main() {
 
  const NftMarket = await hre.ethers.getContractFactory("NftMarket");
  const nftmarket = await NftMarket.deploy();
  await nftmarket.deployed();
  console.log("NFT deployed to",nftmarket.address)


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
