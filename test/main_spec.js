
describe("General", function () {
    var baseUrl = '';
    
    beforeEach(function () {
        jasmine.Ajax.install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    it("Test Constructor", function () {
        var synicClient = new SynicClient();

        expect(synicClient.synicURL).toBe(baseUrl + '');

        synicClient = new SynicClient('http://synic.example.com:9011');

        expect(synicClient.synicURL).toBe('http://synic.example.com:9011');
    });

    it("Test setURL", function () {
        var synicClient = new SynicClient();

        synicClient.setURL('http://synic.example.com:9011');

        expect(synicClient.synicURL).toBe('http://synic.example.com:9011');
    });

    it("Test getVersion", function () {
        var synicClient = new SynicClient();

        expect(synicClient.getVersion).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient.getVersion().then(function (resp) {
            expect(typeof resp).toBe('string');
        }).then(doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var versionRequest = jasmine.Ajax.requests.mostRecent();

        expect(versionRequest.url).toBe(baseUrl + '/synic/api/app');
        versionRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: '{"version": "1.3.0"}'
        });

        expect(doneFn).toHaveBeenCalled();
    });

    it("Test _ajax (success)", function () {
        var synicClient = new SynicClient();

        expect(synicClient._ajax).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient._ajax('GET', '', null, doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var testRequest = jasmine.Ajax.requests.mostRecent();

        expect(testRequest.url).toBe(baseUrl + '/synic/api');
        testRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: '{}'
        });

        expect(doneFn).toHaveBeenCalledWith({});
    });

    it("Test _ajax (failure)", function () {
        var synicClient = new SynicClient();

        expect(synicClient._ajax).toBeTruthy();

        var doneFn = jasmine.createSpy("success");

        synicClient._ajax('GET', '', null, doneFn);

        expect(doneFn).not.toHaveBeenCalled();

        var testRequest = jasmine.Ajax.requests.mostRecent();

        expect(testRequest.url).toBe(baseUrl + '/synic/api');
        testRequest.respondWith({
            status: 500,
            contentType: 'application/json',
            responseText: '{}'
        });

        expect(doneFn).toHaveBeenCalledWith(new Error({}));
    });
});