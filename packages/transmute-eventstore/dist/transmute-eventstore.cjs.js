'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ipfsApi = _interopDefault(require('ipfs-api'));
var bs58 = _interopDefault(require('bs58'));
var web3 = _interopDefault(require('web3'));
var truffleContract = _interopDefault(require('truffle-contract'));
var keenTracking = _interopDefault(require('keen-tracking'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) {
  if (!REACT_ELEMENT_TYPE) {
    REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
  }

  var defaultProps = type && type.defaultProps;
  var childrenLength = arguments.length - 3;

  if (!props && childrenLength !== 0) {
    props = {
      children: void 0
    };
  }

  if (props && defaultProps) {
    for (var propName in defaultProps) {
      if (props[propName] === void 0) {
        props[propName] = defaultProps[propName];
      }
    }
  } else if (!props) {
    props = defaultProps || {};
  }

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = new Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 3];
    }

    props.children = childArray;
  }

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key === undefined ? null : '' + key,
    ref: null,
    props: props,
    _owner: null
  };
}

function _asyncIterator(iterable) {
  if (typeof Symbol === "function") {
    if (Symbol.asyncIterator) {
      var method = iterable[Symbol.asyncIterator];
      if (method != null) return method.call(iterable);
    }

    if (Symbol.iterator) {
      return iterable[Symbol.iterator]();
    }
  }

  throw new TypeError("Object is not async iterable");
}

function _AwaitValue(value) {
  this.wrapped = value;
}

function _AsyncGenerator(gen) {
  var front, back;

  function send(key, arg) {
    return new Promise(function (resolve, reject) {
      var request = {
        key: key,
        arg: arg,
        resolve: resolve,
        reject: reject,
        next: null
      };

      if (back) {
        back = back.next = request;
      } else {
        front = back = request;
        resume(key, arg);
      }
    });
  }

  function resume(key, arg) {
    try {
      var result = gen[key](arg);
      var value = result.value;
      var wrappedAwait = value instanceof _AwaitValue;
      Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
        if (wrappedAwait) {
          resume("next", arg);
          return;
        }

        settle(result.done ? "return" : "normal", arg);
      }, function (err) {
        resume("throw", err);
      });
    } catch (err) {
      settle("throw", err);
    }
  }

  function settle(type, value) {
    switch (type) {
      case "return":
        front.resolve({
          value: value,
          done: true
        });
        break;

      case "throw":
        front.reject(value);
        break;

      default:
        front.resolve({
          value: value,
          done: false
        });
        break;
    }

    front = front.next;

    if (front) {
      resume(front.key, front.arg);
    } else {
      back = null;
    }
  }

  this._invoke = send;

  if (typeof gen.return !== "function") {
    this.return = undefined;
  }
}

if (typeof Symbol === "function" && Symbol.asyncIterator) {
  _AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
    return this;
  };
}

_AsyncGenerator.prototype.next = function (arg) {
  return this._invoke("next", arg);
};

_AsyncGenerator.prototype.throw = function (arg) {
  return this._invoke("throw", arg);
};

_AsyncGenerator.prototype.return = function (arg) {
  return this._invoke("return", arg);
};

function _wrapAsyncGenerator(fn) {
  return function () {
    return new _AsyncGenerator(fn.apply(this, arguments));
  };
}

function _awaitAsyncGenerator(value) {
  return new _AwaitValue(value);
}

function _asyncGeneratorDelegate(inner, awaitWrap) {
  var iter = {},
      waiting = false;

  function pump(key, value) {
    waiting = true;
    value = new Promise(function (resolve) {
      resolve(inner[key](value));
    });
    return {
      done: false,
      value: awaitWrap(value)
    };
  }

  if (typeof Symbol === "function" && Symbol.iterator) {
    iter[Symbol.iterator] = function () {
      return this;
    };
  }

  iter.next = function (value) {
    if (waiting) {
      waiting = false;
      return value;
    }

    return pump("next", value);
  };

  if (typeof inner.throw === "function") {
    iter.throw = function (value) {
      if (waiting) {
        waiting = false;
        throw value;
      }

      return pump("throw", value);
    };
  }

  if (typeof inner.return === "function") {
    iter.return = function (value) {
      return pump("return", value);
    };
  }

  return iter;
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }

      function _next(value) {
        step("next", value);
      }

      function _throw(err) {
        step("throw", err);
      }

      _next();
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineEnumerableProperties(obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }

  if (Object.getOwnPropertySymbols) {
    var objectSymbols = Object.getOwnPropertySymbols(descs);

    for (var i = 0; i < objectSymbols.length; i++) {
      var sym = objectSymbols[i];
      var desc = descs[sym];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      Object.defineProperty(obj, sym, desc);
    }
  }

  return obj;
}

