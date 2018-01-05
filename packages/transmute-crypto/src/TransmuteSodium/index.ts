const _sodium = require('libsodium-wrappers')

export const getSodium = async () => {
  await _sodium.ready
  const sodium = _sodium
  return sodium
}

export const generateSecretKey = async () => {
  const sodium = await getSodium()
  return sodium.crypto_secretstream_xchacha20poly1305_keygen()
}

export * from './SecretKeyEventTransformer'
export * from './AuthenticatedEventTransformer'
export * from './UnauthenticatedEventTransformer'
export * from './EventTypes'
