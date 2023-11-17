const [count, setCount] = useState(0)
let url = 'https://eg2xwgx5induvdlzwszhjxbw6u.multibaas.com/api/v0/chains/ethereum/addresses/electicitylabel1/contracts/electricitylabel/methods/getElectricityRecords';
let options: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzAwMjQ3NTkzLCJqdGkiOiI0MmNlODAzNi0xODBkLTQ5ODctYjViNy1mMmVkNTUxMGM4NmUifQ.PGD9JU09wQvRkUhMfrLcn7UOikQ3KPnU2CRi2ndVTTU'
  },
  body: JSON.stringify({
    "args": ["0x85Ec95865AD3F912213f105d4f44e132B381f719"],
    "from": "0x85Ec95865AD3F912213f105d4f44e132B381f719"
  })
};
fetch(url, options)
.then(response => response.json())
.then(data => {
  if (data.result && Array.isArray(data.result.output)) {
    data.result.output.forEach((record: {amount: number, electricityType: number, method: number}) => {
      console.log(`Amount: ${record.amount}, Electricity Type: ${record.electricityType}, Method: ${record.method}`);
    });
  } else {
    console.log('Data is not in the expected format:', data);
  }
})
.catch(error => console.error('Error:', error));