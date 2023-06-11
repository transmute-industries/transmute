export type VcJwtHeader = {
  alg: string
  typ: 'vc+ld+jwt'
  iss?: string
  kid?: string
}