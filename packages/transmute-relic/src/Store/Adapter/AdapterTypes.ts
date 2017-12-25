export interface IFSA {
  type: string
  payload: any
  meta: any
}

export interface IWritableEventParams {
  keyType: string
  keyValue: string
  valueType: string
  valueValue: string
}
