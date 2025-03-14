const checkIsNotEmpty = <T extends object>(obj: T | {}): obj is T => {
  return Object.keys(obj).length !== 0
}

export default checkIsNotEmpty
