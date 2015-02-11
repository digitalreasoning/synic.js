
describe("Knowledge Graphs", function () {
    var synicClient;

    var kgResp = [
        {
            name: 'clark2',
            db: 'default',
            config: {}
        },
        {
            name: 'floop',
            db: 'default',
            config: {}
        },
        {
            name: 'clark',
            db: 'default',
            config: {}
        }
    ];

    var procResp = [
        {
            id: 'sfasfsadfasfasdf',
            kg: 'clark',
            application: 'rivulet',
            processType: 'oozie'
        },
        {
            id: 'asdfasdfasdfasdf',
            kg: 'clark',
            application: 'frequencies',
            processType: 'oozie'
        }
    ];

    beforeEach(function () {
        // Just use the default URL since we're mocking
        synicClient = new SynicClient();
        jasmine.Ajax.install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    it("Test listActiveKGs", function () {
        expect(synicClient.listActiveKGs).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.listActiveKGs().then(function (kgs) {
            expect(kgs.length).toBe(kgResp.length);

            var lastKG;
            kgs.forEach(function (kg) {
                // There should be a field called processes
                expect(kg.hasOwnProperty('processes')).toBe(true);

                // Every process should belong to the correct KG
                kg.processes.forEach(function (process) {
                    expect(process.kg).toBe(kg.name);
                });

                // Check to make sure they're sorted by name
                if (lastKG) {
                    expect(lastKG.name).toBeLessThan(kg.name);
                }

                lastKG = kg;
            });
        }).then(doneFn);

        expect(jasmine.Ajax.requests.count()).toBe(1);

        expect(doneFn).not.toHaveBeenCalled();

        // Respond to KG request
        var kgRequest = jasmine.Ajax.requests.mostRecent();

        expect(kgRequest.url).toBe('http://localhost:9011/synic/api/kb');
        kgRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(kgResp)
        });

        expect(jasmine.Ajax.requests.count()).toBe(2);

        expect(doneFn).not.toHaveBeenCalled();

        // Respond to process request
        var procRequest = jasmine.Ajax.requests.mostRecent();

        expect(procRequest.url).toBe('http://localhost:9011/synic/api/process');
        procRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(procResp)
        });

        expect(doneFn).toHaveBeenCalled();
    });

    it("Test listKGs", function () {
        expect(synicClient.listKGs).toBeTruthy();

        synicClient.listKGs().then(function (kgs) {
            // We'll do more here later, once we add pending KGs
        });
    });

    it("Test listKGNames", function () {
        expect(synicClient.listKGNames).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.listKGNames().then(function (kgNames) {
            expect(kgNames.length).toBe(kgResp.length);

            // Each entry should just be a name, not an object
            kgNames.forEach(function (kgName, idx) {
                expect(typeof kgName).toBe('string');
                expect(kgName).toBe(kgResp[idx].name);
            });
        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        // Respond to KG request
        var kgRequest = jasmine.Ajax.requests.mostRecent();

        expect(kgRequest.url).toBe('http://localhost:9011/synic/api/kb');
        kgRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(kgResp)
        });

        expect(doneFn).toHaveBeenCalled();
    });
});