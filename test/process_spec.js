
describe("Processes", function () {
    var synicClient;

    var procResp = [
        {
            "id": "9928086c-9468-4988-ae0d-a1ed189d8e33",
            "kb": "clark2",
            "application": "frequencies",
            "processType": "oozie",
            "requestedTime": "20150203T225350.088Z",
            "startedTime": "20150203T225350.207Z",
            "completedTime": "20150203T225406.450Z",
            "status": "CANCELLED",
            "failure": null,
            "invocationConfig": {

            },
            "stackTrace": null,
            "allowedCommands": [
                "CANCEL"
            ],
            "issuedCommand": null
        },
        {
            "id": "3e8259e3-db10-495e-be25-e179633a0f92",
            "kb": "clark2",
            "application": "frequencies",
            "processType": "oozie",
            "requestedTime": "20150203T225619.377Z",
            "startedTime": "20150203T225619.460Z",
            "completedTime": "20150203T231254.476Z",
            "status": "COMPLETE",
            "failure": null,
            "invocationConfig": {

            },
            "stackTrace": null,
            "allowedCommands": [
                "CANCEL"
            ],
            "issuedCommand": null
        },
        {
            "id": "a4fc614f-1a94-4cc9-957c-49e75e9df643",
            "kb": "clark2",
            "application": "rivulet",
            "processType": "oozie",
            "requestedTime": "20150203T214124.024Z",
            "startedTime": "20150203T214124.097Z",
            "completedTime": "20150203T222923.447Z",
            "status": "COMPLETE",
            "failure": null,
            "invocationConfig": {
                "input_rawText": "\/user\/clark.perkins\/en-wiki-5k.seq"
            },
            "stackTrace": null,
            "allowedCommands": [
                "CANCEL"
            ],
            "issuedCommand": null
        },
        {
            "id": "d808615b-5a37-4de2-a167-afa6f0fb1f78",
            "kb": "clark",
            "application": "rivulet",
            "processType": "oozie",
            "requestedTime": "20150202T182630.714Z",
            "startedTime": "20150202T182632.525Z",
            "completedTime": "20150202T191134.534Z",
            "status": "COMPLETE",
            "failure": null,
            "invocationConfig": {
                "input_rawText": "\/user\/clark.perkins\/en-wiki-5k.seq"
            },
            "stackTrace": null,
            "allowedCommands": [
                "CANCEL"
            ],
            "issuedCommand": null
        },
        {
            "id": "6c1f0f39-2901-4a7c-9634-39a7be73b3e4",
            "kb": "clark",
            "application": "associativenet",
            "processType": "oozie",
            "requestedTime": "20150202T192754.685Z",
            "startedTime": "20150202T205424.010Z",
            "completedTime": "20150202T211152.354Z",
            "status": "COMPLETE",
            "failure": null,
            "invocationConfig": {

            },
            "stackTrace": null,
            "allowedCommands": [
                "CANCEL"
            ],
            "issuedCommand": null
        },
        {
            "id": "f23ed032-04ce-4aac-a71d-e4325ee24b72",
            "kb": "clark",
            "application": "resonance",
            "processType": "oozie",
            "requestedTime": "20150202T191154.660Z",
            "startedTime": "20150202T192748.611Z",
            "completedTime": "20150202T205423.932Z",
            "status": "COMPLETE",
            "failure": null,
            "invocationConfig": {

            },
            "stackTrace": null,
            "allowedCommands": [
                "CANCEL"
            ],
            "issuedCommand": null
        },
        {
            "id": "e64f1e80-b50b-4947-bba8-fee505280760",
            "kb": "clark",
            "application": "frequencies",
            "processType": "oozie",
            "requestedTime": "20150202T191142.683Z",
            "startedTime": "20150202T191142.758Z",
            "completedTime": "20150202T192748.534Z",
            "status": "COMPLETE",
            "failure": null,
            "invocationConfig": {

            },
            "stackTrace": null,
            "allowedCommands": [
                "CANCEL"
            ],
            "issuedCommand": null
        },
        {
            "id": "c67dc8c7-0224-4bf4-8d6f-504170bd0dd3",
            "kb": "clark",
            "application": "knowledgeobjects",
            "processType": "oozie",
            "requestedTime": "20150202T205430.689Z",
            "startedTime": "20150202T211152.427Z",
            "completedTime": "20150202T213225.353Z",
            "status": "COMPLETE",
            "failure": null,
            "invocationConfig": {
                "entitiesTable": "true"
            },
            "stackTrace": null,
            "allowedCommands": [
                "CANCEL"
            ],
            "issuedCommand": null
        }
    ];

    var procTypes = [
        {"name":"pig"},
        {"name":"hadoopstreaming"},
        {"name":"hadoop"},
        {"name":"hadoop-cdh4"},
        {"name":"oozie-cdh4"},
        {"name":"oozie"},
        {"name":"pig-cdh4"},
        {"name":"storm"},
        {"name":"hadoopstreaming-cdh4"}
    ];

    var applications = [
        {
            "elasticSearchMappingPresent": false,
            "harvestDescriptorPresent": false,
            "processTypes": [
                "hadoopstreaming",
                "pig-cdh4",
                "hadoop",
                "oozie",
                "hadoop-cdh4",
                "pig",
                "oozie-cdh4",
                "hadoopstreaming-cdh4"
            ],
            "name": "knowledgeobjects"
        },
        {
            "elasticSearchMappingPresent": false,
            "harvestDescriptorPresent": true,
            "processTypes": [
                "hadoopstreaming",
                "pig-cdh4",
                "hadoop",
                "oozie",
                "hadoop-cdh4",
                "pig",
                "oozie-cdh4",
                "hadoopstreaming-cdh4"
            ],
            "name": "resonance"
        },
        {
            "elasticSearchMappingPresent": false,
            "harvestDescriptorPresent": false,
            "processTypes": [
                "hadoopstreaming",
                "pig-cdh4",
                "hadoop",
                "oozie",
                "hadoop-cdh4",
                "pig",
                "oozie-cdh4",
                "hadoopstreaming-cdh4"
            ],
            "name": "test"
        },
        {
            "elasticSearchMappingPresent": false,
            "harvestDescriptorPresent": false,
            "processTypes": [
                "pig-cdh4",
                "pig"
            ],
            "name": "synic-hadoopstreaming-test"
        },
        {
            "elasticSearchMappingPresent": false,
            "harvestDescriptorPresent": true,
            "processTypes": [
                "hadoopstreaming",
                "pig-cdh4",
                "hadoop",
                "oozie",
                "hadoop-cdh4",
                "pig",
                "oozie-cdh4",
                "hadoopstreaming-cdh4"
            ],
            "name": "frequencies"
        },
        {
            "elasticSearchMappingPresent": false,
            "harvestDescriptorPresent": true,
            "processTypes": [
                "hadoopstreaming",
                "pig-cdh4",
                "hadoop",
                "oozie",
                "hadoop-cdh4",
                "pig",
                "oozie-cdh4",
                "hadoopstreaming-cdh4"
            ],
            "name": "associativenet"
        },
        {
            "elasticSearchMappingPresent": true,
            "harvestDescriptorPresent": false,
            "processTypes": [
                "hadoopstreaming",
                "pig-cdh4",
                "hadoop",
                "oozie",
                "hadoop-cdh4",
                "pig",
                "oozie-cdh4",
                "hadoopstreaming-cdh4"
            ],
            "name": "keyindicators"
        },
        {
            "elasticSearchMappingPresent": false,
            "harvestDescriptorPresent": false,
            "processTypes": [
                "hadoopstreaming",
                "pig-cdh4",
                "hadoop",
                "oozie",
                "hadoop-cdh4",
                "pig",
                "oozie-cdh4",
                "hadoopstreaming-cdh4"
            ],
            "name": "dianoga"
        },
        {
            "elasticSearchMappingPresent": false,
            "harvestDescriptorPresent": false,
            "processTypes": [
                "hadoopstreaming",
                "pig-cdh4",
                "hadoop",
                "storm",
                "oozie",
                "hadoop-cdh4",
                "pig",
                "oozie-cdh4",
                "hadoopstreaming-cdh4"
            ],
            "name": "rivulet"
        },
        {
            "elasticSearchMappingPresent": false,
            "harvestDescriptorPresent": false,
            "processTypes": [
                "hadoopstreaming",
                "pig-cdh4",
                "hadoop",
                "oozie",
                "hadoop-cdh4",
                "pig",
                "oozie-cdh4",
                "hadoopstreaming-cdh4"
            ],
            "name": "synic-batchsummary-cdh4"
        },
        {
            "elasticSearchMappingPresent": false,
            "harvestDescriptorPresent": false,
            "processTypes": [
                "pig-cdh4",
                "pig"
            ],
            "name": "synmodel-pig"
        }
    ];

    beforeEach(function () {
        synicClient = new SynicClient();
        jasmine.Ajax.install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    it("Test listProcesses", function () {
        expect(synicClient.listProcesses).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.listProcesses().then(function (processes) {
            var lastProc;

            processes.forEach(function (proc) {

                // Verify that dates are parsed
                var matchRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;
                expect(proc.startedTime).toMatch(matchRegex);
                expect(proc.completedTime).toMatch(matchRegex);
                expect(proc.requestedTime).toMatch(matchRegex);

                // Ensure processes are sorted by time
                if (lastProc) {
                    expect(lastProc.startedTime).toBeLessThan(proc.startedTime);
                }
                lastProc = proc;
            });

        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var procRequest = jasmine.Ajax.requests.mostRecent();

        expect(procRequest.url).toBe('http://localhost:9011/synic/api/process');
        procRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(procResp)
        });

        expect(doneFn).toHaveBeenCalled();
    });

    it("Test listProcessIDs", function () {
        expect(synicClient.listProcessIDs).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.listProcessIDs().then(function (procIDs) {
            expect(procIDs.length).toBe(procResp.length);

            procIDs.forEach(function (procId) {
                // Everything should be a string
                expect(typeof procId).toBe('string');
            });
        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var procRequest = jasmine.Ajax.requests.mostRecent();

        expect(procRequest.url).toBe('http://localhost:9011/synic/api/process');
        procRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(procResp)
        });

        expect(doneFn).toHaveBeenCalled();
    });

    it("Test getProcess", function () {
        expect(synicClient.getProcess).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.getProcess('9928086c-9468-4988-ae0d-a1ed189d8e33').then(function (proc) {
            // Verify that dates are parsed
            var matchRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;
            expect(proc.startedTime).toMatch(matchRegex);
            expect(proc.completedTime).toMatch(matchRegex);
            expect(proc.requestedTime).toMatch(matchRegex);
        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var procRequest = jasmine.Ajax.requests.mostRecent();

        expect(procRequest.url).toBe('http://localhost:9011/synic/api/process/9928086c-9468-4988-ae0d-a1ed189d8e33');
        procRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(procResp[0])
        });

        expect(doneFn).toHaveBeenCalled();
    });

    it("Test triggerProcess", function () {
        expect(synicClient.triggerProcess).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.triggerProcess('clark', 'rivulet', 'oozie', {input_rawText: '/path/foo/bar'}).then(function (resp) {
            expect(resp.hasOwnProperty('id')).toBe(true);
        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var triggerRequest = jasmine.Ajax.requests.mostRecent();

        expect(triggerRequest.url).toBe('http://localhost:9011/synic/api/process');
        triggerRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: '{"id": "some_long_string", "kb": "clark", "application": "rivulet", "processType": "oozie", "invocationConfig": {"input_rawText": "/path/foo/bar"}}'
        });

        expect(doneFn).toHaveBeenCalled();
    });

    it("Test triggerFailedProcess", function () {
        expect(synicClient.triggerFailedProcess).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.triggerFailedProcess('9928086c-9468-4988-ae0d-a1ed189d8e33').then(function (resp) {

        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var procRequest = jasmine.Ajax.requests.mostRecent();

        expect(procRequest.url).toBe('http://localhost:9011/synic/api/process/9928086c-9468-4988-ae0d-a1ed189d8e33');
        procRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(procResp[0])
        });

        expect(doneFn).not.toHaveBeenCalled();


        // Respond to the trigger
        var triggerRequest = jasmine.Ajax.requests.mostRecent();

        expect(triggerRequest.data().invocationConfig.hasOwnProperty('useProcessId')).toBe(true);
        expect(triggerRequest.data().invocationConfig.useProcessId).toBe('9928086c-9468-4988-ae0d-a1ed189d8e33');

        expect(triggerRequest.url).toBe('http://localhost:9011/synic/api/process');
        triggerRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: '{}'
        });

        expect(doneFn).toHaveBeenCalled();
    });

    it("Test listProcessTypes", function () {
        expect(synicClient.listProcessTypes).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.listProcessTypes().then(function (resp) {
            var lastType;

            resp.forEach(function (type) {
                // Ensure sorted by name
                if (lastType) {
                    expect(lastType.name).toBeLessThan(type.name);
                }

                lastType = type;
            });

        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var procRequest = jasmine.Ajax.requests.mostRecent();

        expect(procRequest.url).toBe('http://localhost:9011/synic/api/processType');
        procRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(procTypes)
        });
        
        expect(doneFn).toHaveBeenCalled();
    });

    it("Test listApplications", function () {
        expect(synicClient.listApplications).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.listApplications().then(function (resp) {
            var lastApp;

            resp.forEach(function (app) {
                // Ensure sorted by name
                if (lastApp) {
                    expect(lastApp.name).toBeLessThan(app.name);
                }

                lastApp = app;

                var lastType;

                // Ensure types are sorted also
                app.processTypes.forEach(function (type) {
                    // Ensure sorted by name
                    if (lastType) {
                        expect(lastType).toBeLessThan(type);
                    }

                    lastType = type;
                });
            });

        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var procRequest = jasmine.Ajax.requests.mostRecent();

        expect(procRequest.url).toBe('http://localhost:9011/synic/api/application');
        procRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(applications)
        });

        expect(doneFn).toHaveBeenCalled();
    });
});