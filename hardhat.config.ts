import "@nomicfoundation/hardhat-toolbox";

module.exports = {
  solidity: "0.8.27",
  networks: {
    polygonAmoy: {
      url: "https://api-amoy.polygonscan.com/api",
      accounts: ["8ccc03ea4075885b657d7d4923b582da39fb05567a36d1a02dfe762094b02206"],
      chainId: 80002
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: "YQKH1RWC1DYBAD2GP41HYE6IYKYNKAB9HP"
    },
  }
};