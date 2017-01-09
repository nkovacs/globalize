import validateParameterPresence from "../common/validate/parameter-presence";
import validateParameterTypeString from "../common/validate/parameter-type/string";
import numberParse from "./parse";

export default function( properties ) {
	return function numberParser( value ) {
		validateParameterPresence( value, "value" );
		validateParameterTypeString( value, "value" );

		return numberParse( value, properties );
	};

};
