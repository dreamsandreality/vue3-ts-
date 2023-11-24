export type addressLists = {
  address: {
    code: string,
    children: {
      children: {
        code: string,
        name: string
      }[],
      code: string,
      name: string
    }[],
    name: string
  }[]
}[]
