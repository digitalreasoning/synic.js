
describe("Processes", function () {
    var synicClient;

    beforeEach(function () {
        synicClient = new SynicClient();
        jasmine.Ajax.install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    it("Test listProcesses", function () {
        expect(synicClient.listProcesses).toBeTruthy();
    });
});