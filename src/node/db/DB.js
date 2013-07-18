/**
 * The DB Module provides a database initalized with the settings 
 * provided by the settings module
 */

/*
 * 2011 Peter 'Pita' Martischka (Primary Technology Ltd)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ueberDB = require("ueberDB");
var settings = require("../utils/Settings");
var log4js = require('log4js');

//set database settings
var db = new ueberDB.database(settings.dbType, settings.dbSettings, null, log4js.getLogger("ueberDB"));

var session_db = null;

var dirty_fs_db = require("./fs_dirty_db");

if(settings.dbSettings.variety && settings.dbSettings.variety=="fs") {
  // hot fix.
  // console.log('11111111111111111 fix');
  db.db_module  =  dirty_fs_db;

  // check session db
  if(settings.dbSettings.session_base) {
    var s = settings.dbSettings.session_base;
    // console.log('create database ' + s.dbType);
    session_db = new ueberDB.database(s.dbType, s.dbSettings, null, log4js.getLogger("ueberDB"));
    session_db.__marker = 'hello';
  }
}


/**
 * The UeberDB Object that provides the database functions
 */
exports.db = null;
exports.session_db = null;

/**
 * Initalizes the database with the settings provided by the settings module
 * @param {Function} callback 
 */
exports.init = function(callback)
{
  //initalize the database async
  db.init(function(err)
  {
    //there was an error while initializing the database, output it and stop 
    if(err)
    {
      console.error("ERROR: Problem while initalizing the database");
      console.error(err.stack ? err.stack : err);
      process.exit(1);
    }
    //everything ok
    else
    {
      exports.db = db;  
      // init session base
      if(session_db) {
        //console.log('use session db.');
        session_db.init(function(err) {
            //there was an error while initializing the database, output it and stop 
            if(err)
            {
              console.error("ERROR: Problem while initalizing the database");
              console.error(err.stack ? err.stack : err);
              process.exit(1);
            }
            //everything ok
            else
            {
              exports.session_db = session_db;  
              callback(null);
            }
        }); // should never wrong.
      }else{
        exports.session_db = db; 
        callback(null); 
      }
    }
  });
}
