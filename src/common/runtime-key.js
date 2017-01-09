import stringHash from "../util/string/hash";

export default function( fnName, locale, args, argsStr ) {
	var hash;
	argsStr = argsStr || JSON.stringify( args );
	hash = stringHash( fnName + locale + argsStr );
	return hash > 0 ? "a" + hash : "b" + Math.abs( hash );
};
