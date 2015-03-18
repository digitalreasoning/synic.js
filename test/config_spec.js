
describe("Knowledge Graph Config", function () {
    var synicClient;
    
    var baseUrl = '';

    beforeEach(function () {
        synicClient = new SynicClient();
        jasmine.Ajax.install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    it("Test configKG, no pre-existing app", function () {
        expect(synicClient.configKG).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.configKG('clark', 'rivulet', null, 'foo', 'bar').then(function (resp) {

        }).then(doneFn);

        expect(jasmine.Ajax.requests.count()).toBe(1);
        expect(doneFn).not.toHaveBeenCalled();

        // Respond to get KG config
        var configRequest = jasmine.Ajax.requests.mostRecent();

        expect(configRequest.url).toBe(baseUrl + '/synic/api/kb/clark/config');
        configRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: '[]'
        });

        expect(jasmine.Ajax.requests.count()).toBe(2);
        expect(doneFn).not.toHaveBeenCalled();


        // Create the config
        var doConfigRequest = jasmine.Ajax.requests.mostRecent();

        expect(doConfigRequest.url).toBe(baseUrl + '/synic/api/kb/clark/config');
        doConfigRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: '{}'
        });

        // Only 2 requests happen, so we're done
        expect(doneFn).toHaveBeenCalled();
    });

    it("Test configKG, with pre-existing app", function () {
        expect(synicClient.configKG).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.configKG('clark', 'rivulet', null, 'foo', 'bar').then(function (resp) {

        }).then(doneFn);

        expect(jasmine.Ajax.requests.count()).toBe(1);
        expect(doneFn).not.toHaveBeenCalled();

        // Respond to get KG config
        var configRequest = jasmine.Ajax.requests.mostRecent();

        expect(configRequest.url).toBe(baseUrl + '/synic/api/kb/clark/config');
        configRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: '[{"appName": "rivulet", "universal": {}, "members": {}}]'
        });

        expect(jasmine.Ajax.requests.count()).toBe(2);
        expect(doneFn).not.toHaveBeenCalled();


        // Create the config
        var doConfigRequest = jasmine.Ajax.requests.mostRecent();

        // Here is where it's different - we post to /config/<appName> instead of just /config
        expect(doConfigRequest.url).toBe(baseUrl + '/synic/api/kb/clark/config/rivulet');
        doConfigRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: '{}'
        });

        // Only 2 requests happen, so we're done
        expect(doneFn).toHaveBeenCalled();
    });
});