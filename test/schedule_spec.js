
describe("Schedules", function () {
    var synicClient;

    var schedResp = [
        {
            "id": "be39410a-6262-41f4-8054-39c2764a1af0",
            "templateName": "synthesys-batch-ingestion",
            "mappings": {
                "resonanceId": "f23ed032-04ce-4aac-a71d-e4325ee24b72",
                "hive": "true",
                "synicDir": "/mnt/synthesys/synic-dist-1.3.0-SNAPSHOT",
                "DESCRIPTION": "Perform batch ingestion with all analytics; Optionally create KO entities table and hive/impala tables",
                "hiveWarehouse": "/user/hive/warehouse",
                "rivuletId": "d808615b-5a37-4de2-a167-afa6f0fb1f78",
                "script": "/mnt/synthesys/synic-dist-1.3.0-SNAPSHOT/views/defaultHiveImpala/hiveImpalaSetup.sh",
                "id": "be39410a-6262-41f4-8054-39c2764a1af0",
                "processType": "oozie",
                "kbName": "clark",
                "input": "/user/clark.perkins/en-wiki-5k.seq",
                "frequenciesId": "e64f1e80-b50b-4947-bba8-fee505280760",
                "knowledgeObjectsId": "c67dc8c7-0224-4bf4-8d6f-504170bd0dd3",
                "entitiesTable": "true",
                "hiveSetupScriptExitValue": "1",
                "impalaHost": "clark-cdh5-dn-0.dev.digitalreasoning.com",
                "hiveSetupOutput": "[Mon Feb  2 21:32:30 UTC 2015] #####################################################################\n[Mon Feb  2 21:32:30 UTC 2015]  Synthesys Hive & Impala Table Creation\n[Mon Feb  2 21:32:30 UTC 2015]  ------------------------------------------------------------------- \n[Mon Feb  2 21:32:30 UTC 2015]  KBNAME        : clark\n[Mon Feb  2 21:32:30 UTC 2015]  WAREHOUSE DIR : /user/hive/warehouse\n[Mon Feb  2 21:32:30 UTC 2015]  ENTITIES      : true\n[Mon Feb  2 21:32:30 UTC 2015]  IMPALA_HOST   : clark-cdh5-dn-0.dev.digitalreasoning.com\n[Mon Feb  2 21:32:30 UTC 2015] #####################################################################\n\n[Mon Feb  2 21:32:30 UTC 2015] ## Validating environment and permissions\n[Mon Feb  2 21:32:33 UTC 2015] ERROR: Unable to load Synthesys Hive UDF's, have you properly configured\n[Mon Feb  2 21:32:33 UTC 2015] HIVE_AUX_JARS_PATH in hive-env.sh?\n",
                "associativenetId": "6c1f0f39-2901-4a7c-9634-39a7be73b3e4"
            },
            "resources": {
                "kb": "/kb/$kbName",
                "rivulet": "/process/$rivuletId",
                "frequencies": "/process/$frequenciesId",
                "resonance": "/process/$resonanceId",
                "associativenet": "/process/$associativenetId",
                "knowledgeobjects": "/process/$knowledgeObjectsId"
            },
            "status": "NEW",
            "errorMessage": "",
            "errorStackTrace": ""
        },
        {
            "id": "74ae1dce-f5d5-4aa3-8b1b-618f6880fc44",
            "templateName": "synthesys-hive-create",
            "mappings": {
                "id": "74ae1dce-f5d5-4aa3-8b1b-618f6880fc44",
                "kbName": "clark",
                "synicDir": "/mnt/synthesys/synic-dist-1.3.0-SNAPSHOT",
                "DESCRIPTION": "This will create Hive and Impala tables for a KB after ingestion",
                "entitiesTable": "true",
                "hiveSetupScriptExitValue": "0",
                "hiveWarehouse": "/user/hive/warehouse",
                "script": "/mnt/synthesys/synic-dist-1.3.0-SNAPSHOT/views/defaultHiveImpala/hiveImpalaSetup.sh",
                "impalaHost": "clark-cdh5-dn-0.dev.digitalreasoning.com",
                "hiveSetupOutput": "[Mon Feb  2 22:28:13 UTC 2015] #####################################################################\n[Mon Feb  2 22:28:13 UTC 2015]  Synthesys Hive & Impala Table Creation\n[Mon Feb  2 22:28:13 UTC 2015]  ------------------------------------------------------------------- \n[Mon Feb  2 22:28:13 UTC 2015]  KBNAME        : clark\n[Mon Feb  2 22:28:13 UTC 2015]  WAREHOUSE DIR : /user/hive/warehouse\n[Mon Feb  2 22:28:13 UTC 2015]  ENTITIES      : true\n[Mon Feb  2 22:28:13 UTC 2015]  IMPALA_HOST   : clark-cdh5-dn-0.dev.digitalreasoning.com\n[Mon Feb  2 22:28:13 UTC 2015] #####################################################################\n\n[Mon Feb  2 22:28:13 UTC 2015] ## Validating environment and permissions\n[Mon Feb  2 22:28:17 UTC 2015] Valid Hive environment (able to load Synthesys UDFs)\n[Mon Feb  2 22:28:18 UTC 2015] Valid Impala connection to clark-cdh5-dn-0.dev.digitalreasoning.com\n[Mon Feb  2 22:28:23 UTC 2015] Valid permissions on /user/clark.perkins/test_permission \n[Mon Feb  2 22:28:28 UTC 2015] Valid permissions on /tmp/test_permissions \n\n[Mon Feb  2 22:28:28 UTC 2015] ## Creating Hive tables\n\n[Mon Feb  2 22:28:36 UTC 2015] ## Creating optional entities table\n\n[Mon Feb  2 22:28:41 UTC 2015] ## Attempting to set warehouse permissions\n[Mon Feb  2 22:28:41 UTC 2015] WARNING: Unable to set warehouse permissions, Impala insert may not work\n\n[Mon Feb  2 22:28:41 UTC 2015] ## Deleting previous Impala tables\n\u001b[?1034h\n[Mon Feb  2 22:28:46 UTC 2015] (assertions_parquet successfully deleted)\n[Mon Feb  2 22:28:48 UTC 2015] (assertions_parquet_all successfully deleted)\n[Mon Feb  2 22:28:51 UTC 2015] (ko_profile_parquet successfully deleted)\n\n[Mon Feb  2 22:28:51 UTC 2015] ## Creating Impala tables\n\u001b[?1034h\n\n\n\n\n[Mon Feb  2 22:28:53 UTC 2015] ## Inserting into Impala tables\n\u001b[?1034h\n\n[Mon Feb  2 22:28:59 UTC 2015] ## Hive and Impala tables are ready!\n"
            },
            "resources": {

            },
            "status": "TERMINATED",
            "errorMessage": "",
            "errorStackTrace": ""
        }
    ];

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

    beforeEach(function () {
        synicClient = new SynicClient();
        jasmine.Ajax.install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    it("Test listSchedules", function () {
        expect(synicClient.listSchedules).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.listSchedules().then(function (schedules) {
            expect(schedules.length).toBe(schedResp.length);

            var lastSched;
            schedules.forEach(function (sched) {
                // There should be a field called processes
                expect(sched.hasOwnProperty('processes')).toBe(true);

                // Every process should belong to the correct schedule
                sched.processes.forEach(function (process) {
                    var found = false;

                    for (var key in sched.mappings) {
                        if (sched.mappings.hasOwnProperty(key)) {
                            var val = sched.mappings[key];

                            if (process.id === val) {
                                found = true;
                            }
                        }
                    }
                    expect(found).toBe(true);
                });

                // Check to make sure they're sorted by last process start time
                if (lastSched && sched.processes.length > 0) {
                    expect(lastSched.processes[0].startedTime).toBeLessThan(sched.processes[0].startedTime);
                }

                lastSched = sched;
            });
        }).then(doneFn);

        expect(jasmine.Ajax.requests.count()).toBe(1);

        expect(doneFn).not.toHaveBeenCalled();

        // Respond to KG request
        var schedRequest = jasmine.Ajax.requests.mostRecent();

        expect(schedRequest.url).toBe('http://localhost:9011/synic/api/scheduler/schedule');
        schedRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(schedResp)
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

    it("Test createScheduleFromTemplate (no start)", function () {
        expect(synicClient.createScheduleFromTemplate).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.createScheduleFromTemplate('synthesys-batch-ingestion', {}, false).then(function (resp) {
            expect(resp.status).toBe("NEW");
        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var schedCreateRequest = jasmine.Ajax.requests.mostRecent();

        expect(schedCreateRequest.url).toBe('http://localhost:9011/synic/api/scheduler/schedule');

        schedCreateRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(schedResp[0])
        });

        expect(doneFn).toHaveBeenCalled();
    });

    it("Test createScheduleFromTemplate (with start)", function () {
        expect(synicClient.createScheduleFromTemplate).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.createScheduleFromTemplate('synthesys-batch-ingestion', {}, true).then(function (resp) {
            expect(resp.status).toBe("STARTING");
        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var schedCreateRequest = jasmine.Ajax.requests.mostRecent();

        expect(schedCreateRequest.url).toBe('http://localhost:9011/synic/api/scheduler/schedule');

        schedCreateRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(schedResp[0])
        });

        expect(doneFn).not.toHaveBeenCalled();

        var schedStartRequest = jasmine.Ajax.requests.mostRecent();

        expect(schedStartRequest.url).toBe('http://localhost:9011/synic/api/scheduler/schedule/'+schedResp[0].id);

        schedResp[0].status = "STARTING";

        schedStartRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(schedResp[0])
        });

        expect(doneFn).toHaveBeenCalled();
    });

    it("Test _listProcessesForSchedule", function() {
        expect(synicClient._listProcessIdsForSchedule).toBeTruthy();

        var schedule = {
            mappings: {
                rivuletId: 'theId1',
                frequenciesId: 'theId2',
                resonanceId: 'theId3',
                associativenetId: 'theId4',
                knowledgeobjectsId: 'theId5',
                dianogaId: 'theId6',
                myId: 'theId7'
            },
            resources: {
                associativenet: '/process/$associativenetId',
                rivulet: '/process/$rivuletId',
                // This should not end up in the list
                my: '/kb/$myId',
                knowledgeobjects: '/process/$knowledgeobjectsId',
                dianoga: '/process/$dianogaId',
                resonance: '/process/$resonanceId',
                frequencies: '/process/$frequenciesId',
                // Plain Id, not pulled from mappings
                hello: '/process/theId8'
            }
        };

        var ids = synicClient._listProcessIdsForSchedule(schedule);

        // Check to be sure all the ids we want were returned
        for (var i = 1; i <= 6; ++i) {
            // AKA we want theId{i} to be in the list
            expect(ids.indexOf('theId'+i)).not.toBeLessThan(0);
        }

        expect(ids.indexOf('theId8')).not.toBeLessThan(0);

        // Check to see nothing extra was returned
        ids.forEach(function (id) {
            expect(id.indexOf('theId')).toBe(0);

            var idx = parseInt(id[5]);

            // All IDs should be in [1, 6] or equal 8
            expect((idx >= 1 && idx <= 6) || idx === 8).toBe(true);
        });
    });
});