function _defaults(obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);

    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }

  return obj;
}

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

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return _get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _gPO(o) {
  _gPO = Object.getPrototypeOf || function _gPO(o) {
    return o.__proto__;
  };

  return _gPO(o);
}

function _sPO(o, p) {
  _sPO = Object.setPrototypeOf || function _sPO(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _sPO(o, p);
}

function _construct(Parent, args, Class) {
  _construct = typeof Reflect === "object" && Reflect.construct || function _construct(Parent, args, Class) {
    var Constructor,
        a = [null];
    a.push.apply(a, args);
    Constructor = Parent.bind.apply(Parent, a);
    return _sPO(new Constructor(), Class.prototype);
  };

  return _construct(Parent, args, Class);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {}

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _sPO(Wrapper, _sPO(function Super() {
      return _construct(Class, arguments, _gPO(this).constructor);
    }, Class));
  };

  return _wrapNativeSuper(Class);
}

function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }

    newObj.default = obj;
    return newObj;
  }
}

function _newArrowCheck(innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
}

function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      _set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

function _temporalRef(val, name) {
  if (val === _temporalUndefined) {
    throw new ReferenceError(name + " is not defined - temporal dead zone");
  } else {
    return val;
  }
}

function _readOnlyError(name) {
  throw new Error("\"" + name + "\" is read-only");
}

function _classNameTDZError(name) {
  throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys.");
}

