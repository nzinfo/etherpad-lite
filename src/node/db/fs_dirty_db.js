/**
 * 2011 Peter 'Pita' Martischka
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

var dirty = require("dirty");
var async = require("async");

exports.database = function(settings)
{
  this.db=null; 
  
  if(!settings || !settings.filename)
  {
    settings = {filename:null};
  }
  
  this.settings = settings;
  
  //set default settings
  this.settings.cache = 0;
  this.settings.writeInterval = 0;
  this.settings.json = false;
}

exports.database.prototype.init = function(callback)
{
  this.db = new dirty(this.settings.filename);
  this.db.on('load', function(err)
  {
    callback();
  });
}

exports.database.prototype.get = function (key, callback)
{
  var v = this.db.get(key);
  console.log('get key='+key +'\nvalue='+JSON.stringify(v));
  callback(null, v);
}

exports.database.prototype.findKeys = function (key, notKey, callback)
{
  console.log('find keys=' + key + ';not Key=' + notKey );
  var keys=[]
    , regex=this.createFindRegex(key, notKey)
  ;
  
  this.db.forEach(function(key,val){
      if(key.search(regex)!=-1){
        keys.push(key);
      }
    }
  );
  console.log(keys);
  callback(null, keys);
}

exports.database.prototype.set = function (key, value, callback)
{
  console.log('set key='+key);
  this.db.set(key,value,callback);
}

exports.database.prototype.remove = function (key, callback)
{
  console.log('remove key='+key);
  this.db.rm(key,callback);
}

exports.database.prototype.close = function(callback)
{
  if(callback) callback();
}
