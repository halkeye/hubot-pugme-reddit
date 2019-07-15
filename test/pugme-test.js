process.env.EXPRESS_PORT = process.env.PORT = 0;

const Helper = require("hubot-test-helper");
require("should");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scriptHelper = new Helper("../src/pugme.js");
describe('pugme', function() {
  beforeEach(() => {
    room = scriptHelper.createRoom();
    room.robot.http = () => ({
      get: () => (cb) => cb(null, null, JSON.stringify(require('./reddit.json')))
    })
  });
  afterEach(() => { room.destroy(); });

  describe("help", () => {
    it("lists help", () => {
      room.robot.helpCommands().should.eql([
        "hubot pug bomb N - Get N pugs",
        "hubot pug me - Receive a pug"
      ]);
    });
  });
  describe("pug me", () => {
    beforeEach(() => {
      return room.user.say("Shell", "hubot pug me").then(() => sleep(125));
    });
    it("pug me should return one", () => {
      room.messages.length.should.be.eql(2)
      room.messages[0].should.be.eql([ "Shell", "hubot pug me" ])
      room.messages[1][0].should.be.eql('hubot')
      room.messages[1][1].should.startWith('https://')
    });
  });
  describe("pug bomb", () => {
    beforeEach(() => {
      return room.user.say("Shell", "hubot pug bomb").then(() => sleep(125));
    });
    it("pug bomb should return 6", () => {
      room.messages.length.should.be.eql(6)
      room.messages[0].should.be.eql([ "Shell", "hubot pug bomb" ])
      for (let i = 1; i < 6; i++) {
        room.messages[i][0].should.be.eql('hubot')
        room.messages[i][1].should.startWith('https://')
      }
    });
  });
  describe("pug bomb", () => {
    beforeEach(() => {
      return room.user.say("Shell", "hubot pug bomb 100").then(() => sleep(125));
    });
    it("pug bomb 100 should return the max number returned by reddit", () => {
      room.messages.length.should.be.eql(26)
      room.messages[0].should.be.eql([ "Shell", "hubot pug bomb 100" ])
      for (let i = 1; i < 26; i++) {
        room.messages[i][0].should.be.eql('hubot')
        room.messages[i][1].should.startWith('https://')
      }
    });
  });
});
