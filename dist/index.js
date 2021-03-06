'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var net = _interopDefault(require('net'));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol = _root.Symbol;

var _Symbol = Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$1.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$2.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag$1 = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var _createBaseEach = createBaseEach;

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = _createBaseEach(_baseForOwn);

var _baseEach = baseEach;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity_1;
}

var _castFunction = castFunction;

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray_1(collection) ? _arrayEach : _baseEach;
  return func(collection, _castFunction(iteratee));
}

var forEach_1 = forEach;

var each = forEach_1;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$6 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$4).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty$1 = defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty$1) {
    _defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

var _arrayAggregator = arrayAggregator;

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  _baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

var _baseAggregator = baseAggregator;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/* Built-in method references that are verified to be native. */
var Map$1 = _getNative(_root, 'Map');

var _Map = Map$1;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$6.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$1:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$1:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$1:
      return object.name == other.name && object.message == other.message;

    case regexpTag$1:
    case stringTag$1:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$1:
      var convert = _mapToArray;

    case setTag$1:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$a.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$8.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$8.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray_1(collection) ? _arrayAggregator : _baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, _baseIteratee(iteratee, 2), accumulator);
  };
}

var _createAggregator = createAggregator;

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The order of grouped values
 * is determined by the order they occur in `collection`. The corresponding
 * value of each key is an array of elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': [4.2], '6': [6.1, 6.3] }
 *
 * // The `_.property` iteratee shorthand.
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = _createAggregator(function(result, value, key) {
  if (hasOwnProperty$9.call(result, key)) {
    result[key].push(value);
  } else {
    _baseAssignValue(result, key, [value]);
  }
});

var groupBy_1 = groupBy;

function uuid(len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  var uuid = [],
      i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r; // rfc4122 requires these characters

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4"; // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}
function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

class BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    _defineProperty(this, "log", void 0);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "manufacturer", void 0);

    _defineProperty(this, "model", void 0);

    _defineProperty(this, "platform", void 0);

    _defineProperty(this, "infoService", void 0);

    _defineProperty(this, "serialnumber", void 0);

    _defineProperty(this, "frmwarerevision", void 0);

    this.log = log;
    this.id = accessoryConfig.id;
    this.type = accessoryConfig.type;
    this.name = accessoryConfig.name;
    this.manufacturer = "crestron";
    this.model = accessoryConfig.type + " ID" + accessoryConfig.id;
    this.serialnumber = uuid(8, 16);
    this.frmwarerevision = "2.0";
    this.platform = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = this.platform.api;
    const infoService = new Service.AccessoryInformation();
    infoService.setCharacteristic(Characteristic.Manufacturer, this.manufacturer).setCharacteristic(Characteristic.Model, this.model).setCharacteristic(Characteristic.SerialNumber, this.serialnumber).setCharacteristic(Characteristic.FirmwareRevision, this.frmwarerevision); // store the infoService in the Accessory instance

    this.infoService = infoService;
  }

  identify(callback) {
    callback();
  }

}

