# Green Zktricity 

Zero Knowledge is sooooo hot right now! Do you know what else is so hot right now? THE EARTH! 

Green Zkrciticty brings the power of Zero Knowledge to contribute to combating Climate Change. This is done by providing a scalable and privacy
preserving way to label electricity as coming from either green sources such as wind/solar or grey sources like burning coal.

![Diagram Picture](/img/diagram2.png)


## Why is this important? (Or was it just something fun to do in between playing with cats)

Labeling electricity is important to increase the use of green energy usage. Being able to tell the difference between green and grey sources helps with consumer trust and any government programs to increase green energy usage. Given what is at stake, this has created a system that is open to fraud at worst and number trickery at best. 


The data shows green resources are still dwarfed by grey resources. Just look at Turkey's numbers: 
![Turkey Diagram](/img/Primary_energy_supply_in_Turkey.svg.png)


## Why Blockchain? (If this wasn't ETH Global, Would you still build this the same way?)
Outside of the weekly crypto conference, blockchains are appreciated by enterprises because they are a neutral platform to conduct business and operations. Where they fall is in both scalability and privacy due to their openness which for this use case both are needed. 


## Why ZK? (Are you just looking for investors?)
ZK adds both a layer to be more efficient and private. Privacy is important here because a consumer's electricity consumption can be linked to other habits like a daily schedule, traveling, and household numbers. It is important that the calculation to confirm that the calculation to confirm that the amount of both green and grey energy generated and consumed is equal and is also kept private. This prevents the ability for any false reporting by generators. 



## How it Works 
### Wallet Interaction 
Wallets are created via Aztec.JS - This simulates a new consumer or electricity generator onboards to the network. This is done programmatically: 



### Smart Contract 
A deployed Smart Contract via the Aztec Sandbox handles: 
- Messages are stored from both consumers and generators on either the amount of electricity generated or consumed and what type. 

```
 struct Storage {
        green_wattage_generated: PublicState<SafeU120, SAFE_U120_SERIALIZED_LEN>,
        grey_wattage_generated: PublicState<SafeU120, SAFE_U120_SERIALIZED_LEN>,
        green_wattage_consumed: PublicState<SafeU120, SAFE_U120_SERIALIZED_LEN>,
        grey_wattage_consumed:  PublicState<SafeU120, SAFE_U120_SERIALIZED_LEN>,
    }

```

- The totals for each type are grouped so they can be compared 

```
 fn generated_green (amount: Field) 
        let amount = SafeU120::new(amount);
        storage.green_wattage_generated.write(amount);

```

- The totals of green energy generated vs green energy are compared. The same with grey energy consumed/generated. This is done under a Private function using Aztec which means only a certain address can access this information. If the amount generated and consumed do not equal each other, the function is not completed. 

What this means is that if I was a generator, I could not make up how much green energy I have generated if there is not the same amount of consumption (reported by consumers) equal to it. 

```
 assert(green_gen_total == green_con_total, "Green Electricity Consumed and Generated must be equal");
assert(grey_gen_total == grey_con_total, "Gray Electricity consumed and generated must be equal");

```

### Public Data 

After some time, the contract will communicate on the L2 of Aztec and will send a message to the L1 to update its information. To simulate this, I have deplored a contract using CurveGrid.

```
 function recordElectricity(address _address, uint _amount, ElectricityType _electricityType, MethodType _method) public onlyAddress(_address) {
        Electricity memory newRecord = Electricity({
            amount: _amount,
            electricityType: _electricityType,
            method: _method
        });

```
The contract receives the messages and stores the total of each source and electricity type. 
```
function getElectricityRecords(address _address) public view onlyAddress(_address) returns (Electricity[] memory) {
        return electricityRecords[_address];
    }
```

## What is Left to Build 
- Using an Account Abstraction service, creating accounts for each of the meters to easily send messages to the smart contract. I mean, can you imagine someone in a coal mine or wind farm having to set up Metamask??? 

- Communication between Aztec and EVM 

- An actual front-end for monitoring/user interaction 