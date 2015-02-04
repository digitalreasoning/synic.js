
describe("Knowledge Graphs", function () {
    var synicClient = new SynicClient();


    beforeEach(function () {
        jasmine.Ajax.install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    it("Existance", function () {
        expect(synicClient).toBeTruthy();
    });

    it("Test listActiveKGs", function () {
        synicClient.listActiveKGs().then(function (kgs) {
             kgs.forEach(function (kg) {
                 expect(kg.hasOwnProperty('processes')).toBe(true);
             });
        });
    });

    it("Test listKGs", function () {
        synicClient.listKGs().then(function (kgs) {
            expect(kgs.length).toBe(1);
        });
    });
});