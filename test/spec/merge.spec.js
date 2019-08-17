/* jshint node:true */
/* global MergeXML, describe, it, before, after, beforeEach, afterEach, expect */
'use strict';

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
            expect(merger.Get(1).trim()).to.equal('<r><a/><b/></r>');
        });

        it('fails to merge second source if sources do not have a common root name', function() {
            merger = new MergeXML({
                join: false
            });
            a = '<a/>';
            b = '<b/>';
            merger.AddSource(a);
            merger.AddSource(b);

            expect(merger.Get(1).trim()).to.equal('<a/>');
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
            expect(merger.Get(1).trim()).to.equal('<a><c>s1</c><c>s4</c><b>s2</b></a>');

            merger = new MergeXML();
            merger.AddSource(a);
            merger.AddSource(b);

            expect(merger.Get(1).trim()).to.equal('<a><c>s1</c><c>s4</c><b>s2</b></a>');
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

            expect(merger.Get(1).trim()).to.equal('<a><c>s1</c><c>s2</c><c>s4</c></a>');
        });
    });

    describe('with namespaced attributes', function() {
        var merger;
        var ns = 'https://github.com/enketo/merge-xml';

        it('correctly adds namespaced attributes from second source', function() {
            merger = new MergeXML({
                join: false
            });
            a = '<a>' +
                '<c>s1</c>' +
                '</a>';
            b = '<a xmlns:enk="' + ns + '">' +
                '<c enk:custom="something">s2</c>' +
                '</a>';
            merger.AddSource(a);
            merger.AddSource(b);

            expect(merger.error.code).to.equal('');
            expect(merger.error.text).to.equal('');
            expect(merger.Get(1).trim()).to.equal('<a xmlns:enk="' + ns + '"><c enk:custom="something">s2</c></a>');
            // in IE11 and below, merger.Get(0) returns an ActiveXObject we use the internal "Query" function
            expect(merger.Query('//c').attributes[0].localName).to.equal('custom'); // fails in IE because
            expect(merger.Query('//c').attributes[0].namespaceURI).to.equal(ns);
        })

    })

    describe('with sources that have and do not have a UTF encoding declaration', function() {
        var merger;
        var a = '<?xml version="1.0"?>' +
            '<a><c>s1</c></a>';
        var b = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<a><c>s2</c></a>';

        it('undeclared and UTF-8', function() {
            merger = new MergeXML({
                join: false
            });
            merger.AddSource(a);
            merger.AddSource(b);

            expect(merger.error.code).to.equal('');
            expect(merger.error.text).to.equal('');
            expect(merger.Get(1)).to.contain('<a><c>s2</c></a>');
        });

        it('UTF8 and undeclared', function() {
            merger = new MergeXML({
                join: false
            });
            merger.AddSource(b);
            merger.AddSource(a);

            expect(merger.error.code).to.equal('');
            expect(merger.error.text).to.equal('');
            expect(merger.Get(1)).to.contain('<a><c>s1</c></a>');
        });

    });

});
