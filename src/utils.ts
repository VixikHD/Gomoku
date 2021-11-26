export function clone(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj)
}

export function cloneObjectArray(arr) {
    let cloneArr = [];
    for(let i : number = 0; i < arr.length; ++i) {
        cloneArr[i] = clone(arr[i]);
    }
    return cloneArr;
}