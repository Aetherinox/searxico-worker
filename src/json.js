/*
    Imports
*/

import types from './types.js'

/*
    Json > Format
*/

const formatJSON = (obj, pretty) => JSON.stringify(obj, null, pretty ? 2 : 0)

/*
    Json > Response
*/

const jsonResp = (obj, pretty) => {
    return new Response(formatJSON(obj, pretty), {
        headers: {
            'content-type': types.json,
            'Access-Control-Allow-Origin': '*'
        }
    })
}

/*
    Json > Error
*/


const jsonErr = (error, pretty) => {
    return jsonResp({
        error: typeof error === 'string' ? error : error.message
    }, pretty)
}

/*
    Export
*/

export { jsonResp, jsonErr }
