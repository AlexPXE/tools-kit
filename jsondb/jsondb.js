"use strict";

import * as fs from 'fs/promises';
import path from 'path';

class JsonDB {
    db = new Map();
    path = '';

    /**
     * 
     * @param  {string} loadPath 
     * @returns {Promise<this>}
     * @throws {Error} If reading from disk fails
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
     * @returns {Promise<this>}
     * @throws {Error} If writing to disk fails
     */
    async save(...savePath) {
        let dbPath = savePath.length === 0 ? this.path : path.join(...savePath);

        try {            
            await fs.writeFile(dbPath, this.toJSON(), "utf-8");
            this.path = dbPath;

        } catch(e) {
            throw new Error("Data has not been saved:", e);
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
        console.log(key);
        return this.db.get(key);
    }

    toJSON() {
        return JSON.stringify([...this.db], null, 4);
    }
}

export {
    JsonDB
}