function getPowerState(callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "Power"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-Power`, jsonMessage); // handle response to `Get` Power requests

  api.once(`Response-${this.type}-${this.id}-Get-Power`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-Power`);
    const powered = Boolean(value);
    callback(null, powered);
  });
}
function setPowerState(powered, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Set",
    Property: "Power",
    Value: powered ? 1 : 0
  })}||`;
  /*
    Logic to handle Apple's Home app Dimmer behavior:
      Apple's Home app sets a Power and Brightness characteristic when interacting
    with dimmer controls. If both `Power` and `Level` messages are received by
    Crestron in rapid succession, the Brightness/Level setting may be lost due to
    a potential analog ramp triggered on the dimmer.
      (Note: When powering off the dimmer, only the Power is set and no Brightness
    is set)
      To work around this behavior, we first check if the `Set Power` command is
    from a dimmer and if the command is to `Power On` the device. If the device
    is already powered on, we stop any further processing and notify Homebridge.
    We check on the device's `On` state by reading the value from the `On`
    characteristic in the `lighBulbService`.
      If the device is off, we pause processing for 50 ms and wait for a `Set Level`
    event to fire for the same device. If no event is fired for `Set Level`, we
    will process the `Set Power` request, otherwise we simply notify Homebridge
    that the `Set Power` was successful and we delegate the command to the
    Brightness characteristic. The above logic also applies to Fans and rotation
    speed.
   */

  if ((this.type === "LightDimmer" || this.type === "Fan") && powered) {
    let isLevelAlsoSet = false;

    if (this.type === "LightDimmer" && this.lightBulbService.characteristics[0].value || this.type === "Fan" && this.fanService.characteristics[0].value) {
      callback();
      return;
    }

    setTimeout(() => {
      if (!isLevelAlsoSet) {
        this.platform.socket.write(jsonMessage);
        platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-Power`, jsonMessage);
        api.once(`Response-${this.type}-${this.id}-Set-Power`, () => {
          platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-Power`);
          callback();
        });
      } else {
        callback();
      }
    }, 50);
    api.once(`Request-${this.type}-${this.id}-Set-Level`, () => {
      isLevelAlsoSet = true;
    });
  } else {
    this.platform.socket.write(jsonMessage);
    platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-Power`, jsonMessage);
    api.once(`Response-${this.type}-${this.id}-Set-Power`, () => {
      platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-Power`);
      callback();
    });
  }
}
function getLightLevel(callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "Level"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-Level`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Get-Level`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-Level`);
    const percentLevel = value * 100 / 65535;
    callback(null, percentLevel);
  });
}
function setLightLevel(percentLevel, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Set",
    Property: "Level",
    Value: percentLevel / 100 * 65535
  })}||`;
  this.platform.socket.write(jsonMessage);
  api.emit(`Request-${this.type}-${this.id}-Set-Level`);
  platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-Level`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Set-Level`, () => {
    platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-Level`);
    callback();
  });
}
/**
 * getPercentageValue  
 * PercentageValue:0-100
 * include this Characteristic
 * ---- BatteryLevel,Brightness,CarbonMonoxideLevel,CarbonMonoxidePeakLevel
 * ---- CurrentPosition,CurrentRelativeHumidity ,CurrentTemperature,FilterLifeLevel
 * ---- RelativeHumidityDehumidifierThreshold 
 * ---- RelativeHumidityHumidifierThreshold 
 * ---- RotationSpeed
 * ---- Saturation TargetPosition TargetRelativeHumidity Volume WaterLevel 
 * @param callback 
 */

function getPercentageValue(callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "PerValue"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-PerValue`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Get-PerValue`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-PerValue`);
    const pervalue = value;
    callback(null, pervalue);
  });
}
/**
 * setPercentageValue
 * PercentageValue:0-100
 * include this Characteristic
 * ---- Brightness
 * ---- RelativeHumidityDehumidifierThreshold 
 * ---- RelativeHumidityHumidifierThreshold 
 * ---- RotationSpeed
 * ---- Saturation TargetPosition TargetRelativeHumidity Volume  
 * @param pervalue 
 * @param callback 
 */

function setPercentageValue(pervalue, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Set",
    Property: "PerValue",
    Value: pervalue
  })}||`;
  this.platform.socket.write(jsonMessage);
  api.emit(`Request-${this.type}-${this.id}-Set-PerValue`);
  platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-PerValue`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Set-PerValue`, () => {
    platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-PerValue`);
    callback();
  });
}
/**
 * WindowCovering,Window,Door
 * @param position 
 * @param callback 
 */

function setTargetPosition(position, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Set",
    Property: "TargetPosition",
    Value: position
  })}||`;
  this.platform.socket.write(jsonMessage);
  api.emit(`Request-${this.type}-${this.id}-Set-TargetPosition`);
  platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-TargetPosition`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Set-TargetPosition`, () => {
    platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-TargetPosition`);
    callback();
  });
}
function getPosition(property, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: property
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-${property}`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Get-${property}`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-${property}`);
    const pervalue = value;
    callback(null, pervalue);
  });
}
/**
 * getSensorState
 * DETECTED 1
 * NOT_DETECTED 0 
 * @param callback 
 */

