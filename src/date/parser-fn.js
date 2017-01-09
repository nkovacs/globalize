import validateParameterPresence from "../common/validate/parameter-presence";
import validateParameterTypeString from "../common/validate/parameter-type/string";
import dateParse from "./parse";
import dateTokenizer from "./tokenizer";

export default function( numberParser, parseProperties, tokenizerProperties ) {
	return function dateParser( value ) {
		var tokens;

		validateParameterPresence( value, "value" );
		validateParameterTypeString( value, "value" );

		tokens = dateTokenizer( value, numberParser, tokenizerProperties );
		return dateParse( value, tokens, parseProperties ) || null;
	};
};
