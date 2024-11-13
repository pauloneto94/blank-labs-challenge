# Paulo Neto Basic dApp for RWA Investing

## Available at
[blank-labs-challenge.vercel.app](https://blank-labs-challenge.vercel.app)

## Description

This project allow users to connect with their wallets in polygon amoy network and exchange USDC tokens to BLTM Tokens an vice versa.
You can also see the last minted and burned tokens in a list of transactions.

## Technologies used:
- Next.js
- Tailwind CSS
- Typescript
- React
- Web3.js
- Solidity
- Hardhat

## Setup Instructions

- Copy .env.example to .env and add variables
```sh
cp .env.example .env
```
- Install dependencies
```sh
npm install
```
- Run development server
```sh
npm run dev
```

## Approach and Challenges

For that project I had to create 2 contracts and deploy them in the polygon amoy network using Hardhat. To deploy the contract I created a deploy script to handle deploy.
For the interactions with the contracts I worked with ether lib and to connect with the network web3modal lib was used.
Faced some challenges to deploy the contracts to the network and to interact with them, also never have created unit tests for solidity so that was a big challenge for me.
Need some improvements in the frontend to handle permissions to the admin portal and disable buttons if wallet is not connected. Also should add some events to the contracts.