function getSensorState(callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "State"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-State`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Get-State`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-State`);
    const state = value;
    callback(null, state);
  });
}
/**
 * Because the type and id,the function directly to avoid code redundancy.
 * This function contains a lot of HAP Characteristic, you can refer to this document(https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L1580)
 * @param callback 
 */

function getValue$1(property, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: property
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-${property}`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Get-${property}`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-${property}`);
    const r_value = value;
    callback(null, r_value);
  });
}
/**
 * 
 * @param value 
 * @param callback 
 */

function setValue(property, value, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Set",
    Property: property,
    Value: value
  })}||`;
  this.platform.socket.write(jsonMessage);
  api.emit(`Request-${this.type}-${this.id}-Set-${property}`);
  platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-${property}`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Set-${property}`, () => {
    platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-${property}`);
    callback();
  });
}
function setInput(inputList, desiredInput, callback) {
  let input = inputList[desiredInput - 1];

  if (input.type === "APPLICATION") {
    // this.platform.soc.sendRequest("command", "X_LaunchApp", "<X_AppType>vc_app</X_AppType><X_LaunchKeyword>product_id=" + input.appID + "</X_LaunchKeyword>");
    this.log("Opening " + input.name + " app");
  } else if (input.type === "TV") {
    // this.tv.sendCommand("AD_CHANGE");
    this.log("Switching to TV");
  } else {
    // this.tv.sendCommand(input.id.toLowerCase().replace(" ", ""));
    this.log("Switching to " + input.name);
  }

  callback(null, input);
}

class Fan extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "fanService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const fanService = new Service.Fan();
    const powerState = fanService.getCharacteristic(Characteristic.On).on('get', getPowerState.bind(this)).on('set', setPowerState.bind(this));
    const fanSpeed = fanService.getCharacteristic(Characteristic.RotationSpeed).on('get', getPercentageValue.bind(this)).on('set', setPercentageValue.bind(this));
    this.fanService = fanService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      powerState.updateValue(Boolean(value));
    });
    api.on(`Event-${this.type}-${this.id}-Set-Speed`, value => {
      fanSpeed.updateValue(value);
    });
    return [this.infoService, fanService];
  }

}

class Switch extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "switchService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const switchService = new Service.Switch();
    const powerState = switchService.getCharacteristic(Characteristic.On).on("get", getPowerState.bind(this)).on("set", setPowerState.bind(this));
    this.switchService = switchService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      powerState.updateValue(Boolean(value));
    });
    return [this.infoService, switchService];
  }

}

class LightDimmer extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "lightBulbService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const lightBulbService = new Service.Lightbulb();
    const powerState = lightBulbService.getCharacteristic(Characteristic.On).on('get', getPowerState.bind(this)).on('set', setPowerState.bind(this));
    const lightLevel = lightBulbService.getCharacteristic(Characteristic.Brightness).on('get', getLightLevel.bind(this)).on('set', setLightLevel.bind(this));
    this.lightBulbService = lightBulbService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      powerState.updateValue(Boolean(value));
    });
    api.on(`Event-${this.type}-${this.id}-Set-Level`, value => {
      lightLevel.updateValue(value * 100 / 65535);
    });
    return [this.infoService, lightBulbService];
  }

}

class LightSwitch extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "lightBulbService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const lightBulbService = new Service.Lightbulb();
    const powerState = lightBulbService.getCharacteristic(Characteristic.On).on('get', getPowerState.bind(this)).on('set', setPowerState.bind(this));
    this.lightBulbService = lightBulbService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      powerState.updateValue(Boolean(value));
    });
    return [this.infoService, lightBulbService];
  }

}

class WindowCovering extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "windowCoveringService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const WindowCoveringService = new Service.WindowCovering();
    const currPosition = WindowCoveringService.getCharacteristic(Characteristic.CurrentPosition).on("get", getPosition.bind(this, "CurrentPosition"));
    const targetPosition = WindowCoveringService.getCharacteristic(Characteristic.TargetPosition).on("get", getPosition.bind(this, "TargetPosition")).on("set", setTargetPosition.bind(this));
    const positionState = WindowCoveringService.getCharacteristic(Characteristic.PositionState);
    this.windowCoveringService = WindowCoveringService;
    api.on(`Event-${this.type}-${this.id}-Set-CurrentPosition`, async value => {
      targetPosition.updateValue(value);
      await timeout(5000);
      positionState.updateValue(Characteristic.PositionState.STOPPED);
      currPosition.updateValue(value);
    });
    return [this.infoService, WindowCoveringService];
  }

}

