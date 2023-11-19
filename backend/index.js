import {
    ExtendedNote,
    Fr,
    GrumpkinScalar,
    Note,
    computeMessageSecretHash,
    createDebugLogger,
    createPXEClient,
    getSandboxAccountsWallets,
    getSchnorrAccount,
    waitForSandbox,
    Contract, 
  } from '@aztec/aztec.js';

import CounterArtifact  from '../contracts/counter/target/Counter.json' assert { type: "json" };



  import { format } from 'util';
  const { PXE_URL = 'http://localhost:8080' } = process.env;
  
  async function main() {
    const pxe = createPXEClient(PXE_URL);
    const [ownerWallet] = await getSandboxAccountsWallets(pxe);

    const token = await Contract.deploy(ownerWallet, CounterArtifact, [ownerWallet.getCompleteAddress()])
    .send()
    .deployed();

    console.log(`Token deployed at ${token.address.toString()}`);

    const addresses = {
        token: token.address.toString(),
      };
    
    
    main().catch((err) => {
      console.error(`Error in deployment script: ${err}`);
      process.exit(1);
    });


  ////////////// CREATE THE CLIENT INTERFACE AND CONTACT THE SANDBOX //////////////
      const logger = createDebugLogger('token');
  
      // We create PXE client connected to the sandbox URL
      // Wait for sandbox to be ready
      await waitForSandbox(pxe);
  
      const nodeInfo = await pxe.getNodeInfo();
  
      logger(format('Aztec Sandbox Info ', nodeInfo));
  

  }
main();
