import createError from "./create-error";

export default function( code, message, check, attributes ) {
	if ( !check ) {
		throw createError( code, message, attributes );
	}
};