class HeaterCooler extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "heaterCoolerService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const HeaterCoolerService = new Service.HeaterCooler();
    const Power = HeaterCoolerService.getCharacteristic(Characteristic.Active).on("get", getPowerState.bind(this)).on("set", setPowerState.bind(this));
    const TargetHeaterCoolerState = HeaterCoolerService.getCharacteristic(Characteristic.TargetHeaterCoolerState).on("get", getValue$1.bind(this, "TargetState")).on("set", setValue.bind(this, "TargetState"));
    const CurrentHeaterCoolerState = HeaterCoolerService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).on("get", getValue$1.bind(this, "CurrentState"));
    const CurrentTemperature = HeaterCoolerService.getCharacteristic(Characteristic.CurrentTemperature).on('get', getValue$1.bind(this, "CurrentTemperature"));
    const TemperatureDisplayUnits = HeaterCoolerService.getCharacteristic(Characteristic.TemperatureDisplayUnits);
    const CoolingThresholdTemperature = HeaterCoolerService.getCharacteristic(Characteristic.CoolingThresholdTemperature).setProps({
      maxValue: 32,
      minValue: 16,
      minStep: 1
    }).on('get', getValue$1.bind(this, "TargetTemperature")).on('set', setValue.bind(this, "TargetTemperature"));
    const HeatingThresholdTemperature = HeaterCoolerService.getCharacteristic(Characteristic.HeatingThresholdTemperature).setProps({
      maxValue: 32,
      minValue: 16,
      minStep: 1
    }).on('get', getValue$1.bind(this, "TargetTemperature")).on('set', setValue.bind(this, "TargetTemperature"));
    TemperatureDisplayUnits.setValue(0);
    this.heaterCoolerService = HeaterCoolerService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      Power.updateValue(value);
    });
    api.on(`Event-${this.type}-${this.id}-Set-CurrentTemperature`, value => {
      CurrentTemperature.updateValue(value);
    });
    api.on(`Event-${this.type}-${this.id}-Set-TargetTemperature`, async value => {
      await HeatingThresholdTemperature.updateValue(value);
      CoolingThresholdTemperature.updateValue(value);
    });
    api.on(`Event-${this.type}-${this.id}-Set-TargetState`, async value => {
      await TargetHeaterCoolerState.updateValue(value);
      var currStateValue;

      if (value === 0) {
        currStateValue = 1;
      } else if (value === 1) {
        currStateValue = 2;
      } else if (value === 2) {
        currStateValue = 3;
      }

      CurrentHeaterCoolerState.updateValue(currStateValue);
    });
    return [this.infoService, HeaterCoolerService];
  }

}

class OccupancySensor extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "occupancySensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const OccupancySensorService = new Service.OccupancySensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = OccupancySensorService.getCharacteristic(Characteristic.OccupancyDetected).on("get", getSensorState.bind(this));
    this.occupancySensor = OccupancySensorService;
    api.on(`Event-${this.type}-${this.id}-Set-State`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, OccupancySensorService];
  }

}

class MotionSensor extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "motionSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const motionSensorService = new Service.MotionSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = motionSensorService.getCharacteristic(Characteristic.MotionDetected).on('get', getSensorState.bind(this));
    this.motionSensor = motionSensorService;
    api.on(`Event-${this.type}-${this.id}-Set-State`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, motionSensorService];
  }

}

class LeakSensor extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "leakSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const leakSensorService = new Service.LeakSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = leakSensorService.getCharacteristic(Characteristic.LeakDetected).on('get', getSensorState.bind(this));
    this.leakSensor = leakSensorService;
    api.on(`Event-${this.type}-${this.id}-Set-State`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, leakSensorService];
  }

}

class ContactSensor extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "contactSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const contactService = new Service.ContactSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = contactService.getCharacteristic(Characteristic.ContactSensorState).on('get', getSensorState.bind(this));
    this.contactSensor = contactService;
    api.on(`Event-${this.type}-${this.id}-Set-State`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, contactService];
  }

}

