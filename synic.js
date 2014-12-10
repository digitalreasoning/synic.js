/**
 * @version: 0.1.0
 * @author: Clark Perkins <clark.perkins@digitalreasoning.com>
 * @date: 2014-12-05
 */
(function() {
    var SynicClient = function(synicURL) {
        this.synicURL = synicURL;
        if (this.synicURL === null || synicURL === undefined) {
            // Default URL
            this.synicURL = 'http://localhost:9011';
        }
    };

    SynicClient.prototype = {
        constructor: SynicClient,

        /**
         * Helper method, to be used by all other methods
         * @param method - the request method
         * @param endpoint - the resource endpoint
         * @param data - any request data (only used if it is not null or undefined)
         * @param callback - a callback function that will be called with the response as it's single parameter
         * @returns {*}
         */
        ajax: function(method, endpoint, data, callback) {
            var ajaxData = {
                method: method,
                url: this.synicURL + '/synic/api' + endpoint,
                contentType: 'application/json',
                headers: {},
                success: function(response, status, xhr) {
                    if (callback) {
                        callback(response);
                    }
                },
                error: function(xhr, status, error) {
                    console.log('Request failure: '+error);
                    if (callback) {
                        callback(null);
                    }
                }
            };

            if (data !== null && data !== undefined) {
                ajaxData.data = JSON.stringify(data);
            }

            return $.ajax(ajaxData);
        },

        /**
         * Change the URL if need be
         * @param url - the new URL
         */
        setURL: function(url) {
            this.synicURL = url;
        },

        /*
         *   Synic App
         */
        getAppInfo: function(callback) {

        },
        getVersion: function(callback) {

        },

        /*
         *   DB
         */
        listDBs: function(callback) {

        },
        getDB: function(dbname, callback) {

        },

        /*
         *   KG
         */
        createKG: function(kgname, db, config, callback) {
            var kgdata = {
                name: kgname,
                db: db,
                config: config
            };
            return this.ajax('POST', '/kb', kgdata, callback);
        },
        listKGs: function(callback) {
            return this.ajax('GET', '/kb', null, callback);
        },
        listKGNames: function(callback) {

        },
        getKG: function(kgname, callback) {
            return this.ajax('GET', '/kb/'+kgname, null, callback);
        },
        getKGConfig: function(kgname, callback) {

        },
        updateKGConfig: function(kgname, config, callback) {
            return this.ajax('PUT', '/kb/'+kgname, configdata, callback);
        },
        deleteKG: function(kgname, callback) {
            return this.ajax('DELETE', '/kb/'+kgname, null, callback);
        },

        /*
         *   App Config
         */
        addKGAppConfig: function(kgname, appName, members, universal, callback) {

        },
        getKGAppConfig: function(kgname, appName, callback) {

        },
        addKGAppMember: function(kgname, appName, memberName, config, callback) {

        },
        updateKGAppMember: function(kgname, appName, memberName, config, callback) {

        },

        /*
         *   Processes
         */
        listProcesses: function(filter, callback) {
            return this.ajax('GET', '/process', null, callback);
        },
        listProcessIDs: function(filter, callback) {

        },
        getProcess: function(procId, callback) {
            return this.ajax('GET', '/process/'+procid, null, callback);
        },
        triggerProcess: function(kgname, appName, processType, config, callback) {
            return this.ajax('POST', '/process', procdata, callback);
        },
        listProcessTypes: function(callback) {
            return this.ajax('GET', '/processType', null, callback);
        },

        /*
         *   Schedules
         */
        listSchedules: function(callback) {

        },
        createSchedule: function(schedule, callback) {

        },
        createScheduleFromTemplate: function(templateName, mappings, callback) {

        },
        getTemplate: function(templateName, callback) {

        },
        getSchedule: function(scheduleId, callback) {

        },
        getScheduleUrl: function(scheduleId, callback) {

        },
        startSchedule: function(scheduleId, callback) {

        },
        stopSchedule: function(scheduleId, callback) {

        },

        /*
         *   Job Data
         */
        getJobData: function(kgname, procId, callback) {

        }

    };

    // Expose SynicClient to the global object
    window.SynicClient = SynicClient;

    if ( typeof define === "function" && define.amd) {
        define(['synic'], function () { return SynicClient; } );
    }

})();


