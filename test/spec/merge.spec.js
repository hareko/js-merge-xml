/* jshint node:true */
/* global MergeXML, describe, it, before, after, beforeEach, afterEach, expect */
"use strict";

describe('Instantiating object ', function() {
    var merger;

    it('works', function() {
        merger = new MergeXML();
        expect(merger).to.be.an('object');
    });

});

describe('Adding source', function() {
    var merger, a, b;

    it('strings works', function() {
        merger = new MergeXML();
        a = '<a/>';
        b = '<b/>';
        expect(merger.AddSource(a)).to.not.equal(false);
        expect(merger.AddSource(b)).to.not.equal(false);
    });

});

describe('Merging XML sources', function() {
    var merger, a, b;

    describe('with option join = undefined', function() {

        // TODO

    });

    describe('with option join = false', function() {

        it('succeeds if sources have a common root name', function() {
            merger = new MergeXML({
                join: false
            });
            a = '<r><a/></r>';
            b = '<r><b/></r>';
            merger.AddSource(a);
            merger.AddSource(b);
            expect(merger.Get(1)).to.equal('<r><a/><b/></r>');
        });

        it('fails to merge second source if sources do not have a common root name', function() {
            merger = new MergeXML({
                join: false
            });
            a = '<a/>';
            b = '<b/>';
            merger.AddSource(a);
            merger.AddSource(b);
            expect(merger.Get(1)).to.equal('<a/>');
        });

    });


    describe('with option updn = true or undefined', function() {
        var merger, a, b;

        it('merges sources by nodeName', function() {
            merger = new MergeXML({
                updn: true
            });
            a = '<a>' +
                '<c>s1</c>' +
                '<c>s3</c>' +
                '</a>';
            b = '<a>' +
                '<c>s1</c>' +
                '<b>s2</b>' +
                '<c>s4</c>' +
                '</a>';
            merger.AddSource(a);
            merger.AddSource(b);
            expect(merger.Get(1)).to.equal('<a><c>s1</c><c>s4</c><b>s2</b></a>');

            merger = new MergeXML();
            merger.AddSource(a);
            merger.AddSource(b);
            expect(merger.Get(1)).to.equal('<a><c>s1</c><c>s4</c><b>s2</b></a>');
        });

    });

    describe('with option updn = false', function() {
        var merger, a, b;

        it('merges sources by node position, discarding nodeName', function() {
            merger = new MergeXML({
                updn: false
            });
            a = '<a>' +
                '<c>s1</c>' +
                '<c>s3</c>' +
                '</a>';
            b = '<a>' +
                '<c>s1</c>' +
                '<b>s2</b>' +
                '<c>s4</c>' +
                '</a>';
            merger.AddSource(a);
            merger.AddSource(b);
            expect(merger.Get(1)).to.equal('<a><c>s1</c><c>s2</c><c>s4</c></a>');
        });
    });

});
