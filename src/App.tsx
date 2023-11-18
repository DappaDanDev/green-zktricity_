import { useEffect, useState, useRef } from 'react'
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { Web3AuthModalPack, Web3AuthConfig } from '@safe-global/auth-kit'
import { Web3AuthOptions } from '@web3auth/modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { ethers} from 'ethers';
import { InfuraProvider } from "ethers"

import './App.css'

type Record = {
  amount: number;
  electricityType: number;
  method: number;
};

type Data = {
  result?: {
    output?: Record[];
  };
};
const provider = new ethers.JsonRpcProvider ('https://magical-soft-gas.ethereum-goerli.quiknode.pro/a6296e9c8f942b9ac52a45d9aff0b3da907a1e0a/'); // Replace with your Infura Project ID



function App() {
  let values: Data | undefined; 
  // @ts-ignore
  const signer = new ethers.Wallet('7f0c3320c461ad52e20da3fe3e3fb104dfbcaaf406d119e2ed7886f1c6b93947' , provider);


const contractAddress = '0x83F1016BC42bD7E58505FFc4100B7426A6561826'; // Replace with your contract address
const abi = [  {
  "inputs": [],
  "name": "getMerkleRoot",
  "outputs": [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "merkleRoot",
  "outputs": [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "bytes32",
      "name": "_merkleRoot",
      "type": "bytes32"
    }
  ],
  "name": "storeMerkleRoot",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}
  
   ]

const contract = new ethers.Contract(contractAddress, abi, signer);

const getRoot = async () => { 
  const curretRoot = await contract.getMerkleRoot();
  console.log("The current root is:" ,{curretRoot});

}

  const [count, setCount] = useState(0)
  let url = 'https://j2hyhqqyc5drjjtk7t37bg2264.multibaas.com/api/v0/chains/ethereum/addresses/electrictylabels/contracts/electricitylabels/methods/getElectricityRecords';
  let options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzAwMjY0OTk4LCJqdGkiOiI2M2MyMjFmOC1lNzcwLTRhYTAtOTRmOC04MDI4ZjdiNTkyOWQifQ.99ANV7capYMzhwEAPvhzh51_jgsZcQnyjFst7s-Wca8'
    },
    body: JSON.stringify({
      "args": ["0x85Ec95865AD3F912213f105d4f44e132B381f719"],
      "from": "0x85Ec95865AD3F912213f105d4f44e132B381f719"
    })
  };

  function categorizeAndSum(records: Record[]): {[key: string]: number} {
    // Initialize the categories
    let categories: {[key: string]: number} = {
      'Type1Method1': 0,
      'Type1Method0': 0,
      'Type0Method1': 0,
      'Type0Method0': 0
    };
  
    // Iterate over the records
    records.forEach(record => {
      // Check the category of the record and add the amount to the corresponding category
      if (record.electricityType === 1 && record.method === 1) {
        categories['Type1Method1'] += record.amount;
      } else if (record.electricityType === 1 && record.method === 0) {
        categories['Type1Method0'] += record.amount;
      } else if (record.electricityType === 0 && record.method === 1) {
        categories['Type0Method1'] += record.amount;
      } else if (record.electricityType === 0 && record.method === 0) {
        categories['Type0Method0'] += record.amount;
      }
    });
  
    return categories;
  }




  useEffect(() => {
    fetch(url, options)
      .then(response => response.json())
      .then((data: Data) => {
        if (data.result && Array.isArray(data.result.output)) {
          data.result.output.forEach((record: Record) => {
            console.log(`Amount: ${record.amount}, Electricity Type: ${record.electricityType}, Method: ${record.method}`);
          });
          values = data; // Assign the data to the values variable
  
          // Create the Merkle tree here, after values has been updated
          let tree = null; // Initialize tree to null
          let categories = categorizeAndSum(data.result.output);
          console.log(categories);
          if (values && values.result && Array.isArray(values.result.output)) {
            tree = StandardMerkleTree.of(values.result.output.map(record => [record.amount, record.electricityType, record.method]), ["uint256", "uint8", "uint8"]);
            console.log('Merkle Root:', tree.root);
          } else {
            console.log('Values are not defined or not in the correct format');
          }
  
          if (tree) { // Check if tree is not null before using it
            console.log('Merkle Root:', tree.root);
            console.log(tree.render());
            contract.storeMerkleRoot(tree.root)
          .then((transaction) => {
    console.log('Transaction:', transaction);
  })
  .catch((error) => {
    console.error('Error:', error);
  });


          }
        }
      })
      .catch((error: Error) => console.error('Error:', error))
  }, []);


  const authOptions: Web3AuthOptions = {
    clientId: 'BLmW2sJk1rYDmxzD0X5pO7LtQgC2HUoH4wrRbmZHJfWIdBHY5RqeXEpco0Lni_KiUyS6vbzJQFAMMeZKwgtiRMw', // https://dashboard.web3auth.io/
    web3AuthNetwork: 'testnet',
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x5',
      // https://chainlist.org/
      rpcTarget: 'https://rpc.ankr.com/eth_goerli'
    },
    uiConfig: {
      theme: 'dark',
      loginMethodsOrder: ['google', 'facebook']
    }
  }
 

  const web3AuthConfig: Web3AuthConfig = {
    txServiceUrl: 'https://safe-transaction-goerli.safe.global'
  }

  async function initializeWeb3Auth() {
    const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
    await web3AuthModalPack.init({ options: authOptions});
  }
  
  initializeWeb3Auth();


  return (
    <div>
      <p>Test</p>
    
    </div>
  )
}

export default App