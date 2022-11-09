"use strict";

import * as fs from 'fs/promises';
import path from 'path';

class JsonDB {
    db = new Map();
    path = '';    

    /**
     * 
     * @param  {...string} loadPath 
     * @returns {Promise<this>}
     */
    async load(...loadPath) {
        let dbPath = '';

        if (loadPath.length === 0) {
            dbPath = this.path;

        } else {
            dbPath = path.join(...loadPath);
        }

        try {
            const data = new Map( JSON.parse(
                await fs.readFile(dbPath, "utf-8")
            ));
            
            this.path = dbPath;
            this.db = data;

        } catch(e) {
            throw new Error("Data has not been loaded:", e);
        }

        return this;
    }

    /**
     * 
     * @param  {...string} savePath 
     * @returns {this}
     */
    async save(...savePath) {
        let dbPath = '';

        if (savePath.length === 0) {
            dbPath = this.dbPath;
        } else {
            dbPath = path.join(...savePath);
        }

        try {
            const dataString = JSON.stringify([...this.db], null, 4);
            fs.writeFile(dbPath, dataString, "utf-8");
            this.path = dbPath;

        } catch(e) {
            throw new Error("Data has not been loaded:", e);
        }
        return this;
    }

    /**
     * 
     * @param {string|number} key 
     * @param {*} data 
     * @returns {this}
     */
    set(key, data) {
       this.db.set(key, data);
       return this;
    }
    /**
     * 
     * @param {string|number} key 
     * @returns {*}
     */
    get(key) {        
        return this.get(key);
    }
}

export {
    JsonDB
}