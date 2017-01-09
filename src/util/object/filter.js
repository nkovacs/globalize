export default function( object, testRe ) {
	var key,
		copy = {};

	for ( key in object ) {
		if ( testRe.test( key ) ) {
			copy[ key ] = object[ key ];
		}
	}

	return copy;
};