class CarbonMonoxideSensor extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "carbonMonoxideSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const CarbonMonoxideService = new Service.CarbonMonoxideSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = CarbonMonoxideService.getCharacteristic(Characteristic.CarbonMonoxideDetected).on('get', getSensorState.bind(this));
    this.carbonMonoxideSensor = CarbonMonoxideService;
    api.on(`Event-${this.type}-${this.id}-Set-State`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, CarbonMonoxideService];
  }

}

class CarbonDioxideSensor extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "carbonDioxideSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const CarbonDioxideService = new Service.CarbonDioxideSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = CarbonDioxideService.getCharacteristic(Characteristic.CarbonDioxideDetected).on('get', getSensorState.bind(this));
    this.carbonDioxideSensor = CarbonDioxideService;
    api.on(`Event-${this.type}-${this.id}-Set-State`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, CarbonDioxideService];
  }

}

class SmokeSensor extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "smokeSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const smokeSensorService = new Service.SmokeSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = smokeSensorService.getCharacteristic(Characteristic.SmokeDetected).on('get', getSensorState.bind(this));
    this.smokeSensor = smokeSensorService;
    api.on(`Event-${this.type}-${this.id}-Set-State`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, smokeSensorService];
  }

}

class Television extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "televisionService", void 0);

    _defineProperty(this, "speakerService", void 0);

    _defineProperty(this, "inputs", void 0);

    this.inputs = accessoryConfig["inputs"];
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const TelevisionService = new Service.Television();
    const powerState = TelevisionService.getCharacteristic(Characteristic.Active).on('get', getPowerState.bind(this)).on('set', setPowerState.bind(this));
    TelevisionService.setCharacteristic(Characteristic.ConfiguredName, this.name);
    TelevisionService.setCharacteristic(Characteristic.SleepDiscoveryMode, Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);
    const remoteKey = TelevisionService.getCharacteristic(Characteristic.RemoteKey).on("set", setValue.bind(this, "RemoteKey"));
    this.televisionService = TelevisionService; // Configure HomeKit TV Volume Control

    const SpeakerService = new Service.TelevisionSpeaker(this.name + " Volume", "volumeService");
    SpeakerService.setCharacteristic(Characteristic.Active, Characteristic.Active.ACTIVE).setCharacteristic(Characteristic.VolumeControlType, Characteristic.VolumeControlType.ABSOLUTE);
    const volume = SpeakerService.getCharacteristic(Characteristic.Volume).on("get", getValue$1.bind(this, "Volume")).on("set", setValue.bind(this, "Volume"));
    const mute = SpeakerService.getCharacteristic(Characteristic.Mute).on("get", getValue$1.bind(this, "Mute")).on("set", setValue.bind(this, "Mute"));
    this.speakerService = SpeakerService;
    this.televisionService.addLinkedService(this.speakerService);
    const activeIdentifier = TelevisionService.getCharacteristic(Characteristic.ActiveIdentifier).on("set", setInput.bind(this, this.inputs));
    var configuredInputs = this.setupInputs();
    configuredInputs.forEach(input => {
      this.televisionService.addLinkedService(input);
    });
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      powerState.updateValue(Boolean(value));
    });
    api.on(`Event-${this.type}-${this.id}-Set-Volume`, value => {
      volume.updateValue(value);
    });
    api.on(`Event-${this.type}-${this.id}-Set-Mute`, value => {
      mute.updateValue(value);
    });
    return [this.infoService, TelevisionService];
  }

  setupInputs() {
    var configuredInputs = [];
    var counter = 1;
    this.inputs.forEach(input => {
      let id = input.id;
      let name = input.name;
      let type = this.determineInputType(input.type);
      this.log("Adding input " + counter + ": Name: " + name + ", Type: " + input.type);
      configuredInputs.push(this.createInputSource(id, name, counter, type));
      counter = counter + 1;
    });
    return configuredInputs;
  }

  createInputSource(id, name, counter, type) {
    var input = new this.platform.api.hap.Service.InputSource(id.toLowerCase().replace(" ", ""), name);
    input.setCharacteristic(this.platform.api.hap.Characteristic.Identifier, counter).setCharacteristic(this.platform.api.hap.Characteristic.ConfiguredName, name).setCharacteristic(this.platform.api.hap.Characteristic.InputSourceType, type).setCharacteristic(this.platform.api.hap.Characteristic.IsConfigured, this.platform.api.hap.Characteristic.IsConfigured.CONFIGURED);
    return input;
  }

  determineInputType(type) {
    switch (type) {
      case "TV":
        return this.platform.api.hap.Characteristic.InputSourceType.TUNER;

      case "HDMI":
        return this.platform.api.hap.Characteristic.InputSourceType.HDMI;

      case "APPLICATION":
        return this.platform.api.hap.Characteristic.InputSourceType.APPLICATION;

      default:
        return this.platform.api.hap.Characteristic.InputSourceType.OTHER;
    }
  }

}

