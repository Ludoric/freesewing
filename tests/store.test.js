var expect = require("chai").expect;
var freesewing = require("../dist/index.js");

var pattern = new freesewing.Pattern();
var store = pattern.store;

it("Store should be a Map", () => {
  expect(store.data.toString()).to.equal("[object Map]");
});

it("Should set/get a store value", () => {
  store.set("foo", "bar");
  expect(store.get("foo")).to.equal("bar");
});

it("Should set a store value only if unset", () => {
  store.setIfUnset("few", "baz");
  store.setIfUnset("few", "schmoo");
  expect(store.get("few")).to.equal("baz");
});
