declare interface ItemObject {
  [key: string]: Item
}

declare interface ItemArray {
  [key: number]: Item
}

declare type ItemIterable = ItemObject | ItemArray

declare type Item = ItemIterable | number | string | boolean | null

declare interface Slice {
  result: ItemIterable,
  object: ItemIterable,
}

declare type Stack = Array<Slice>

const isArray = Array.isArray

const isObject = function (object: any) {
  return object != null && typeof object == 'object' && !isArray(object);
}

const isFlat = function (object: ItemObject) {
  for (let key in object) {
    const item = object[key]
    if (isObject(item) || isArray(item)){
      return false
    }
  }
  return true
}

export const merge = function (base: object, ...objects: object[]): object {
  let result: ItemIterable = <ItemIterable>base
  for (const object of <ItemIterable[]>objects) {
    if (isArray(result) && isArray(object)) {
      result = <ItemIterable>result.slice(0, object.length)
    }
    const stack: Stack = [{result, object}]
    while (stack.length) {
      const slice: Slice = stack.pop() || {result: {}, object: {}}
      for (const key in slice.object) {
        const itemObject: Item = (<ItemObject>slice.object)[key]
        const itemResult: Item = (<ItemObject>slice.result)[key]
        if (isFlat(<ItemObject>itemObject)) {
          if (isObject(itemObject) && isObject(itemResult)) {
            (<ItemObject>slice.result)[key] = {
              ...<ItemObject>itemResult,
              ...<ItemObject>itemObject
            }
          } else {
            (<ItemObject>slice.result)[key] = itemObject
          }
        } else {
          if (isArray(itemObject) && isArray(itemResult)) {
            (<ItemObject>slice.result)[key] = itemResult.slice(0, itemObject.length)
          } else if (isArray(itemObject) && !isArray(itemResult)) {
            (<ItemObject>slice.result)[key] = []
          } else if (isObject(itemObject) && !isObject(itemResult)) {
            (<ItemObject>slice.result)[key] = {}
          }
          stack.push({
            result: (<ItemObject>slice.result)[key] as ItemObject,
            object: (<ItemObject>slice.object)[key] as ItemObject,
          })
        }
      }
    }
  }
  return <object>result
}

function jsonClone (object: object): object {
  return JSON.parse(JSON.stringify(object))
}

export const mergeImmutable = function (...objects: object[]): object {
  const objectsClone: object[] = <object[]>jsonClone(objects)
  return merge(objectsClone[0], ...objectsClone.slice(1))
}
