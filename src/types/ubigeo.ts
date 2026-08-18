export interface UbigeoDistrict {
  ubigeo: string
  id: number
  inei?: string
}

export type UbigeoData = Record<
  string,
  Record<string, Record<string, UbigeoDistrict>>
>

