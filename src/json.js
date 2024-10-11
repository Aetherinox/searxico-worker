/*
    Imports
*/

import types from './types.js'

/*
    Json > Format
*/

const formatJSON = (arr, pretty) => JSON.stringify(arr, null, pretty ? 2 : 0)

/*
    Json > Response

    @arg        array arr
    @arg        int code
    #arg        bool pretty
*/

const jsonResp = (arr, code, pretty) => {
    return new Response(formatJSON(arr, pretty), {
        headers: {
            'content-type': types.json,
            'Access-Control-Allow-Origin': '*'
        },
        status: code
    })
}

/*
    Json > Error

    @usage      return jsonErr( { message: "not found" }, 404, true)
                return jsonErr("not found", 404, true)

    @arg        str error
    @arg        int code
    #arg        bool pretty
*/


const jsonErr = (error, code, pretty) => {
    return jsonResp({ response: typeof error === 'string' ? error : error.message, code: code }, code, pretty)
}

/*
    Export
*/

export { jsonResp, jsonErr }
