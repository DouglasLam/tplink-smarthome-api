/* eslint-env mocha */
/* eslint no-unused-expressions: ["off"] */

'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

module.exports = function (testDevice) {
  describe('Schedule', function () {
    let month;
    let year;

    before(() => {
      let today = new Date();
      month = today.getMonth() + 1;
      year = today.getFullYear();
    });

    describe('#getNextAction()', function () {
      it('should return schedule next action', function () {
        return expect(this.device.schedule.getNextAction()).to.eventually.have.property('err_code', 0);
      });
    });

    describe('#getRules()', function () {
      it('should return schedule rules', function () {
        return expect(this.device.schedule.getRules()).to.eventually.have.property('err_code', 0);
      });
    });

    describe('#deleteAllRules()', function () {
      it('should delete all rules', async function () {
        let addResponse = await this.device.schedule.addRule({ powerState: true, start: 60 });
        expect(addResponse, 'addRule').to.have.property('err_code', 0);
        expect(addResponse, 'addRule').to.have.property('id');

        let deleteResponse = await this.device.schedule.deleteAllRules();
        expect(deleteResponse).to.have.property('err_code', 0);

        let getResponse = await this.device.schedule.getRules();
        expect(getResponse).to.have.property('err_code', 0);
        expect(getResponse.rule_list).to.have.property('length', 0);
      });
    });

    describe('#deleteRule()', function () {
      it('should delete a rule', async function () {
        let addResponse = await this.device.schedule.addRule({ powerState: true, start: 60 });
        expect(addResponse, 'addRule').to.have.property('err_code', 0);
        expect(addResponse, 'addRule').to.have.property('id');

        let deleteResponse = await this.device.schedule.deleteRule(addResponse.id);
        expect(deleteResponse).to.have.property('err_code', 0);

        let getResponse = await this.device.schedule.getRules();
        expect(getResponse).to.have.property('err_code', 0);
        let rule = getResponse.rule_list.find((r) => r.id === addResponse.id);
        expect(rule).to.be.undefined;
      });
    });

    describe('#setOverallEnable()', function () {
      it('should enable', async function () {
        expect(await this.device.schedule.setOverallEnable(true)).to.have.property('err_code', 0);
      });
      it('should disable', async function () {
        expect(await this.device.schedule.setOverallEnable(false)).to.have.property('err_code', 0);
      });
    });

    describe('#getDayStats()', function () {
      it('should return day stats', function () {
        return expect(this.device.schedule.getDayStats(year, month)).to.eventually.have.property('err_code', 0);
      });
    });

    describe('#getMonthStats()', function () {
      it('should return day stats', function () {
        return expect(this.device.schedule.getMonthStats(year)).to.eventually.have.property('err_code', 0);
      });
    });

    if (testDevice.type !== 'simulated') {
      describe('#eraseStats()', function () {
        it('should return day stats', function () {
          if (this.testDevice.type !== 'simulated') this.skip();
          return expect(this.device.schedule.eraseStats()).to.eventually.have.property('err_code', 0);
        });
      });
    }
  });
};