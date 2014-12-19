/**
 * @version: 0.1.0
 * @author: Clark Perkins <clark.perkins@digitalreasoning.com>
 * @date: 2014-12-05
 */
(function() {
    /**
     * This is what all callback functions should look like
     *
     * @callback requestCallback
     * @param {(object|Array|string)} responseBody - the response body
     */

    /**
     * Represents a synic client object with methods for all the synic functionality.
     * @param {string} [synicURL=http://localhost:9011]- the URL of the synic server.  Defaults to 'http://localhost:9011'
     * @constructor
     */
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
         * Helper method, to be used by all other methods - NOT MEANT TO BE USED BY THE END USER
         *
         * @param {string} method - the request method
         * @param {string} endpoint - the resource endpoint
         * @param {object} data - any request data (only used if it is not null or undefined)
         * @param {requestCallback} [callback] - a callback function that will be called with the response as it's single parameter
         * @returns {promise}
         */
        _ajax: function(method, endpoint, data, callback) {
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
                    if (callback) {
                        callback(new Error(xhr));
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
         * @param {string} url - the new URL
         */
        setURL: function(url) {
            this.synicURL = url;
        },

        /*
         *   Synic App
         */
        /**
         * Get the synic server info
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getAppInfo: function(callback) {
            return this._ajax('GET', '/app', null, callback);
        },
        /**
         * Get the version of the synic server
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getVersion: function(callback) {
            var ret;
            if (callback) {
                // Use the provided callback since it exists
                ret = this.getAppInfo(function(resp) {
                    callback(resp.version);
                });
            } else {
                ret = this.getAppInfo();
            }

            return ret.then(function (resp) {
                return resp.version;
            });
        },

        /*
         *   DB
         */
        /**
         * List all the database configurations
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listDBs: function(callback) {
            return this._ajax('GET', '/db', null, callback);
        },
        /**
         * Get information about a specific DB
         *
         * @param {string} dbname - the name of the db
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getDB: function(dbname, callback) {
            return this._ajax('GET', '/db/'+dbname, null, callback);
        },

        /*
         *   KG
         */
        /**
         * Create a Knowledge Graph
         *
         * @param {string} kgname - the name of the KG to create
         * @param {string} [db=default] - the db to put the KG in
         * @param {object} [config={}] - Any KG config to add
         * @param {requestCallback} [callback]
         * @returns {promise}
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
            return this._ajax('POST', '/kb', kgdata, callback);
        },
        /**
         * Get a list of all the KGs from the server
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listKGs: function(callback) {
            return this._ajax('GET', '/kb', null, callback);
        },
        /**
         * Get an array of all the KG names instead of the full objects
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listKGNames: function(callback) {
            var ret;
            if (callback) {
                // The user provided a callback function, so we should use it
                ret = this.listKGs(function(resp) {
                    // Only call the callback with a list of names
                    callback(resp.map(function(kg) {
                        return kg.name;
                    }));
                });
            } else {
                // No callback, just list the kgs
                ret = this.listKGs();
            }

            // Always implement the promise if users choose to use it
            return ret.then(function(resp) {
                // Only return a list or names
                return resp.map(function(kg) {
                    return kg.name;
                });
            });
        },
        /**
         * Get information about a specific KG
         *
         * @param {string} kgname - the name of the KG
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getKG: function(kgname, callback) {
            return this._ajax('GET', '/kb/'+kgname, null, callback);
        },
        /**
         * Get the config of a specifig KG
         *
         * @param {string} kgname - the name of the KG
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getKGConfig: function(kgname, callback) {
            return this._ajax('GET', '/kb/'+kgname+'/config', null, callback);
        },
        /**
         * Update the config for a KG.  FOR ADVANCED USERS ONLY.  This requires a large config object with a
         * very specific structure.
         *
         * @param {string} kgname - the name of the KG to config
         * @param {object} config - the configuration object
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        updateKGConfig: function(kgname, config, callback) {
            return this._ajax('PUT', '/kb/'+kgname+'/config', config, callback);
        },
        /**
         * Delete a KG
         *
         * @param {string} kgname - the KG to delete
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        deleteKG: function(kgname, callback) {
            return this._ajax('DELETE', '/kb/'+kgname, null, callback);
        },

        /*
         *   App Config
         */
        /**
         * Configure an app with a key and value
         *
         * @param {string} kgname - the KG to configure
         * @param {string} appName - the app on the KG to configure
         * @param {string} [member] - the OPTIONAL member to configure (if this is null or an empty string, the config will be set universally)
         * @param {string} property - the property name to set
         * @param {string} value - the value of the property
         * @param {requestCallback} [callback]
         * @returns {promise}
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
                        return self.addKGAppConfig(kgname, appName, configObject, {}, callback);
                    } else {
                        // Add with universal config
                        return self.addKGAppConfig(kgname, appName, {}, configObject, callback);
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
                    return self._ajax('PATCH', '/kb/'+kgname+'/config/'+appName, configData, callback);
                }
            });
        },
        /**
         * Add configuration for an app that DOES NOT already exist.  You should pass in either members, universal or
         * both, but truly none of them are required.
         *
         * @param {string} kgname - the name of the KG
         * @param {string} appName - the name of the new app
         * @param {object} [members={}] - the members configuration
         * @param {object} [universal={}] - the universal configuration
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
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

            return this._ajax('POST', '/kb/'+kgname+'/config', configData, callback);
        },
        /**
         * Adds an empty configuration object for an app on a KG
         *
         * @param {string} kgname - the name of the KG
         * @param {string} appName - the name of the app to create
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        addEmptyKGAppConfig: function(kgname, appName, callback) {
            return this.addKGAppConfig(kgname, appName, {}, {}, callback);
        },
        /**
         * Get the config for a specific app on a KG
         *
         * @param {string} kgname - the name of the KG
         * @param {string} appName - the name of the app
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getKGAppConfig: function(kgname, appName, callback) {
            return this._ajax('GET', '/kb/'+kgname+'/config/'+appName, null, callback);
        },
        /**
         * Delete all configuration information for an app
         *
         * @param {string} kgname - the KG to delete config from
         * @param {string} appName - the app to delete
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        deleteKGAppConfig: function(kgname, appName, callback) {
            return this._ajax('DELETE', '/kb/'+kgname+'/config/'+appName, null, callback);
        },
        /**
         * Update the universal config on an app.  This does a PUT, so it completely replaces any config on the server
         * already
         *
         * @param {string} kgname - the KG name
         * @param {string} appName - the app to configure
         * @param {object} config - the new config object
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        updateKGAppUniversalConfig: function(kgname, appName, config, callback) {
            return this._ajax('PUT', '/kb/'+kgname+'/config/'+appName+'/universal', config, callback);
        },
        /**
         * Add a NEW member to an app on a KG
         *
         * @param {string} kgname - the KG name
         * @param {string} appName - the app name
         * @param {string} memberName - the new member name
         * @param {object} [config={}] - an object of key-value pairs for config
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        addKGAppMember: function(kgname, appName, memberName, config, callback) {
            if (!config) {
                config = {};
            }

            var configData = {
                memberName: memberName,
                config: config
            };

            return this._ajax('POST', '/kb/'+kgname+'/config/'+appName+'/members', configData, callback);
        },
        /**
         * Update the member config on an app.  This does a PUT, so it completely replaces any config on the server
         * already
         *
         * @param {string} kgname - the KG name
         * @param {string} appName - the app name
         * @param {string} memberName - the new member name
         * @param {object} config - an object of key-value pairs for config
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        updateKGAppMember: function(kgname, appName, memberName, config, callback) {
            return this._ajax('PUT', '/kb/'+kgname+'/config/'+appName+'/members/'+memberName+'/config', config, callback);
        },
        /**
         * Delete all of the config info for the given member of an app
         *
         * @param {string} kgname - the KG name
         * @param {string} appName - the app name
         * @param {string} memberName - the member to delete
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        deleteKGAppMember: function(kgname, appName, memberName, callback) {
            return this._ajax('DELETE', '/kb/'+kgname+'/config/'+appName+'/members/'+memberName, null, callback);
        },

        /*
         *   Processes
         */
        /**
         * Get a list of all processes synic has created
         *
         * @param [callback]
         * @returns {promise}
         */
        listProcesses: function(callback) {
            return this._ajax('GET', '/process', null, callback);
        },
        /**
         * Get a list of all the process IDs
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listProcessIDs: function(callback) {
            var ret;
            if (callback) {
                ret = this.listProcesses(function(resp) {
                    callback(resp.map(function(proc) {
                        return proc.id;
                    }));
                });
            } else {
                ret = this.listProcesses();
            }

            return ret.then(function(resp) {
                return resp.map(function(proc) {
                    return proc.id;
                });
            });
        },
        /**
         * Get information about a specific process
         *
         * @param {string} procId - the process ID
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getProcess: function(procId, callback) {
            return this._ajax('GET', '/process/'+procid, null, callback);
        },
        /**
         * Trigger a process to start it
         *
         * @param {string} kgname - the KG to run the process on
         * @param {string} appName - the name of the app to run
         * @param {string} processType - the type of process to run
         * @param {object} [config={}] - Any app-specific config not stored with the KG
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
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

            return this._ajax('POST', '/process', procData, callback);
        },
        /**
         * Get a list of all the available process types
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listProcessTypes: function(callback) {
            return this._ajax('GET', '/processType', null, callback);
        },

        /*
         *   Schedules
         */
        /**
         * Show all the schedules
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listSchedules: function(callback) {
            return this._ajax('GET', '/scheduler/schedule', null, callback);
        },
        /**
         * Create a schedule.  ADVANCED USERS ONLY.  The schedule object has a very specific structure.
         *
         * @param {object} schedule - the schedule object
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        createSchedule: function(schedule, callback) {
            return this._ajax('POST', '/scheduler/schedule', schedule, callback);
        },
        /**
         * Create a schedule from a template that already lives in the synic server.  Show the list of templates using
         * listTemplates().
         *
         * @param {string} templateName - the name of the template
         * @param {object} mappings - the mappings to override in the template
         * @param {boolean} [startAfterCreation=false] - start the schedule after it is created
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
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
                        if (callback) {
                            callback(resp);
                        }
                    });
                };
            } else {
                realCallback = callback;
            }

            return this._ajax('POST', '/scheduler/schedule', data, realCallback);
        },
        /**
         * Get a list of all the templates stored on the server
         * 
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listTemplates: function(callback) {
            return this._ajax('GET', '/scheduler/template', null, callback);
        },
        /**
         * Get information about a specific template
         * 
         * @param {string} templateName - the name of the template
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getTemplate: function(templateName, callback) {
            return this._ajax('GET', '/scheduler/template/'+templateName, null, callback);
        },
        /**
         * Get the mappings for a template - useful to know what mappings you need to provide for the schedule to work
         *
         * @param {string} templateName - the name of the template
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getTemplateMappings: function(templateName, callback) {
            var ret;
            if (callback) {
                ret = this.getTemplate(templateName, function(resp) {
                    callback(resp.mappings);
                });
            } else {
                ret = this.getTemplate(templateName);
            }

            return ret.then(function(resp) {
                return resp.mappings;
            });
        },
        /**
         * Get information about a specific schedule
         * 
         * @param {string} scheduleId - the ID of the schedule
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getSchedule: function(scheduleId, callback) {
            return this._ajax('GET', '/scheduler/schedule/'+scheduleId, null, callback);
        },
        /**
         * Get a list of all the processes associated with the given schedule
         *
         * @param {string} scheduleId - the schedule ID
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listProcessesForSchedule: function(scheduleId, callback) {
            var self = this;
            // Get the schedule first, then do some process-ing
            return this.getSchedule(scheduleId).then(function(schedule) {
                var procIDs = [];

                var resources = schedule.resources;

                // Find all the process IDs first
                for (var resource in resources) {
                    if (resources.hasOwnProperty(resource)) {
                        // Check to see if this resource is a process
                        var resourceUri = resources[resource];
                        if (resourceUri.indexOf("/process") === 0) {
                            // We found a process!!
                            // Now we need to figure out if it's a real procID or if it's a mapping variable
                            var mappingId = resourceUri.split('/')[2];
                            if (mappingId.indexOf('$') === 0) {
                                // This references a mapping variable
                                // pick off the '$'
                                mappingId = mappingId.substring(1);
                                var mappings = schedule.mappings;

                                // Need to check that the mapping exists - being in the resources list doesn't
                                // guarantee that the process has started yet
                                if (mappings.hasOwnProperty(mappingId)) {
                                    // Finally found the ID, phew
                                    procIDs.push(mappings[mappingId]);
                                }
                            } else {
                                // This is a plan procID already, add it to the list
                                procIDs.push(mappingId);
                            }
                        }
                    }
                }

                // Get the info for the appropriate process IDs
                return self.listProcesses().then(function(processes) {
                    var filtered = processes.filter(function(process) {
                        return procIDs.indexOf(process.id) !== -1;
                    });

                    if (callback) {
                        callback(filtered);
                    }
                    return filtered;
                });
            });
        },
        /**
         * In order for this to take effect, you must also change the status of the schedule (synic server limitation)
         *
         * @param {string} scheduleId - the ID of the schedule to update
         * @param {object} mappings - the mappings to change
         * @param {requestCallback} [callback] - the callback function
         * @returns {promise}
         */
        updateScheduleMappings: function(scheduleId, mappings, callback) {
            var updateData = {
                mappings: mappings
            };
            return this._ajax('PATCH', '/scheduler/schedule/'+scheduleId, updateData, callback);
        },
        /**
         * Start the schedule with the given ID
         * 
         * @param {string} scheduleId - the ID of the schedule to start
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        startSchedule: function(scheduleId, callback) {
            return this._ajax('PATCH', '/scheduler/schedule/'+scheduleId, {status: 'STARTING'}, callback);
        },
        /**
         * Stop the schedule with the given ID
         * 
         * @param {string} scheduleId - the ID of the schedule to stop
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        stopSchedule: function(scheduleId, callback) {
            return this._ajax('PATCH', '/scheduler/schedule/'+scheduleId, {status: 'STOPPING'}, callback);
        },

        /*
         *   Job Data
         */
        /**
         * Get the job data for the given KG and process
         * 
         * @param {string} kgname - the KG name
         * @param {string} procId - the process ID of the job
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getJobData: function(kgname, procId, callback) {
            return this._ajax('GET', '/jobdata/'+kgname+'/'+procId, null, callback);
        }

    };

    // Expose SynicClient to the global object
    window.SynicClient = SynicClient;

    // Make it work with AMD things, such as require.js
    // Use lowercase synic here, because the filename is synic.js.  AMD module names generally mirror filenames.
    if (typeof define === "function" && define.amd) {
        define('synic', ['jquery'], function ($) {
            return SynicClient;
        });
    }

    return SynicClient;
})();