class AirPurifier extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "airPurifierService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const AirPurifierService = new Service.AirPurifier();
    const Power = AirPurifierService.getCharacteristic(Characteristic.Active).on("get", getPowerState.bind(this)).on("set", setPowerState.bind(this));
    const TargetAirPurifierState = AirPurifierService.getCharacteristic(Characteristic.TargetAirPurifierState).on("get", getValue$1.bind(this, "TargetAirPurifierState")).on("set", setValue.bind(this, "TargetAirPurifierState"));
    const CurrentAirPurifierState = AirPurifierService.getCharacteristic(Characteristic.CurrentAirPurifierState);
    const RotationSpeed = AirPurifierService.getCharacteristic(Characteristic.RotationSpeed).on("get", getValue$1.bind(this, "RotationSpeed")).on("set", setValue.bind(this, "RotationSpeed"));
    this.airPurifierService = AirPurifierService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      Power.updateValue(value);
    });
    api.on(`Event-${this.type}-${this.id}-Set-TargetAirPurifierState`, value => {
      TargetAirPurifierState.updateValue(value);
    });
    api.on(`Event-${this.type}-${this.id}-Set-CurrentAirPurifierState`, value => {
      CurrentAirPurifierState.updateValue(value);
    });
    api.on(`Event-${this.type}-${this.id}-Set-RotationSpeed`, value => {
      RotationSpeed.updateValue(value);
    });
    return [this.infoService, AirPurifierService];
  }

}

const version = "2.0.0";
function index (homebridge) {
  homebridge.registerPlatform('homebridge-crestron', 'CrestronS', Platform);
}