var _temporalUndefined = {};

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _slicedToArrayLoose(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimitLoose(arr, i) || _nonIterableRest();
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _iterableToArrayLimitLoose(arr, i) {
  var _arr = [];

  for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
    _arr.push(_step.value);

    if (i && _arr.length === i) break;
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _skipFirstGeneratorNext(fn) {
  return function () {
    var it = fn.apply(this, arguments);
    it.next();
    return it;
  };
}

function _toPropertyKey(key) {
  if (typeof key === "symbol") {
    return key;
  } else {
    return String(key);
  }
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.');
}

function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _rollupPluginBabelHelpers = /*#__PURE__*/Object.freeze({
  get typeof () { return _typeof; },
  jsx: _jsx,
  asyncIterator: _asyncIterator,
  AwaitValue: _AwaitValue,
  AsyncGenerator: _AsyncGenerator,
  wrapAsyncGenerator: _wrapAsyncGenerator,
  awaitAsyncGenerator: _awaitAsyncGenerator,
  asyncGeneratorDelegate: _asyncGeneratorDelegate,
  asyncToGenerator: _asyncToGenerator,
  classCallCheck: _classCallCheck,
  createClass: _createClass,
  defineEnumerableProperties: _defineEnumerableProperties,
  defaults: _defaults,
  defineProperty: _defineProperty,
  get extends () { return _extends; },
  objectSpread: _objectSpread,
  get: _get,
  inherits: _inherits,
  inheritsLoose: _inheritsLoose,
  get wrapNativeSuper () { return _wrapNativeSuper; },
  instanceof: _instanceof,
  interopRequireDefault: _interopRequireDefault,
  interopRequireWildcard: _interopRequireWildcard,
  newArrowCheck: _newArrowCheck,
  objectDestructuringEmpty: _objectDestructuringEmpty,
  objectWithoutProperties: _objectWithoutProperties,
  assertThisInitialized: _assertThisInitialized,
  possibleConstructorReturn: _possibleConstructorReturn,
  set: _set,
  taggedTemplateLiteral: _taggedTemplateLiteral,
  taggedTemplateLiteralLoose: _taggedTemplateLiteralLoose,
  temporalRef: _temporalRef,
  readOnlyError: _readOnlyError,
  classNameTDZError: _classNameTDZError,
  temporalUndefined: _temporalUndefined,
  slicedToArray: _slicedToArray,
  slicedToArrayLoose: _slicedToArrayLoose,
  toArray: _toArray,
  toConsumableArray: _toConsumableArray,
  arrayWithoutHoles: _arrayWithoutHoles,
  arrayWithHoles: _arrayWithHoles,
  iterableToArray: _iterableToArray,
  iterableToArrayLimit: _iterableToArrayLimit,
  iterableToArrayLimitLoose: _iterableToArrayLimitLoose,
  nonIterableSpread: _nonIterableSpread,
  nonIterableRest: _nonIterableRest,
  skipFirstGeneratorNext: _skipFirstGeneratorNext,
  toPropertyKey: _toPropertyKey,
  initializerWarningHelper: _initializerWarningHelper,
  initializerDefineProperty: _initializerDefineProperty,
  applyDecoratedDescriptor: _applyDecoratedDescriptor
});

var require$$0 = ( _rollupPluginBabelHelpers && undefined ) || _rollupPluginBabelHelpers;

var _classCallCheck$1 = require$$0.classCallCheck;

var _createClass$1 = require$$0.createClass;





var ipfs =
/*#__PURE__*/
function () {
  function TransmuteIpfsAdapter(config) {
    _classCallCheck$1(this, TransmuteIpfsAdapter);

    this.ipfs = ipfsApi(config);
  }

  _createClass$1(TransmuteIpfsAdapter, [{
    key: "healthy",
    value: function healthy() {
      return this.ipfs.id();
    }
  }, {
    key: "writeObject",
    value: function writeObject(obj) {
      return new Promise(function ($return, $error) {
        return $return(this.ipfs.object.put({
          Data: new Buffer(JSON.stringify(obj)),
          Links: []
        }));
      }.bind(this));
    }
  }, {
    key: "readObject",
    value: function readObject(multihash) {
      return new Promise(function ($return, $error) {
        var data;
        return Promise.resolve(this.ipfs.object.get(multihash)).then(function ($await_1) {
          try {
            data = $await_1.data.toString();
            return $return(JSON.parse(data));
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    }
  }, {
    key: "bytes32ToMultihash",
    value: function bytes32ToMultihash(hash) {
      return bs58.encode(new Buffer('1220' + hash.slice(2), 'hex'));
    }
  }, {
    key: "multihashToBytes32",
    value: function multihashToBytes32(ipfshash) {
      return '0x' + new Buffer(bs58.decode(ipfshash).slice(2)).toString('hex');
    }
  }]);

  return TransmuteIpfsAdapter;
}();

var name = "transmute-eventstore";
var version = "0.0.1";
var description = "EventStore Middleware";
var main = "dist/transmute-eventstore.min.js";
var files = ["dist", "src"];
var scripts = {
  "start": "npm test",
  "build": "./node_modules/bili/dist/cli.js --format cjs ./src/index.js",
  "test": "NODE_TLS_REJECT_UNAUTHORIZED=0 react-scripts test --coverage --forceExit",
  "test:report": "codecov && rm -rf ./coverage",
  "test:smoke": "node ./smoke_tests/module.test.js",
  "truffle:test": "NODE_TLS_REJECT_UNAUTHORIZED=0 truffle test",
  "truffle:migrate": "NODE_TLS_REJECT_UNAUTHORIZED=0 truffle migrate",
  "truffle:coverage": "./node_modules/.bin/solidity-coverage",
  "truffle:coverage:report": "cat coverage/lcov.info | coveralls",
  "eject": "react-scripts eject"
};
var repository = {
  "type": "git",
  "url": "git+ssh://git@github.com/transmute-industries/transmute.git"
};
var keywords = ["transmute"];
var authors = ["Orie Steele <orie@transmute.industries>"];
var license = "MIT";
var bugs = {
  "url": "https://github.com/transmute-industries/transmute/issues"
};
var homepage = "https://github.com/transmute-industries/transmute#readme";
var devDependencies = {
  "bili": "^3.0.4",
  "codecov": "^3.0.0",
  "coveralls": "^3.0.0",
  "react-scripts": "^1.1.1",
  "solidity-coverage": "^0.4.14"
};
var dependencies = {
  "bs58": "^4.0.1",
  "ipfs-api": "^18.2.0",
  "keen-tracking": "^1.1.3",
  "truffle-contract": "^3.0.4",
  "web3": "^0.19.1",
  "web3-provider-engine": "^13.6.6",
  "zeppelin-solidity": "^1.6.0"
};
var _package = {
  name: name,
  version: version,
  description: description,
  main: main,
  files: files,
  scripts: scripts,
  repository: repository,
  keywords: keywords,
  authors: authors,
  license: license,
  bugs: bugs,
  homepage: homepage,
  devDependencies: devDependencies,
  dependencies: dependencies
};

var _package$1 = /*#__PURE__*/Object.freeze({
  name: name,
  version: version,
  description: description,
  main: main,
  files: files,
  scripts: scripts,
  repository: repository,
  keywords: keywords,
  authors: authors,
  license: license,
  bugs: bugs,
  homepage: homepage,
  devDependencies: devDependencies,
  dependencies: dependencies,
  default: _package
});

var MAX_GAS = 500000;
var EVENT_GAS_COST = 500000;
var gas = {
  MAX_GAS: MAX_GAS,
  EVENT_GAS_COST: EVENT_GAS_COST
};

var pack = ( _package$1 && _package ) || _package$1;

var _classCallCheck$2 = require$$0.classCallCheck;

var _createClass$2 = require$$0.createClass;

 // const ProviderEngine = require('web3-provider-engine');
// const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js');












var eventStore =
/*#__PURE__*/
function () {
  function EventStore(config) {
    _classCallCheck$2(this, EventStore);

    if (!config) {
      throw new Error('a config of form { eventStoreArtifact, web3, keen, ipfs } is required.');
    }

    var eventStoreArtifact = config.eventStoreArtifact,
        web3Config = config.web3Config,
        keenConfig = config.keenConfig,
        ipfsConfig = config.ipfsConfig;

    if (!eventStoreArtifact) {
      throw new Error('a truffle-contract eventStoreArtifact property is required in constructor argument.');
    }

    if (!web3Config) {
      throw new Error('a web3 property is required in constructor argument.');
    }

    if (!keenConfig) {
      throw new Error('a keenConfig property is required in constructor argument.');
    }

    if (!ipfsConfig) {
      throw new Error('an ipfsConfig property is required in constructor argument.');
    } // var engine = new ProviderEngine();
    // engine.addProvider(
    //   new RpcSubprovider({
    //     rpcUrl: web3Config.providerUrl
    //   })
    // );
    // engine.start();


    this.version = pack.version;
    this.web3 = new web3(new web3.providers.HttpProvider(web3Config.providerUrl));
    this.eventStoreArtifact = eventStoreArtifact;
    this.eventStoreContract = truffleContract(this.eventStoreArtifact);
    this.eventStoreContract.setProvider(this.web3.currentProvider);
    this.keen = new keenTracking(keenConfig);
    this.ipfs = new ipfs(ipfsConfig);
  }

  _createClass$2(EventStore, [{
    key: "getWeb3Accounts",
    value: function getWeb3Accounts() {
      return new Promise(function ($return, $error) {
        var _this = this;

        return $return(new Promise(function (resolve, reject) {
          _this.web3.eth.getAccounts(function (err, accounts) {
            if (err) {
              reject(err);
            }

            resolve(accounts);
          });
        }));
      }.bind(this));
    }
  }, {
    key: "init",
    value: function init() {
      return new Promise(function ($return, $error) {
        if (!this.eventStoreContractInstance) {
          return Promise.resolve(this.eventStoreContract.deployed()).then(function ($await_5) {
            try {
              this.eventStoreContractInstance = $await_5;
              return $If_2.call(this);
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        }

        function $If_2() {
          return $return();
        }

        return $If_2.call(this);
      }.bind(this));
    }
  }, {
    key: "requireInstance",
    value: function requireInstance() {
      if (!this.eventStoreContractInstance) {
        throw new Error('You must call init() before accessing eventStoreContractInstance.');
      }
    }
  }, {
    key: "clone",
    value: function clone(fromAddress) {
      return new Promise(function ($return, $error) {
        var newContract, instance;
        return Promise.resolve(this.eventStoreContract.new({
          from: fromAddress,
          gas: gas.MAX_GAS
        })).then(function ($await_6) {
          try {
            newContract = $await_6;
            instance = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
            instance.eventStoreContractInstance = newContract;
            return $return(instance);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    }
  }, {
    key: "write",
    value: function write(fromAddress, key, value) {
      return new Promise(function ($return, $error) {
        var web3$$1, ipfs$$1, eventStoreContractInstance, keyDagNode, keyMultihash, keyBytes32ID, valueDagNode, valueMultihash, valueBytes32ID, tx, receipt;
        this.requireInstance();
        web3$$1 = this.web3, ipfs$$1 = this.ipfs, eventStoreContractInstance = this.eventStoreContractInstance;
        return Promise.resolve(ipfs$$1.writeObject(key)).then(function ($await_7) {
          try {
            keyDagNode = $await_7;
            keyMultihash = keyDagNode._json.multihash;
            keyBytes32ID = ipfs$$1.multihashToBytes32(keyMultihash);
            return Promise.resolve(ipfs$$1.writeObject(value)).then(function ($await_8) {
              try {
                valueDagNode = $await_8;
                valueMultihash = valueDagNode._json.multihash;
                valueBytes32ID = ipfs$$1.multihashToBytes32(valueMultihash);
                return Promise.resolve(eventStoreContractInstance.write.sendTransaction(keyBytes32ID, valueBytes32ID, {
                  from: fromAddress,
                  gas: gas.EVENT_GAS_COST
                })).then(function ($await_9) {
                  try {
                    tx = $await_9;
                    receipt = web3$$1.eth.getTransactionReceipt(tx);
                    // console.log(rec);
                    // this.keen.recordEvent('TransmuteEvent', {
                    //   key,
                    //   value,
                    //   rec: rec
                    // });
                    // return rec;
                    return $return({
                      event: {
                        sender: fromAddress,
                        key: key,
                        value: value
                      },
                      meta: {
                        tx: tx,
                        ipfs: {
                          key: keyMultihash,
                          value: valueMultihash
                        },
                        bytes32: {
                          key: keyBytes32ID,
                          value: valueBytes32ID
                        },
                        receipt: receipt
                      }
                    });
                  } catch ($boundEx) {
                    return $error($boundEx);
                  }
                }.bind(this), $error);
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }.bind(this), $error);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    }
  }, {
    key: "read",
    value: function read(index) {
      return new Promise(function ($return, $error) {
        var web3$$1, ipfs$$1, eventStoreContractInstance, values, decoded;
        this.requireInstance();
        web3$$1 = this.web3, ipfs$$1 = this.ipfs, eventStoreContractInstance = this.eventStoreContractInstance;

        var $Try_1_Post = function () {
          try {
            if (!values) {
              return $error(new Error('Failed to read values from index.'));
            }

            decoded = [values[0].toNumber(), values[1], ipfs$$1.bytes32ToMultihash(values[2]), ipfs$$1.bytes32ToMultihash(values[3])];
            return Promise.resolve(ipfs$$1.readObject(decoded[2])).then(function ($await_10) {
              try {
                return Promise.resolve(ipfs$$1.readObject(decoded[3])).then(function ($await_11) {
                  try {
                    return $return({
                      index: decoded[0],
                      sender: decoded[1],
                      key: $await_10,
                      value: $await_11
                    });
                  } catch ($boundEx) {
                    return $error($boundEx);
                  }
                }.bind(this), $error);
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }.bind(this), $error);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this);

        var $Try_1_Catch = function (e) {
          try {
            if (index == 0) {
              throw new Error('EventStore has no events.');
            }

            return $Try_1_Post();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this);

        try {
          return Promise.resolve(eventStoreContractInstance.read(index)).then(function ($await_12) {
            try {
              values = $await_12;
              return $Try_1_Post();
            } catch ($boundEx) {
              return $Try_1_Catch($boundEx);
            }
          }.bind(this), $Try_1_Catch);
        } catch (e) {
          $Try_1_Catch(e);
        }
      }.bind(this));
    }
  }, {
    key: "getSlice",
    value: function getSlice(startIndex, endIndex) {
      return new Promise(function ($return, $error) {
        var index, events;

        if (!(endIndex >= startIndex)) {
          return $error(new Error('startIndex must be less than or equal to endIndex.'));
        }

        index = startIndex;
        events = [];
        var $Loop_3_trampoline;
        return ($Loop_3_trampoline = function (q) {
          while (q) {
            if (q.then) return void q.then($Loop_3_trampoline, $error);

            try {
              if (q.pop) {
                if (q.length) return q.pop() ? $Loop_3_exit.call(this) : q;else q = $Loop_3;
              } else q = q.call(this);
            } catch (_exception) {
              return $error(_exception);
            }
          }
        }.bind(this))($Loop_3);

        function $Loop_3() {
          if (index <= endIndex) {
            return Promise.resolve(this.read(index)).then(function ($await_13) {
              try {
                events.push($await_13);
                index++;
                return $Loop_3;
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }.bind(this), $error);
          } else return [1];
        }

        function $Loop_3_exit() {
          return $return(events);
        }
      }.bind(this));
    }
  }, {
    key: "healthy",
    value: function healthy() {
      return new Promise(function ($return, $error) {
        this.requireInstance();
        return Promise.resolve(this.ipfs.healthy()).then(function ($await_14) {
          try {
            return $return({
              ipfs: $await_14,
              eventStoreContract: this.eventStoreContractInstance.address
            });
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    }
  }, {
    key: "destroy",
    value: function destroy(address) {
      return this.eventStore.destroy(address);
    }
  }]);

  return EventStore;
}();

var _classCallCheck$3 = require$$0.classCallCheck;

var streamModel = function StreamModel(eventStore, filter, reducer, state) {
  var _this = this;

  _classCallCheck$3(this, StreamModel);

  Object.defineProperty(this, "applyEvent", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value(event) {
      // console.log(event.index)
      _this.state.model = _this.reducer(_this.state.model, event);
      _this.state.lastIndex = event.index;
    }
  });
  Object.defineProperty(this, "applyEvents", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value(events) {
      events.filter(_this.filter).map(_this.applyEvent);
    }
  });
  Object.defineProperty(this, "sync", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value() {
      return new Promise(function ($return, $error) {
        var web3$$1, eventCount, updates;
        web3$$1 = _this.eventStore.web3;
        return Promise.resolve(_this.eventStore.eventStoreContractInstance.count.call()).then(function ($await_2) {
          try {
            eventCount = $await_2.toNumber();

            if (eventCount === 0) {
              return $return();
            }

            if (_this.state.lastIndex == null || _this.state.lastIndex < eventCount) {
              return Promise.resolve(_this.eventStore.getSlice(_this.state.lastIndex || 0, eventCount - 1)).then(function ($await_3) {
                try {
                  updates = $await_3;

                  _this.applyEvents(updates);

                  return $If_1.call(this);
                } catch ($boundEx) {
                  return $error($boundEx);
                }
              }.bind(this), $error);
            }

            function $If_1() {
              return $return();
            }

            return $If_1.call(this);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    }
  });
  eventStore.requireInstance();
  this.eventStore = eventStore;
  this.filter = filter;
  this.reducer = reducer;
  this.state = state || {
    contractAddress: this.eventStore.eventStoreContractInstance.address,
    model: {},
    lastIndex: null
  };
};

var src = {
  EventStore: eventStore,
  StreamModel: streamModel,
  IpfsAdapter: ipfs
};
var src_1 = src.EventStore;
var src_2 = src.StreamModel;
var src_3 = src.IpfsAdapter;

exports.default = src;
exports.EventStore = src_1;
exports.StreamModel = src_2;
exports.IpfsAdapter = src_3;
