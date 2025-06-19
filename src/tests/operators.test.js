// const a = {
// 	b: {
// 		c: {
// 			d: 40,
// 		}
// 	}
// }

// // This code demonstrates the use of optional chaining in JavaScript.
// const value = a?.b?.c?.d;
// console.log(value);

let a = null, b = undefined, c = 0, d = false, e = '', f = NaN, g = {};

// const valueA = a || 'default A';
// const valueB = b || 'default B';
// const valueC = c || 'default C'; // must be 0 not 'default C'
// const valueD = d || 'default D'; // must be false not 'default D'
// const valueE = e || 'default E'; // must be '' not 'default E'
// const valueF = f || 'default F';
// const valueG = g || 'default G';

// console.log({ valueA, valueB, valueC, valueD, valueE, valueF, valueG });

// Assignment nullish coalescing operator (??) is used to assign a default value only if the left-hand side is null or undefined.
// const valueA = a ?? 'default A';
// const valueB = b ?? 'default B';
// const valueC = c ?? 'default C'; // must be 0 not 'default C'
// const valueD = d ?? 'default D'; // must be false not 'default D'
// const valueE = e ?? 'default E'; // must be '' not 'default E'
// const valueF = f ?? 'default F';
// const valueG = g ?? 'default G';

// console.log({ valueA, valueB, valueC, valueD, valueE, valueF, valueG });

// If value is null or undefined, it will be assigned a new value.
a ??= 'new value A';
b ??= 'new value B';
c ??= 'new value C'; // must be 0 not 'new value C'
d ??= 'new value D'; // must be false not 'new value D'
e ??= 'new value E'; // must be '' not 'new value E'
f ??= 'new value F';
g ??= 'new value G';

console.log({ a, b, c, d, e, f, g });