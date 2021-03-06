import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';
import EVMRevert from 'zeppelin-solidity/test/helpers/EVMRevert';

var Quadkey = artifacts.require('libraries/QuadkeyLib.sol');
const BigNumber = web3.BigNumber;
const BigInteger = require("big-integer")
var BinaryQuadkey = require("binaryquadkey");

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Quadkey', function ([_, crowdsaleOwner]) {

    before( async function() {
        this.qk = await Quadkey.new();
    })

    it('should be able to return zoom from a uint quadkey', async function() {
        let zoom7 = new BigNumber("18445618173802708992")
        let zoom8 = new BigNumber("18446462598732840960")
        let zoom9 = new BigNumber("18446673704965373952")
        const zoom7Mask = await this.qk.createZoomMask(7)
        const zoom8Mask = await this.qk.createZoomMask(8)
        const zoom9Mask = await this.qk.createZoomMask(9)
        zoom7.should.be.bignumber.equal(zoom7Mask);
        zoom8.should.be.bignumber.equal(zoom8Mask);
        zoom9.should.be.bignumber.equal(zoom9Mask);
    })

    it('should be able to detect children of parent quad keys', async function() {
        var binaryQuadkey1 = new BinaryQuadkey.fromQuadkey("02310102");
        var binaryQuadkey = new BinaryQuadkey.fromQuadkey("02310102301");
        var isChild = await this.qk.isChildWithinParent(binaryQuadkey.toString(), binaryQuadkey1.toString());
        isChild.should.be.true;
        isChild = await this.qk.isChildWithinParent(binaryQuadkey1.toString(), binaryQuadkey.toString());
        isChild.should.be.false;

        binaryQuadkey1 = new BinaryQuadkey.fromQuadkey("02");
        binaryQuadkey = new BinaryQuadkey.fromQuadkey("02310102");
        isChild = await this.qk.isChildWithinParent(binaryQuadkey.toString(), binaryQuadkey1.toString());
        isChild.should.be.true;

        binaryQuadkey1 = new BinaryQuadkey.fromQuadkey("0231010223");
        binaryQuadkey = new BinaryQuadkey.fromQuadkey("0231010223");
        isChild = await this.qk.isChildWithinParent(binaryQuadkey.toString(), binaryQuadkey1.toString());
        isChild.should.be.true;

        binaryQuadkey1 = new BinaryQuadkey.fromQuadkey("0231010212322");
        binaryQuadkey = new BinaryQuadkey.fromQuadkey("02310102023223");
        isChild = await this.qk.isChildWithinParent(binaryQuadkey.toString(), binaryQuadkey1.toString());
        isChild.should.be.false;
    })

    it('should be able to check valid zoom level', async function() {
        let zoom16 = new BinaryQuadkey.fromQuadkey("0231010202322300");
        let zoom17 = new BinaryQuadkey.fromQuadkey("02310102023223013");
        let zoom12 = new BinaryQuadkey.fromQuadkey("023101020232");

        let is16 = await this.qk.isZoom(zoom16.toString(), 16);
        let is15no = await this.qk.isZoom(zoom16.toString(), 15);
        is16.should.be.true
        is15no.should.be.false
        let is17 = await this.qk.isZoom(zoom17.toString(), 17);
        is17.should.be.true
        let is12 = await this.qk.isZoom(zoom12.toString(), 12);
        let is16no = await this.qk.isZoom(zoom12.toString(), 16);
        is12.should.be.true
        is16no.should.be.false
    })
});