import { YouTubeAPI } from "./ytapi.js";
class YTubePl extends YouTubeAPI {
    
    constructor(params) {
        super(params)
    }

    /**
     * 
     * @param {boolean} mine This parameter can only be used in a properly authorized request.
     * @param {string} [channelId] This parameter can only be used in a properly authorized request.
     * @returns {Promise<Array>}
     */
    async list(mine = true, channelId) {

        const 
            options = {
                part: "snippet,status",
                maxResults: 50
            },
            dataPages = []
        ;

        if (arguments.length > 1) {
            options.channelId = channelId;
        } else {
            options.mine = mine
        }
        
        while (true) {
            const data = await this.exec('playlists', 'list', options);
            dataPages.push(data);

            if ( !Object.hasOwn(data, 'nextPageToken') ) {
                break;
            }

            options.pageToken = data.nextPageToken;
        }

        return dataPages;
    }

    /**
     * 
     * @param {string} title Playlist title
     * @param {string} privacyStatus private or public or unlisted
     * @param {string} description
     * @returns {Promise<Object>}
     * @throws {Error} "No title". If the 'title' parameter is not specified
     */
    async insert(title = '', privacyStatus = 'private', description = '') {
        if (title === '')  {
            throw new Error("No title");
        }

        const options = {
            part: "snippet,status",
            resource: {
                snippet: {
                    title,
                    description
                },
                status: {
                    privacyStatus
                }                
            }
        };

        return await this.exec('playlists', 'insert', options);
    }

    /**
     * 
     * @param {string} id Playlist id
     * @returns {Promise<Object>}
     * @throws {Error} "You must specify an 'id' parametr". If the 'id' parameter is not specified.
     */
    async delete(id = '') {
        if (id === '') {
            throw new Error("You must specify an 'id' parametr");
        }
        const options = { id };
        return await this.exec('playlists', 'delete', options);
    }
}

class YTubePlItems extends YouTubeAPI {
    constructor(params) {
        super(params)
    }

    /**
     * 
     * @param {string} playlistId 
     * @returns {Promise<Array>}
     * @throws {Error} "You must specify an 'playlistId' parametr". If the 'playlistId' parameter is not specified.
     */
    async list(playlistId = '') {
        if (playlistId === '') {
            throw new Error("You must specify an 'playlistId' parametr");
        }

        const options = {
                part: "snippet,contentDetails",
                maxResults: 10,
                playlistId
            },
            dataPages = []
        ;

        while (true) {
            const data = await this.exec('playlistItems', 'list', options);
            dataPages.push(data);

            if ( !Object.hasOwn(data, 'nextPageToken') ) {
                break;
            }

            options.pageToken = data.nextPageToken;
        }

        return dataPages;
    }

    /**
     * 
     * @param {string} playlistId 
     * @param {string} videoId 
     * @returns {Promise<Object>}
     * @throws {Error} "You must specify an 'playlistId' and 'videoId' parametrs". If the 'playlistId' parameter is not specified.
     */
    async insert(playlistId = '', videoId = '') {
        if (playlistId === '' || videoId === '') {
            throw new Error("You must specify an 'playlistId' and 'videoId' parametrs");
        }

        const options = {
            part: "snippet,id",
            resource: {
                snippet: {
                    playlistId,
                    resourceId : {
                        kind: "youtube#video",
                        videoId
                    }
                }
            }
        }

        return await this.exec('playlistItems', 'insert', options);
    }

    /**
     * 
     * @param {string} id The id parameter specifies the YouTube playlist item ID for the playlist item that is being deleted. 
     * In a playlistItem resource, the id property specifies the playlist item's ID.
     * @returns {Promise<Object>}
     * @throws {Error} "You must specify an 'id' parametr". If the 'id' parameter is not specified.
     */
    async delete(id = '') {
        if (id === '') {
            throw new Error("You must specify an 'id' parametr");
        }
        const options = { id };
        return await this.exec('playlistItems', 'delete', options);
    }
}

class YTubeSubscr extends YouTubeAPI {
    constructor(params) {
        super(params);
    }

    /**
     * 
     * @param {boolean} mine This parameter can only be used in a properly authorized request. 
     * Set this parameter's value to true to retrieve a feed of the authenticated user's subscriptions.
     * @param {string} channelId 
     * @returns {Promise<Array>}
     */
    async list(mine = true, channelId) {
        
        const 
            options = {
                part: "snippet,contentDetails",
                maxResults: 50
            },
            dataPages = []
        ;

        if (arguments.length > 1) {
            options.channelId = channelId;
        } else {
            options.mine = mine
        }

        while (true) {
            const data = await this.exec('subscriptions', 'list', options);
            dataPages.push(data);

            if ( !Object.hasOwn(data, 'nextPageToken') ) {
                break;
            }

            options.pageToken = data.nextPageToken;
        }

        return dataPages;
    }

    /**
     * 
     * @param {string} channelId The ID that YouTube uses to uniquely identify the subscriber's channel. 
     * The resource_id object identifies the channel that the user subscribed to.     
     * @returns {Promise<Object>}
     * @throws {Error} "You must specify an 'channelId' parametr". If the 'channelId' parameter is not specified.
     */
    async insert(channelId = '') {
        if (channelId === '') {
            throw new Error("You must specify an 'channelId' parametr");
        }

        const options = {
            part: "snippet",
            resource: {
                snippet: {
                    resourceId: {
                        kind: "youtube#channel",
                        channelId
                    }
                }
            }
        };

        return this.exec('subscriptions', 'insert', options);
    }

    /**
     * 
     * @param {string} id The id parameter specifies the YouTube subscription ID for the resource that is being deleted. 
     * In a subscription resource, the id property specifies the YouTube subscription ID.
     * @returns {Promise<Object>}
     * @throws {Error} "You must specify an 'id' parametr". If the 'id' parameter is not specified.
     */
    async delete(id = '') {
        if (id === '') {
            throw new Error("You must specify an 'id' parametr");
        }

        const options = { id };

        return this.exec('subscriptions', 'delete', options);
    }
}

class YTubeSections extends YouTubeAPI {
    constructor(params) {        
        super(params);
        //REMOVE IT: when the methods will be implemented
        console.warn('insert() and delete() methods not implemented!');
    }
    /**
     * 
     * @param {boolean} [mine]
     * @param {string} [channelId]
     * @returns {Promise<Array>}
     */
    async list(mine = true, channelId) {

        const 
            options = {
                part: "snippet,contentDetails"
            },
            dataPages = []
        ;

        if (arguments.length > 1) {
            options.channelId = channelId;
        } else {
            options.mine = mine
        }

        while (true) {
            const data = await this.exec('channelSections', 'list', options);
            dataPages.push(data);

            if ( !Object.hasOwn(data, 'nextPageToken') ) {
                break;
            }

            options.pageToken = data.nextPageToken;
        }
        
        return dataPages;
    }

    //IMPLEMENT
    /**
     * Not implemented
     */
    async insert() {
        throw new Error("Not implemented!");
    }

    //IMPLEMENT
    /**
     * Not implemented
     */
    async delete() {
        throw new Error("Not implemented!");
    }
}


//const pli = new YTubePlItems(options.ytAPI);
//console.log(await pli.list('PLnIgY94VK25_ZiHbgBc0n5zZNEF2AwEkJ'));
export {
    YTubePl,
    YTubePlItems,
    YTubeSubscr,
    YTubeSections,    
}