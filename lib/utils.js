//walk through & do work on properties
function walk(obj, callback) {
  Object.keys(obj).forEach((key, index) => {
    console.log("propName: ", key);
//    walk(key, callback);
  })
}

//

let person = {name: "Tuan", age: 25, address: {street: "81 Hung Yen", city: "Nam Dinh", post: { postID: 1234, postCode: "ABC"}}};

walk(person);
