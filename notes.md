0xE0a08E443fff2968AF5dd98ec59c1f7BAf48D9A1 - Contract Address


https://eg2xwgx5induvdlzwszhjxbw6u.multibaas.com/api/v0/chains/goerli/addresses/0xE0a08E443fff2968AF5dd98ec59c1f7BAf48D9A1/contracts/electicitylabel1/methods/getElectricityRecords


{
"args": ["0x85Ec95865AD3F912213f105d4f44e132B381f719"]
}

0xf3d798577b21d84F7E761C779F8FF2Ff4564FCf7

mod types; 
contract Counter {
    use dep::aztec::{
	context::{PrivateContext, Context}, note::{
	    note_header::NoteHeader, utils as note_utils,
	}, selector::compute_selector,
	 state_vars::{
	    map::Map, public_state::PublicState, singleton::Singleton,
	}, types::type_serialization::{
	    bool_serialization::{BoolSerializationMethods,
	    BOOL_SERIALIZED_LEN},
	    aztec_address_serialization::{AztecAddressSerializationMethods,
	    AZTEC_ADDRESS_SERIALIZED_LEN},
	}, types::address::{AztecAddress}, hash::pedersen_hash,

    }; 
    use dep::value_note::{
	    balance_utils, value_note::{
		ValueNote, ValueNoteMethods, VALUE_NOTE_LEN,
	    },
    }; 
    use dep::safe_math::SafeU120; 

    use crate::types::{SafeU120SerializationMethods, SAFE_U120_SERIALIZED_LEN};

    struct Storage {
        green_wattage_generated: PublicState<SafeU120, SAFE_U120_SERIALIZED_LEN>,
        grey_wattage_generated: PublicState<SafeU120, SAFE_U120_SERIALIZED_LEN>,
        green_wattage_consumed: PublicState<SafeU120, SAFE_U120_SERIALIZED_LEN>,
        grey_wattage_consumed:  PublicState<SafeU120, SAFE_U120_SERIALIZED_LEN>,
    }

    impl Storage {
	    fn init(context: Context) -> Self {
	        Storage {
		        green_wattage_generated: PublicState::new(
		        context, 
                1, 
                SafeU120SerializationMethods,
		), 
                grey_wattage_generated: PublicState::new(
		        context, 
                2, 
                SafeU120SerializationMethods,
		 ),
		        green_wattage_consumed: PublicState::new(
                context, 
                3, 
                SafeU120SerializationMethods,
		)
                grey_wattage_consumed: PublicState::new(
                context, 
                4, 
                SafeU120SerializationMethods,
                )
	    } }
	}


    #[aztec(public)]
    fn generated_green (amount: Field) {// Write a public function that returns it from the private string 
        let amount = SafeU120::new(amount);
        storage.green_wattage_generated.add(amount);
    }
    #[aztec(public)]

    fn generated_grey (amount: Field) {// Write a public function that returns it from the private string 
        let amount = SafeU120::new(amount);
        storage.grey_wattage_generated.add(amount);
    }
    #[aztec(public)]

    fn consumed_green (amount: Field) {// Write a public function that returns it from the private string 
        let amount = SafeU120::new(amount);
        storage.green_wattage_consumed.add(amount);
    }

    #[aztec(public)]

    fn consumed_grey (amount: Field) {// Write a public function that returns it from the private string 
        let amount = SafeU120::new(amount);
        storage.grey_wattage_consumed.add(amount);
    }
   

 

    #[aztec(private)] 

    fn calculate_totals (green_wattage_generated: Field, green_wattage_consumed: Field, grey_wattage_generated: Field, grey_wattage_consumed: Field) {
        
        let green_gen_selector = compute_selector("generated_green(Field)");
        let green_gen_total = context.call_public_function(context.this_address(), green_gen_selector, [green_wattage_generated]);
      
      
        let grey_gen_selector = compute_selector("generated_grey(Field)");
        let grey_gen_total = context.call_public_function(context.this_address(), grey_gen_selector, [grey_wattage_generated]);

        let green_con_selector = compute_selector("consumed_green(Field)");
        let green_con_total = context.call_public_function(context.this_address(), green_con_selector, [green_wattage_consumed]);


        let grey_con_selector = compute_selector("consumed_grey(Field)");
        let grey_con_total = context.call_public_function(context.this_address(), grey_con_selector, [grey_wattage_consumed]);


        assert(green_gen_total.eq(green_con_total), "Green Electricity Consumed and Generated must be equal");
        assert(grey_gen_total.eq(grey_con_total), "Gray Electricity consumed and generated must be equal");
    

     }
  



   

       



}