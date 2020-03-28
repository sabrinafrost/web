const errors = require('./errors')

/* Example options object:
 *  {
 *      url: http://example.com,
 *      method: 'post',
 *      headers: {
 *          'Content-Type': 'application/json',
 *          'User-Agent': 'Mozilla/5.0, etc...'
 *      },
 *      data: {
 *          'key': 'value
 *      }
 *  }
 */

const webRequest = async options => {
  options.validateStatus = () => {
    return true
  }

  const axios = require('axios')
  const response = await axios(options)

  if (response.status !== 200) return errors.response.json(response.status, response.statusText)
  if (response.data) return response.data

  return null
}

module.exports = {
  webRequest
};
