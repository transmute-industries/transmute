export type VpJwtHeader = {
  alg: string
  typ: 'vp+ld+jwt'
  iss?: string
  kid?: string
}