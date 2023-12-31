mod types; 
contract Voting {
// aztec core library imports
    use dep::aztec::{
	context::{PrivateContext, Context}, note::{ 
	    note_header::NoteHeader, utils as note_utils, // used to generate hashes and nullifiers
	}, selector::compute_selector, // used to compute function selector for calling a function 
	 state_vars::{
	    map::Map, public_state::PublicState,
	}, types::type_serialization::{ // serialization methods for using booleans and aztec addresses
	    bool_serialization::{BoolSerializationMethods,
	    BOOL_SERIALIZED_LEN},
	    aztec_address_serialization::{AztecAddressSerializationMethods,
	    AZTEC_ADDRESS_SERIALIZED_LEN},
	}, types::address::{AztecAddress}, hash::pedersen_hash, // hash for creating nullifier

    }; 
    use dep::value_note::{ // used for compute_note_hash_and_nullifier
	    balance_utils, value_note::{
		ValueNote, ValueNoteMethods, VALUE_NOTE_LEN,
	    },
    }; 
    use dep::safe_math::SafeU120; // like OZ safemath library 

    use crate::types::{SafeU120SerializationMethods, SAFE_U120_SERIALIZED_LEN};  // serialization methods for using u120

// create storage struct
// vars that will be stored in persistant state
struct Storage {
    admin: PublicState<AztecAddress, AZTEC_ADDRESS_SERIALIZED_LEN>, // admin can end vote
    tally: Map<PublicState<SafeU120, SAFE_U120_SERIALIZED_LEN>>, // we will store vote as key and number of votes as value
    voteEnded: PublicState<bool, BOOL_SERIALIZED_LEN>, // voteEnded is boolean
} 

// implementation block for storage
// required for now but soon to be abstracted
// init function is called when you call storage from a function like storage.whatever
    impl Storage {
	fn init(context: Context) -> Self {
	    Storage {
		 admin: PublicState::new(
		    context, 
            1, // storage slot. this can be anything except 0. it is hashed, and hash on 0 = 0
            AztecAddressSerializationMethods,
		), 
        tally: Map::new(
		    context, 
            2, 
            |context, slot| {
			PublicState::new(
			    context,
                slot, 
                SafeU120SerializationMethods,
			)
		    },
		 ),
		  voteEnded: PublicState::new(
		    context, 
            3, 
            BoolSerializationMethods,
		)
	    } }
	}

    #[aztec(private)] // annotation to mark function as private and expose private context
    fn constructor(admin: AztecAddress) { // called when contract is deployed 
        context.call_public_function( // we cannot update public state directly from private function but we can call public function (which queues it)
            context.this_address(), // address that calls public function. here we are using contract address for privacy
            compute_selector("set_admin((Field))"), // selector of function to call
            [admin.address]); // paramters for function we call
    }

    #[aztec(public)] // annotation to mark function as public and expose public context
    fn set_admin(admin: AztecAddress) {
	    storage.admin.write(admin); 
        storage.voteEnded.write(false);
    }

    struct OneUseOnly { // struct for defining what goes in our nullifier
	    user: AztecAddress
    }


    impl OneUseOnly {  // impl block for nullifier struct 
	    pub fn new(user: AztecAddress) -> Self {  // create new struct for going inside nullifier
	        Self { user }
	}

	fn spend_private(self, context: &mut PrivateContext) { 
	    let user = self.user.address; 
        let slot = 69; 
        let nullifier = dep::std::hash::pedersen_hash([user, slot]); // create nullifier with pedersen hash
	    context.push_new_nullifier(nullifier, 0); // push nullifier to aztec, takes nullifier & nullified commitment (0 in our case)
	    }
    }

    #[aztec(private)]
    fn cast_vote(vote: Field)  {
        context.call_public_function(
	        context.this_address(),
	        compute_selector("add_to_tally_public(Field)"), 
            [vote],
	   );


	let user_nullifier = OneUseOnly::new(AztecAddress::new(context.msg_sender())); // create nullifier struct with msg_sender
	user_nullifier.spend_private(&mut context); // push nullifier
    }

    #[aztec(public)] 
    fn add_to_tally_public(vote: Field) {
        assert(storage.voteEnded.read()==false, "Vote has ended"); // race condition
        let amount = SafeU120::new(1); // can only add safeu20s to safeu120s so we make a new one with value of 1
	let new_tally = storage.tally.at(vote).read().add(amount);
        storage.tally.at(vote).write(new_tally);
     }

    #[aztec(public)] 
    fn end_vote() {
        assert(storage.admin.read().eq(AztecAddress::new(context.msg_sender())),
            "Only admin can end votes");
        storage.voteEnded.write(true);
    }

    unconstrained fn get_vote(vote: Field) -> u120 {
	    storage.tally.at(vote).read().value
    }

	// compute_note_hash_and_nullifier fn required in all contracts that manipulate private state
	// it is usually the exact same, but will differ if you use custom note types
    unconstrained fn compute_note_hash_and_nullifier( contract_address:
        Field, nonce: Field, storage_slot: Field, preimage: [Field;
        VALUE_NOTE_LEN], ) -> [Field; 4] { let note_header =
        NoteHeader::new(contract_address, nonce, storage_slot);
        note_utils::compute_note_hash_and_nullifier(ValueNoteMethods,
        note_header, preimage)
    }

}