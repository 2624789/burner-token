 // scripts/deploy-burner.js

const hre = require('hardhat');

// 10000 * 1e18
const INITIAL_SUPPLY = '10000000000000000000000';

async function main() {
  const Burner = await hre.ethers.getContractFactory('Burner');
  console.log('Deploying Burner...');
  const burner = await Burner.deploy(INITIAL_SUPPLY);

  await burner.deployed();
  console.log('Burner deployed to:', burner.address);

  // Save contract's artifacts and address in the frontend directory
  saveFrontendFiles(burner);
}

function saveFrontendFiles(burner) {
  console.log('Saving frontend files...');
  const fs = require('fs');
  const contractsDir = __dirname + '/../frontend/src/contracts';

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + '/contract-address.json',
    JSON.stringify({
      Burner:  burner.address,
    }, undefined, 2)
  );

  // Burner
  const BurnerArtifact = artifacts.readArtifactSync('Burner');

  fs.writeFileSync(
    contractsDir + '/Burner.json',
    JSON.stringify(BurnerArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
