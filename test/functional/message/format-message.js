define([
	"globalize",
	"json!cldr-data/supplemental/likelySubtags.json",
	"json!cldr-data/supplemental/plurals.json",
	"json!cldr-data/supplemental/ordinals.json",
	"../../util",

	"globalize/message",
	"globalize/plural"
], function( Globalize, likelySubtags, plurals, ordinals, util ) {

QUnit.module( ".formatMessage( path [, variables] )", {
	setup: function() {
		Globalize.load( likelySubtags );
		Globalize.load( plurals );
		Globalize.load( ordinals );
		Globalize.loadMessages({
			en: {
				greetings: {
					hello: "Hello, {name}"
				}
			},
			he: {
				breadcrumb: "{0} >> {1} >> {2}",
			}
		});
	},
	teardown: util.resetCldrContent
});

QUnit.test( "should validate parameters", function( assert ) {
	util.assertParameterPresence( assert, "path", function() {
		Globalize( "en" ).formatMessage();
	});

	util.assertPathParameter( assert, "path", function( invalidValue ) {
		return function() {
			Globalize( "en" ).formatMessage( invalidValue );
		};
	});

	util.assertMessageVariablesType( assert, "variables", function( invalidValue ) {
		return function() {
			Globalize( "en" ).formatMessage( "greetings/hello", invalidValue );
		};
	});
});

QUnit.test( "should format a message", function( assert ) {
	assert.equal( Globalize( "en" ).formatMessage( "greetings/hello", {
		name: "Beethoven"
	}), "Hello, Beethoven" );
});

QUnit.test( "should support BiDi structured text", function( assert ) {
	assert.equal( Globalize( "he" ).formatMessage(
		"breadcrumb",
		[ "Mozart", "Bethoven", "Dvorzak" ],
		{ setBiDiSupport: true }
	), "\u200FMozart\u200F >> \u200FBethoven\u200F >> \u200FDvorzak\u200F" );
});

});
