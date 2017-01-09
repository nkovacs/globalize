import validateParameterType from "../parameter-type";
import isPlainObject from "../../../util/is-plain-object";

export default function( value, name ) {
	validateParameterType(
		value,
		name,
		value === undefined || isPlainObject( value ),
		"Plain Object"
	);
};
