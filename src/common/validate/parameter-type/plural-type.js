import validateParameterType from "../parameter-type";

export default function( value, name ) {
	validateParameterType(
		value,
		name,
		value === undefined || value === "cardinal" || value === "ordinal" || value === "both",
		"String \"cardinal\" or \"ordinal\" or \"both\""
	);
};
