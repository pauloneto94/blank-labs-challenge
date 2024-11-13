import "@nomicfoundation/hardhat-toolbox";

module.exports = {
  solidity: "0.8.27",
  networks: {
    polygonAmoy: {
      url: "https://rpc-amoy.polygon.technology/",
      accounts: [process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY],
      chainId: 80002
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: "YQKH1RWC1DYBAD2GP41HYE6IYKYNKAB9HP"
    },
  }
};