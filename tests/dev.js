"use strict";
/**
 * Work in progress dev file.
 * This file is meant to be used when working on your lib.
 * Useful when trying to get something working before it's testable.
 */
exports.__esModule = true;
var index_1 = require("../dist/index");
//const onClicked = Signal.fromEvent(document, 'click');
//const eventSignal = new EventSignal<MouseEvent>( document, 'click' );
var HandlerTest = /** @class */ (function () {
    function HandlerTest(uid) {
        this.onTestSignal = new index_1.Signal();
        this._uid = uid;
        this.onTestSignal.add(this, this.handler);
    }
    HandlerTest.prototype.handler = function () {
        console.log('Handler ', this._uid);
    };
    HandlerTest.prototype.dispose = function () {
        this.onTestSignal.remove(this, this.handler);
    };
    return HandlerTest;
}());
var allHandlerTests = [];
for (var i = 0; i < 20; i++) {
    var test = new HandlerTest(i);
    allHandlerTests.push(test);
}
allHandlerTests.map(function (test) { return test.onTestSignal.dispatch(); });
allHandlerTests[5].dispose();
allHandlerTests.map(function (test) { return test.onTestSignal.dispatch(); });
//allHandlerTests.map( test => test.dispose() );
//allHandlerTests.map( test => test.onTestSignal.dispatch() );
/*

const classicSignal = new Signal<[number|void]>();


//classicSignal.add(this, (object) =>
//{
//	console.log('Signal', object.test);
//});


classicSignal.add( response =>
{
    console.log('Signal', response);
});

classicSignal.dispatch( 1 );
//classicSignal.dispatch('test');
//classicSignal.dispatch( null );
//classicSignal.dispatch({ trop: 'bien' });
classicSignal.dispatch();

*/
/*
const objectStateSignal = new StateSignal<{ on: boolean }>({ on: false });


objectStateSignal.add( state =>
{
    // FIXME : state.otherProp devrait lever une erreur TS
    console.log('State signal', state, state.otherProp);
});


objectStateSignal.dispatch({ on: true });
objectStateSignal.dispatch({ on: true });
objectStateSignal.dispatch({ on: false });
objectStateSignal.dispatch({ on: false });
objectStateSignal.dispatch({ on: true });
objectStateSignal.dispose();


const simpleStateSignal = new StateSignal<boolean>(false);


simpleStateSignal.add( state =>
{
    console.log('Simple state signal', state);
});


simpleStateSignal.dispatch( true );
simpleStateSignal.dispatch( true );
simpleStateSignal.dispatch( false );
simpleStateSignal.dispatch( false );
simpleStateSignal.dispatch( true );
simpleStateSignal.dispose();
*/ 
