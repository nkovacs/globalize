import objectFilter from "../util/object/filter";
import numberNumberingSystem from "../number/numbering-system";

export default function( cldr ) {
	return objectFilter( cldr.main([
		"numbers",
		"currencyFormats-numberSystem-" + numberNumberingSystem( cldr )
	]), /^unitPattern/ );
};
