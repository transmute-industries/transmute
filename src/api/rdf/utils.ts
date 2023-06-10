const VC_RDF_CLASS = 'VerifiableCredential'
const VP_RDF_CLASS = 'VerifiablePresentation'

export const isVC = (claimset) => {
  return claimset.type && (claimset.type === VC_RDF_CLASS || claimset.type.includes(VC_RDF_CLASS))
}
export const isVP = (claimset) => {
  return claimset.type && (claimset.type === VP_RDF_CLASS || claimset.type.includes(VP_RDF_CLASS))
}

