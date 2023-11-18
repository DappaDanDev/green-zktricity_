import { useEffect, useState, useRef } from 'react'
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

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




function App() {
  let values: Data | undefined; 


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
          if (values && values.result && Array.isArray(values.result.output)) {
            tree = StandardMerkleTree.of(values.result.output.map(record => [record.amount, record.electricityType, record.method]), ["uint256", "uint8", "uint8"]);
            console.log('Merkle Root:', tree.root);
          } else {
            console.log('Values are not defined or not in the correct format');
          }
  
          if (tree) { // Check if tree is not null before using it
            console.log('Merkle Root:', tree.root);
            console.log(tree.render());


          }
        }
      })
      .catch((error: Error) => console.error('Error:', error))
  }, []);



  return (
    <div>
      <p>Test</p>
    
    </div>
  )
}

export default App