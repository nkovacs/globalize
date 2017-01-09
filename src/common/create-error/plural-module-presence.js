import createError from "../create-error";

export default function() {
	return createError( "E_MISSING_PLURAL_MODULE", "Plural module not loaded." );
};
