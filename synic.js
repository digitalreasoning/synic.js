/**
 * @version: 0.1.0
 * @author: Clark Perkins <clark.perkins@digitalreasoning.com>
 * @date: 2014-12-05
 */
(function() {
    var SynicClient = function(synicURL) {
        if (!synicURL) {
            // Default URL
            this.synicURL = 'http://localhost:9011';
        } else {
            this.synicURL = synicURL;
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
                type: method,
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

            if (data) {
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
            return this.ajax('GET', '/app', null, callback);
        },
        getVersion: function(callback) {
            return this.getAppInfo(function(resp) {
                callback(resp.version);
            });
        },

        /*
         *   DB
         */
        listDBs: function(callback) {
            return this.ajax('GET', '/db', null, callback);
        },
        getDB: function(dbname, callback) {
            return this.ajax('GET', '/db/'+dbname, null, callback);
        },

        /*
         *   KG
         */
        createKG: function(kgname, db, config, callback) {
            if (!config) {
                config = {};
            }

            if (!db) {
                db = 'default';
            }

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
            return this.listKGs(function(resp) {
                // Only call the callback with a list of names
                callback(resp.map(function(kg) {
                    return kg.name;
                }));
            });
        },
        getKG: function(kgname, callback) {
            return this.ajax('GET', '/kb/'+kgname, null, callback);
        },
        getKGConfig: function(kgname, callback) {
            return this.ajax('GET', '/kb/'+kgname+'/config', null, callback);
        },
        updateKGConfig: function(kgname, config, callback) {
            return this.ajax('PATCH', '/kb/'+kgname+'/config', config, callback);
        },
        deleteKG: function(kgname, callback) {
            return this.ajax('DELETE', '/kb/'+kgname, null, callback);
        },

        /*
         *   App Config
         */
        configKG: function(kgname, appName, member, property, value, callback) {
            var self = this;
            // Build the config object, will either be universal or members
            var configObject = {};
            if (member) {
                // Member config
                configObject[member] = {};
                configObject[member].config = {};
                configObject[member].config[property] = value;
            } else {
                // Universal config
                configObject[property] = value
            }

            this.getKGConfig(kgname, function(resp) {
                // Check to see if the app exists first
                var exists = false;
                resp.forEach(function(appconf) {
                    if (appconf.appName === appName) {
                        if (member) {
                            exists = true;
                        }
                    }
                });

                if (!exists) {
                    // If the app doesn't exist, create it
                    if (member) {
                        // Add with member config
                        self.addKGAppConfig(kgname, appName, configObject, {}, callback);
                    } else {
                        // Add with universal config
                        self.addKGAppConfig(kgname, appName, {}, configObject, callback);
                    }
                } else {
                    // Otherwise we just need to update the current app
                    var configData = {
                        appName: appName
                    };
                    if (member) {
                        configData.members = configObject;
                    } else {
                        configData.universal = configObject;
                    }
                    self.ajax('PATCH', '/kb/'+kgname+'/config/'+appName, configData, callback);
                }
            });
        },
        addKGAppConfig: function(kgname, appName, members, universal, callback) {
            if (!members) {
                members = {};
            }

            if (!universal) {
                universal = {};
            }

            var configData = {
                appName: appName,
                members: members,
                universal: universal
            };

            return this.ajax('POST', '/kb/'+kgname+'/config', configData, callback);
        },
        getKGAppConfig: function(kgname, appName, callback) {
            return this.ajax('GET', '/kb/'+kgname+'/config/'+appName, null, callback);
        },
        addKGAppMember: function(kgname, appName, memberName, config, callback) {
            if (!config) {
                config = {};
            }

            var configData = {
                memberName: memberName,
                config: config
            };

            return this.ajax('POST', '/kb/'+kgname+'/config/'+appName+'/members', configData, callback);
        },
        updateKGAppMember: function(kgname, appName, memberName, config, callback) {
            return null;
        },

        /*
         *   Processes
         */
        listProcesses: function(callback) {
            return this.ajax('GET', '/process', null, callback);
        },
        listProcessIDs: function(callback) {
            return this.listProcesses(function(resp) {
                callback(resp.map(function(proc) {
                    return proc.id;
                }));
            });
        },
        getProcess: function(procId, callback) {
            return this.ajax('GET', '/process/'+procid, null, callback);
        },
        triggerProcess: function(kgname, appName, processType, config, callback) {
            if (!config) {
                config = {};
            }

            var procData = {
                kb: kgname,
                application: appName,
                processType: processType,
                invocationConfig: config
            };

            return this.ajax('POST', '/process', procData, callback);
        },
        listProcessTypes: function(callback) {
            return this.ajax('GET', '/processType', null, callback);
        },

        /*
         *   Schedules
         */
        listSchedules: function(callback) {
            return this.ajax('GET', '/scheduler/schedule', null, callback);
        },
        createSchedule: function(schedule, callback) {
            return null;
        },
        createScheduleFromTemplate: function(templateName, mappings, startAfterCreation, callback) {
            var self = this;

            var data = {
                templateName: templateName,
            };
            if (mappings) {
                data.mappings = mappings;
            }

            // Set the callback function - if we want to start the schedule after creation, then the callback needs to
            // start the schedule before calling the users callback
            var realCallback;
            if (startAfterCreation) {
                realCallback = function(resp) {
                    self.startSchedule(resp.id, function(startResp) {
                        // Callback with the original resp instead of the response of starting
                        callback(resp);
                    });
                };
            } else {
                realCallback = callback;
            }

            return this.ajax('POST', '/scheduler/schedule', data, realCallback);
        },
        listTemplates: function(callback) {
            return this.ajax('GET', '/scheduler/template', null, callback);
        },
        getTemplate: function(templateName, callback) {
            return this.ajax('GET', '/scheduler/template/'+templateName, null, callback);
        },
        getSchedule: function(scheduleId, callback) {
            return this.ajax('GET', '/scheduler/schedule/'+scheduleId, null, callback);
        },
        updateScheduleMappings: function(scheduleId, mappings, callback) {
            // Not sure about this method... may not do anything
            var updateData = {
                mappings: mappings
            };
            return this.ajax('PATCH', '/scheduler/schedule/'+scheduleId, updateData, callback);
        },
        startSchedule: function(scheduleId, callback) {
            return this.ajax('PATCH', '/scheduler/schedule/'+scheduleId, {status: 'STARTING'}, callback);
        },
        stopSchedule: function(scheduleId, callback) {
            return this.ajax('PATCH', '/scheduler/schedule/'+scheduleId, {status: 'STOPPING'}, callback);
        },

        /*
         *   Job Data
         */
        getJobData: function(kgname, procId, callback) {
            return this.ajax('GET', '/jobdata/'+kgname+'/'+procId, null, callback);
        }

    };

    // Expose SynicClient to the global object
    window.SynicClient = SynicClient;

    if (typeof define === "function" && define.amd) {
        define(['synic'], function () { return SynicClient; } );
    }

})();


