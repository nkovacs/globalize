import validateParameterType from "../parameter-type";

export default function( value, name ) {
	validateParameterType( value, name, value === undefined || Array.isArray( value ), "Array" );
};
