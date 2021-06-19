import CookieManager from '@react-native-cookies/cookies'

/**
 * Sets cookie to access cloudfront
 * @property {String} domain
 * @property {String} keyPairId
 * @property {String} policy
 * @property {String} signature
 * @property {String} expiresAt
 * @returns {Void}
 */
const videoAccessCookie = (domain, keyPairId, policy, signature, expiresAt) => {
  const cookies = [
    {
      name: 'CloudFront-Key-Pair-Id',
      value: keyPairId,
    },
    {
      name: 'CloudFront-Policy',
      value: policy,
    },
    {
      name: 'CloudFront-Signature',
      value: signature,
    },
  ]

  cookies.map((cookie) => {
    CookieManager.set(`https://${domain}`, {
      name: cookie.name,
      value: cookie.value,
      domain: domain,
      path: '/',
      version: '1',
      expires: expiresAt,
    })
  })
}

export default videoAccessCookie
