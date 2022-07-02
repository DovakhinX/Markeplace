const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function () {
  it("Marketplace intial test", async function () {
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftAddress = nft.address;

    let listPrice = await market.getListingPrice();
    listPrice = listPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    await nft.createNft("grace1");
    await nft.createNft("grace2");

    await market.createMarketItem(nftAddress, 1, auctionPrice, {
      value: listPrice,
    });
    await market.createMarketItem(nftAddress, 2, auctionPrice, {
      value: listPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    await market
      .connect(buyerAddress)
      .createMarketSale(nftAddress, 1, { value: auctionPrice });

    let item = await market.fetchMarketItem();

    item=await Promise.all(item.map(async i=>{
      const tokenUri=await nft.tokenURI(i.tokenId)
      let item ={
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item;
    }))

    console.log("items:", item);
  });
});
