let arr = ["1231", "654698", "321321", "312321", "6498789"];
let arr2 = [];

arr.forEach((item) => {
  let len = item.length;
  console.log(len);
  console.log(arr2.indexOf(len));
});

console.log(arr2);
