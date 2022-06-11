 // scripts/deploy-burner.js

const hre = require("hardhat");

// 10000 * 1e18
const INITIAL_SUPPLY = '10000000000000000000000';

async function main() {
  const Burner = await hre.ethers.getContractFactory("Burner");
  console.log('Deploying Burner...');
  const burner = await Burner.deploy(INITIAL_SUPPLY);

  await burner.deployed();
  console.log("Burner deployed to:", burner.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