class Platform {
  constructor(log, config, api) {
    _defineProperty(this, "log", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "api", void 0);

    _defineProperty(this, "socket", void 0);

    this.log = log;
    this.config = config;
    this.api = api; // store the api in the Platform instance

    const {
      host,
      port
    } = this.config;
    this.socket = new net.Socket();
    this.socket.pendingGetRequests = new Map(); // stores outgoing get messages

    this.socket.pendingSetRequests = new Map(); // stores outgoing set messages

    this.socket.on('error', console.error); // logs socket error messages
    //handle socket close

    this.socket.on('close', () => {
      this.log('Connection Lost. Attempting to reconnect in 10 seconds...');
      this.socket.setTimeout(10000, () => {
        this.socket.connect(port, host, () => {
          this.log('Connection re-established with the Crestron Processor');
        });
      });
    }); // connect to the Crestron processor

    this.socket.connect(port, host, () => {
      this.log(`Connected to the Crestron Processor @ ${host}`);
    }); // Retry pending `Get` and `Set` Requests every 2 seconds

    setInterval(() => {
      if (!this.socket.pending) {
        if (this.socket.pendingGetRequests.size > 0) {
          this.socket.pendingGetRequests.forEach((value, key) => {
            this.log(`Retrying get request: ${key}`);
            this.socket.write(value);
          });
        }

        if (this.socket.pendingSetRequests.size > 0) {
          this.socket.pendingSetRequests.forEach((value, key) => {
            this.log(`Retrying set request: ${key}`);
            this.socket.write(value);
          });
        }
      }
    }, 2000);
    /*
      Handle messages received from Crestron
      Since messages are received in a TCP socket stream, we use a double-pipe (||)
      to delimit them. We split the stream and retain messages where length > 0
     */

    this.socket.on('data', data => {
      const jsonMessages = data.toString().split('||').filter(jsonMessage => jsonMessage.length > 0);
      jsonMessages.forEach(async jsonMessage => {
        // jsonMessage = jsonMessage.replace("\u0000","");
        try {
          var message = JSON.parse(jsonMessage);
        } catch (error) {
          throw error;
        }

        const {
          MessageType: messageType,
          DeviceType: deviceType,
          DeviceId: deviceId,
          Operation: operation,
          Property: property,
          Value: value
        } = message;
        /*
          When Homebridge sends a message with a `Set` operation, the Crestron
          module will pulse DIGITAL_OUTPUT or a ANALOG_OUTPUT signals. These 
          signals will trigger commands on the connected devices and feedback 
          from those devices will be generate `Event` messages back to Homebridge.
          
          Upon receiving an `Event` message, we check if a `Set` request is pending
          for that device. If the pending request exists, we emit a `Response` event
          so that Homebridge receives the acknowledgement from Crestron that the 
          message was processes.
          
          If an `Event` message is received and there are no pending `Set` requests,
          this means that an event occurred on the Crestron side from an action
          not triggered by Homebridge (e.g. Keypad press). In this case, we emit a
          `Event` event and handle it accordingly. 
         */

        if (messageType === 'Event' && this.socket.pendingSetRequests.has(`${deviceType}-${deviceId}-${property}`)) {
          this.api.emit(`Response-${deviceType}-${deviceId}-${operation}-${property}`);
          return;
        }

        this.api.emit(`${messageType}-${deviceType}-${deviceId}-${operation}-${property}`, value);
      });
    }); // handle program termination

    process.on('exit', () => {
      this.socket.end();
      this.log('Disconnected from the Crestron Processor');
    }); // handle Homebridge launch

    this.api.on('didFinishLaunching', function () {
      this.log('DidFinishLaunching'); // some information

      this.log.info("                                                              ");
      this.log.info("**************************************************************");
      this.log.info("           CrestronPlatform v-" + version + " By songzh96");
      this.log.info("  GitHub: https://github.com/songzh96/homebridge-crestron-ts  ");
      this.log.info("                                         QQ Group: 107927710  ");
      this.log.info("**************************************************************");
      this.log.info("                                                              ");
    }.bind(this));
  }

  accessories(callback) {
    const accessories = [];
    const {
      devices
    } = this.config;

    const devicesByType = groupBy_1(devices, 'type');
    /*
      Here we register the devices with Homebridge. We group the devices listed
      in the config file by type and we call the appropriate accessory constructor.
     */


    each(devicesByType, (devices, type) => {
      devices.forEach(device => {
        switch (type) {
          case 'LightSwitch':
            accessories.push(new LightSwitch(this.log, device, this));
            return;

          case 'LightDimmer':
            accessories.push(new LightDimmer(this.log, device, this));
            return;

          case 'Switch':
            accessories.push(new Switch(this.log, device, this));
            return;

          case 'Fan':
            accessories.push(new Fan(this.log, device, this));
            return;

          case 'WindowCovering':
            accessories.push(new WindowCovering(this.log, device, this));
            return;

          case 'HeaterCooler':
            accessories.push(new HeaterCooler(this.log, device, this));
            return;

          case 'AirPurifier':
            accessories.push(new AirPurifier(this.log, device, this));
            return;

          case 'Television':
            accessories.push(new Television(this.log, device, this));
            return;

          case 'OccupancySensor':
            accessories.push(new OccupancySensor(this.log, device, this));
            return;

          case 'SmokeSensor':
            accessories.push(new SmokeSensor(this.log, device, this));
            return;

          case 'LeakSensor':
            accessories.push(new LeakSensor(this.log, device, this));
            return;

          case 'MotionSensor':
            accessories.push(new MotionSensor(this.log, device, this));
            return;

          case 'ContactSensor':
            accessories.push(new ContactSensor(this.log, device, this));
            return;

          case 'CarbonMonoxideSensor':
            accessories.push(new CarbonMonoxideSensor(this.log, device, this));
            return;

          case 'CarbonDioxideSensor':
            accessories.push(new CarbonDioxideSensor(this.log, device, this));
            return;
        }
      });
    });

    callback(accessories);
  }

}

module.exports = index;
