/**
 * @version: 0.2.0
 * @author: Clark Perkins <clark.perkins@digitalreasoning.com>
 * @date: 2014-12-05
 */
(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory(jQuery);
    } else if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        global.SynicClient = factory(jQuery);
    }
} (window, function ($) {
    if ( typeof $ === 'undefined' ) {
        throw new Error( 'synic.js requires jQuery' )
    }

    /**
     * This is what all callback functions should look like
     *
     * @callback requestCallback
     * @param {(object|Array|string)} responseBody - the response body
     */

    /**
     * Represents a synic client object with methods for all the synic functionality.
     * The URL defaults to the empty string, meaning you're hitting the synic api within the same app.
     * (e.g sending an ajax request to '/synic/api/..' without the hostname or port)
     *
     * @param {string} [synicURL='']- the URL of the synic server.  Defaults to the empty string.
     * @constructor
     */
    var SynicClient = function(synicURL) {
        if (!synicURL) {
            // Default URL
            this.synicURL = '';
        } else {
            this.synicURL = synicURL;
        }
        this.errorCallback = function (xhr) {};
    };

    SynicClient.prototype = {
        constructor: SynicClient,

        /**
         * Helper method, to be used by all other methods - NOT MEANT TO BE USED BY THE END USER
         *
         * @param {string} method - the request method
         * @param {string} endpoint - the resource endpoint
         * @param {object} [data] - any request data (only used if it is not null or undefined)
         * @param {requestCallback} [callback] - a callback function that will be called with the response as it's single parameter
         * @returns {promise}
         * @private
         */
        _ajax: function (method, endpoint, data, callback) {
            var self = this;
            var ajaxData = {
                type: method,
                url: this.synicURL + '/synic/api' + endpoint,
                contentType: 'application/json',
                headers: {},
                cache: false,
                success: function (response, status, xhr) {
                    if (typeof callback === 'function') {
                        callback(response);
                    }
                },
                error: function (xhr, status, error) {
                    self.errorCallback(xhr);
                    if (typeof callback === 'function') {
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
         * Helper method, parses the date strings that synic returns
         *
         * @param {string} dateString - the date string
         * @returns {string}
         * @private
         */
        _parseDate: function (dateString) {
            if (dateString) {
                var year = dateString.substring(0, 4);
                var month = dateString.substring(5, 7); // Zero indexed
                var day = dateString.substring(8, 10);

                var hour = dateString.substring(11, 13);
                var minute = dateString.substring(14, 16);
                var second = dateString.substring(17, 19);

                var milli = dateString.substring(20, 23);

                var d = new Date(year, month - 1, day, hour, minute, second, milli);

                return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            } else {
                return null;
            }
        },

        /**
         * Change the URL if need be
         * @param {string} url - the new URL
         */
        setURL: /* istanbul ignore next */ function (url) {
            this.synicURL = url;
        },

        /*
         *   Synic App
         */
        /**
         * Get the synic root endpoint
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getRoot: /* istanbul ignore next */ function (callback) {
            return this._ajax('GET', '/', null, callback);
        },
        /**
         * Get the synic server info
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getAppInfo: /* istanbul ignore next */ function (callback) {
            return this._ajax('GET', '/app', null, callback);
        },
        /**
         * Get the version of the synic server
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getVersion: function (callback) {
            return this.getAppInfo().then(function (resp) {
                if (typeof callback === 'function') {
                    callback(resp.version);
                }
                return resp.version;
            });
        },

        /*
         *   KG
         */
        /**
         * Create a Knowledge Graph
         *
         * @param {string} kgname - the name of the KG to create
         * @param {object} [config={}] - Any KG config to add
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        createKG: function (kgname, config, callback) {
            if (!config) {
                config = {};
            }

            var kgdata = {
                name: kgname,
                config: config
            };
            return this._ajax('POST', '/kb', kgdata, callback);
        },
        /**
         * Get a list of all active KGs
         *
         * @param {number} [processLimit]
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listActiveKGs: function (processLimit, callback) {
            var self = this;

            if (typeof processLimit === 'undefined') {
                processLimit = 10;
            }

            return this._ajax('GET', '/kb').then(function (kgs) {
                return self.listProcessesPaged(processLimit).then(function (processes) {
                    // Attach all the processes for each KG
                    kgs.forEach(function (kg) {
                        kg.processes = processes.filter(function (proc) {
                            return proc.kb === kg.name;
                        });
                    });

                    // Sort the KGs by name
                    var sorted = kgs.sort(function (a, b) {
                        if (a.name < b.name) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });

                    if (typeof callback === 'function') {
                        callback(sorted);
                    }
                    return sorted;
                });
            });
        },
        /**
         * Get a list of all pending KGs (creating & deleting)
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listPendingKGs: function (callback) {
            return this._ajax('GET', '/kb/pending', null, callback);
        },
        /**
         * Get a list of all the KGs from the server
         *
         * @param {number} [processLimit]
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listKGs: function (processLimit, callback) {
            return this.listActiveKGs(processLimit, callback);
        },
        /**
         * Get an array of all the KG names instead of the full objects
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listKGNames: function (callback) {
            return this._ajax('GET', '/kb').then(function (kgs) {
                var ret = kgs.map(function (kg) {
                    return kg.name;
                });

                if (typeof callback === 'function') {
                    callback(ret);
                }

                return ret;
            });
        },
        /**
         * Get information about a specific KG
         *
         * @param {string} kgname - the name of the KG
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getKG: /* istanbul ignore next */ function (kgname, callback) {
            return this._ajax('GET', '/kb/' + encodeURIComponent(kgname), null, callback);
        },
        /**
         * Get the config of a specifig KG
         *
         * @param {string} kgname - the name of the KG
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getKGConfig: /* istanbul ignore next */ function (kgname, callback) {
            return this._ajax('GET', '/kb/' + encodeURIComponent(kgname) + '/config', null, callback);
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
        updateKGConfig: /* istanbul ignore next */ function (kgname, config, callback) {
            return this._ajax('PUT', '/kb/' + encodeURIComponent(kgname) + '/config', config, callback);
        },
        /**
         * Delete a KG
         *
         * @param {string} kgname - the KG to delete
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        deleteKG: /* istanbul ignore next */ function (kgname, callback) {
            return this._ajax('DELETE', '/kb/' + encodeURIComponent(kgname), null, callback);
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
        configKG: function (kgname, appName, member, property, value, callback) {
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

            // Return a promise
            return this.getKGConfig(kgname).then(function (resp) {
                // Check to see if the app exists first
                var exists = false;
                resp.forEach(function (appconf) {
                    if (appconf.appName === appName) {
                        exists = true;
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
                    return self._ajax('PATCH', '/kb/' + encodeURIComponent(kgname) + '/config/' + encodeURIComponent(appName), configData, callback);
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
        addKGAppConfig: function (kgname, appName, members, universal, callback) {
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

            return this._ajax('POST', '/kb/' + encodeURIComponent(kgname) + '/config', configData, callback);
        },
        /**
         * Adds an empty configuration object for an app on a KG
         *
         * @param {string} kgname - the name of the KG
         * @param {string} appName - the name of the app to create
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        addEmptyKGAppConfig: /* istanbul ignore next */ function (kgname, appName, callback) {
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
        getKGAppConfig: /* istanbul ignore next */ function (kgname, appName, callback) {
            return this._ajax('GET', '/kb/' + encodeURIComponent(kgname) + '/config/' + encodeURIComponent(appName), null, callback);
        },
        /**
         * Delete all configuration information for an app
         *
         * @param {string} kgname - the KG to delete config from
         * @param {string} appName - the app to delete
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        deleteKGAppConfig: /* istanbul ignore next */ function (kgname, appName, callback) {
            return this._ajax('DELETE', '/kb/' + encodeURIComponent(kgname) + '/config/' + encodeURIComponent(appName), null, callback);
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
        updateKGAppUniversalConfig: /* istanbul ignore next */ function (kgname, appName, config, callback) {
            return this._ajax('PUT', '/kb/' + encodeURIComponent(kgname) + '/config/' + encodeURIComponent(appName) + '/universal', config, callback);
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
        addKGAppMember: /* istanbul ignore next */ function (kgname, appName, memberName, config, callback) {
            if (!config) {
                config = {};
            }

            var configData = {
                memberName: memberName,
                config: config
            };

            return this._ajax('POST', '/kb/' + encodeURIComponent(kgname) + '/config/' + encodeURIComponent(appName) + '/members', configData, callback);
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
        updateKGAppMember: /* istanbul ignore next */ function (kgname, appName, memberName, config, callback) {
            return this._ajax('PUT', '/kb/' + encodeURIComponent(kgname) + '/config/' + encodeURIComponent(appName) + '/members/' + encodeURIComponent(memberName) + '/config', config, callback);
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
        deleteKGAppMember: /* istanbul ignore next */ function (kgname, appName, memberName, callback) {
            return this._ajax('DELETE', '/kb/' + encodeURIComponent(kgname) + '/config/' + encodeURIComponent(appName) + '/members/' + encodeURIComponent(memberName), null, callback);
        },
        /**
         * Get the global config object for a KG
         *
         * @param {string} kgname - the KG to configure
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getKGGlobalConfig: /* istanbul ignore next */ function (kgname, callback) {
            return this._ajax('GET', '/kb/' + encodeURIComponent(kgname) + '/globalConfig', null, callback);
        },
        /**
         * Add a single property/value pair the the global config object
         *
         * @param {string} kgname - the KG to configure
         * @param {string} propName - the property to add
         * @param {string} value - the value associated with the property
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        addKGGlobalProperty: /* istanbul ignore next */ function (kgname, propName, value, callback) {
            var config = {};
            config[propName] = value;
            return this._ajax('PATCH', '/kb/' + encodeURIComponent(kgname) + '/globalConfig', config, callback);
        },
        /**
         * Update the whole global config object
         *
         * @param {string} kgname - the KG to configure
         * @param {object} config - the new config object
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        updateKGGlobalConfig: /* istanbul ignore next */ function (kgname, config, callback) {
            return this._ajax('PUT', '/kb/' + encodeURIComponent(kgname) + '/globalConfig', config, callback);
        },

        /*
         *   Processes
         */
        /**
         * Get a list of all processes synic has created
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listProcesses: function (callback) {
            var self = this;
            return this._ajax('GET', '/process').then(function (processes) {
                // Sort the processes by time requested
                var sorted = processes.sort(function (a, b) {
                    if (a.requestedTime < b.requestedTime) {
                        return -1;
                    } else {
                        return 1;
                    }
                });

                sorted.forEach(function (proc) {
                    proc.requestedTime = self._parseDate(proc.requestedTime);
                    proc.startedTime = self._parseDate(proc.startedTime);
                    proc.completedTime = self._parseDate(proc.completedTime);
                    if (proc.steps) {
                        proc.steps.forEach(function (step) {
                            step.startTime = self._parseDate(step.startTime);
                            step.endTime = self._parseDate(step.endTime);
                        });
                    }
                });

                if (typeof callback === 'function') {
                    callback(sorted);
                }
                return sorted;
            });
        },

        /**
         * Get a paged list of all processes synic has created
         *
         * @param {number} limit - the number of processes to return
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listProcessesPaged: function (limit, callback) {
            if (typeof limit === 'undefined') {
                limit = 10;
            }

            var self = this;

            return this._ajax('GET', '/processPaged?limit='+limit).then(function (resp) {
                var processes = resp.results;
                processes.forEach(function (proc) {
                    proc.requestedTime = self._parseDate(proc.requestedTime);
                    proc.startedTime = self._parseDate(proc.startedTime);
                    proc.completedTime = self._parseDate(proc.completedTime);
                    if (proc.steps) {
                        proc.steps.forEach(function (step) {
                            step.startTime = self._parseDate(step.startTime);
                            step.endTime = self._parseDate(step.endTime);
                        });
                    }
                });

                if (typeof callback === 'function') {
                    callback(processes);
                }
                return processes;
            });
        },

        /**
         * Get a list of all the process IDs
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listProcessIDs: function (callback) {
            return this.listProcesses().then(function (processes) {
                var ids = processes.map(function (proc) {
                    return proc.id;
                });

                if (typeof callback === 'function') {
                    callback(ids);
                }

                return ids;
            });
        },
        /**
         * Get information about a specific process
         *
         * @param {string} procId - the process ID
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getProcess: function (procId, callback) {
            var self = this;

            return this._ajax('GET', '/process/' + encodeURIComponent(procId)).then(function (proc) {
                proc.requestedTime = self._parseDate(proc.requestedTime);
                proc.startedTime = self._parseDate(proc.startedTime);
                proc.completedTime = self._parseDate(proc.completedTime);

                if (proc.steps) {
                    proc.steps.forEach(function (step) {
                        step.startTime = self._parseDate(step.startTime);
                        step.endTime = self._parseDate(step.endTime);
                    });
                }

                if (typeof callback === 'function') {
                    callback(proc);
                }

                return proc;
            });
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
        triggerProcess: function (kgname, appName, processType, config, callback) {
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
         * Re run a failed process using the same procId
         *
         * @param {string} procId - the failed process to re-run
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        triggerFailedProcess: function (procId, callback) {
            var self = this;

            return this.getProcess(procId).then(function (process) {

                // Keep all the old config
                var newConfig = process.invocationConfig;
                // Add the useProcessId flag
                newConfig.useProcessId = procId;

                return self.triggerProcess(process.kb, process.application, process.processType, newConfig, callback);
            });
        },
        /**
         * Kill the process with the specified procId
         *
         * @param {string} procId - the process ID to kill
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        killProcess: /* istanbul ignore next */ function (procId, callback) {
            return this._ajax('PATCH', '/process/' + encodeURIComponent(procId), {"issuedCommand": "CANCEL"}, callback);
        },
        /**
         * Get a list of all the available process types
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listProcessTypes: function (callback) {
            return this._ajax('GET', '/processType').then(function (resp) {
                var sorted = resp.sort(function (a, b) {
                    if (a.name < b.name) {
                        return -1;
                    } else {
                        return 1;
                    }
                });

                if (typeof callback === 'function') {
                    callback(sorted);
                }

                return sorted;
            });
        },
        /**
         * Get a list of all the runnable applications
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listApplications: function (callback) {
            return this._ajax('GET', '/application').then(function (resp) {
                resp.forEach(function (app) {
                    app.processTypes = app.processTypes.sort();
                });

                var sorted = resp.sort(function (a, b) {
                    if (a.name < b.name) {
                        return -1;
                    } else {
                        return 1;
                    }
                });

                if (typeof callback === 'function') {
                    callback(sorted);
                }

                return sorted;
            });
        },

        /*
         *   Schedules
         */
        /**
         * Show all the schedules
         *
         * @param {number} [processLimit]
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listSchedules: function (processLimit, callback) {
            var self = this;

            if (typeof processLimit === 'undefined') {
                processLimit = 10;
            }

            return this._ajax('GET', '/scheduler/schedule').then(function (schedules) {
                return self.listProcessesPaged(processLimit).then(function (processes) {

                    schedules.forEach(function (schedule) {
                        var procIDs = self._listProcessIdsForSchedule(schedule);

                        schedule.processes = processes.filter(function (process) {
                            return procIDs.indexOf(process.id) !== -1;
                        });
                    });

                    // Sort by the start time of the first process
                    schedules.sort(function (a, b) {
                        // If there's no processes loaded yet,
                        if (a.processes.length === 0) {
                            return 1;
                        } else if (b.processes.length === 0) {
                            return -1;
                        } else if (a.processes[0].startedTime < b.processes[0].startedTime) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });

                    if (typeof callback === 'function') {
                        callback(schedules);
                    }

                    return schedules;
                });
            });
        },
        /**
         * Create a schedule.  ADVANCED USERS ONLY.  The schedule object has a very specific structure.
         *
         * @param {object} schedule - the schedule object
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        createSchedule: /* istanbul ignore next */ function (schedule, callback) {
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
        createScheduleFromTemplate: function (templateName, mappings, startAfterCreation, callback) {
            var self = this;

            var data = {
                templateName: templateName
            };
            if (mappings) {
                data.mappings = mappings;
            }

            // Return a promise
            return this._ajax('POST', '/scheduler/schedule', data).then(function (resp) {
                if (startAfterCreation) {
                    return self.startSchedule(resp.id).then(function (startResp) {
                        if (typeof callback === 'function') {
                            callback(startResp);
                        }
                        return startResp;
                    });
                } else {
                    if (typeof callback === 'function') {
                        callback(resp);
                    }
                    return resp;
                }
            });
        },
        /**
         * Get a list of all the templates stored on the server
         *
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        listTemplates: /* istanbul ignore next */ function (callback) {
            return this._ajax('GET', '/scheduler/template', null, callback);
        },
        /**
         * Get information about a specific template
         *
         * @param {string} templateName - the name of the template
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getTemplate: /* istanbul ignore next */ function (templateName, callback) {
            return this._ajax('GET', '/scheduler/template/' + encodeURIComponent(templateName), null, callback);
        },
        /**
         * Get the mappings for a template - useful to know what mappings you need to provide for the schedule to work
         *
         * @param {string} templateName - the name of the template
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getTemplateMappings: function (templateName, callback) {
            return this.getTemplate(templateName).then(function (template) {
                var mappings = template.mappings;

                if (typeof callback === 'function') {
                    callback(mappings);
                }

                return mappings;
            });
        },
        /**
         * Get information about a specific schedule
         *
         * @param {string} scheduleId - the ID of the schedule
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        getSchedule: /* istanbul ignore next */ function (scheduleId, callback) {
            return this._ajax('GET', '/scheduler/schedule/' + encodeURIComponent(scheduleId), null, callback);
        },
        /**
         * Get all the process IDs associated with a schedule.
         *
         * @param {Object} schedule - the schedule object ALREADY FETCHED FROM THE SERVER
         * @returns {Array}
         * @private
         */
        _listProcessIdsForSchedule: function (schedule) {
            var procIDs = [];

            var resources = schedule.resources;
            /*
             The resources object looks like this:
             {
             "kbName": "/kb/$kbName",
             "rivulet": "/process/$rivuletId",
             "frequencies": "/process/$frequenciesId",
             ...
             }

             We only want the processes, so we'll look for resource values that start with '/process', then grab
             the procId from the mappings dict. (the $ implies that the value should be pulled from the mappings)
             */

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
                            // This is a plain procID already, add it to the list
                            procIDs.push(mappingId);
                        }
                    }
                }
            }

            return procIDs;
        },
        /**
         * In order for this to take effect, you must also change the status of the schedule (synic server limitation)
         *
         * @param {string} scheduleId - the ID of the schedule to update
         * @param {object} mappings - the mappings to change
         * @param {requestCallback} [callback] - the callback function
         * @returns {promise}
         */
        updateScheduleMappings: /* istanbul ignore next */ function (scheduleId, mappings, callback) {
            var updateData = {
                mappings: mappings
            };
            return this._ajax('PATCH', '/scheduler/schedule/' + encodeURIComponent(scheduleId), updateData, callback);
        },
        /**
         * Start the schedule with the given ID
         *
         * @param {string} scheduleId - the ID of the schedule to start
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        startSchedule: /* istanbul ignore next */ function (scheduleId, callback) {
            return this._ajax('PATCH', '/scheduler/schedule/' + encodeURIComponent(scheduleId), {status: 'STARTING'}, callback);
        },
        /**
         * Stop the schedule with the given ID
         *
         * @param {string} scheduleId - the ID of the schedule to stop
         * @param {requestCallback} [callback]
         * @returns {promise}
         */
        stopSchedule: /* istanbul ignore next */ function (scheduleId, callback) {
            return this._ajax('PATCH', '/scheduler/schedule/' + encodeURIComponent(scheduleId), {status: 'STOPPING'}, callback);
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
        getJobData: /* istanbul ignore next */ function (kgname, procId, callback) {
            return this._ajax('GET', '/jobdata/' + encodeURIComponent(kgname) + '/' + encodeURIComponent(procId), null, callback);
        }

    };

    return SynicClient;
}));