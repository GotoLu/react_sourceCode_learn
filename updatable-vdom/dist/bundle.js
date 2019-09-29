/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const state = {
  timer: null,
  cnt: 5
};
const NodePatchType = {
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  REPLACE: 'REPLACE'
};
const PropsPatchType = {
  DELETE: 'DELETE',
  UPDATE: 'UPDATE'
};
render();

function View() {
  return dom("div", null, "xxx", dom("ul", {
    className: "children"
  }, dom("li", {
    id: state.cnt
  }, state.cnt, "1"), dom("li", {
    id: state.cnt
  }, state.cnt, "2"), dom("li", {
    id: state.cnt
  }, state.cnt, "3")));
}

function setProps(element, props) {
  for (item in props) {
    element.setAttribute(item, props[item]);
  }
}

function createElement(vdom) {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom);
  }

  const element = document.createElement(vdom.tag);
  setProps(element, vdom.props);
  vdom.children.map(createElement).forEach(element.appendChild.bind(element));
  return element;
}

function diffProps(oldProps, newProps) {
  const propsPatch = [];
  const allProps = { ...oldProps,
    ...newProps
  };
  Object.keys(allProps).forEach(p => {
    if (!newProps[p]) {
      propsPatch.push({
        type: PropsPatchType.DELETE,
        props: {
          key: p
        }
      });
    }

    if (oldProps[p] !== newProps[p]) {
      propsPatch.push({
        type: PropsPatchType.UPDATE,
        props: {
          key: p,
          value: newProps[p]
        }
      });
    }
  });
  return propsPatch;
} // diff子节点


function diffChildren(oldChildren, newChildren) {
  let childrenPatch = [];
  const childrenLenth = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < childrenLenth; i++) {
    childrenPatch.push(diffDom(oldChildren[i], newChildren[i]));
  }

  return childrenPatch;
}

function diffDom(oldVDom, newVDom) {
  // 新增
  if (!oldVDom) {
    return {
      type: NodePatchType.CREATE,
      dom: newVDom
    };
  } // 删除


  if (!newVDom) {
    return {
      type: NodePatchType.DELETE
    };
  }
  /**
   * 替换 满足条件
   * 1. 新老dom类型不同
   * 2. 类型相同时，当是字符串或者数字需要判断内容是否相同
   * 3. 类型相同时，且不是字符串或者数字，判断节点的tag是否相同
   */


  if (typeof oldVDom !== typeof newVDom || (typeof oldVDom === 'string' || typeof oldVDom === 'number') && oldVDom !== newVDom || oldVDom.tag !== newVDom.tag) {
    return {
      type: NodePatchType.REPLACE,
      dom: newVDom
    };
  } // 更新


  if (oldVDom.tag) {
    const propsPatch = diffProps(oldVDom.props, newVDom.props);
    const childrenPatch = diffChildren(oldVDom.children, newVDom.children);

    if (propsPatch.length > 0 || childrenPatch.length > 0) {
      return {
        type: NodePatchType.UPDATE,
        props: propsPatch,
        children: childrenPatch
      };
    }
  }

  return null;
} // 更新节点属性


function updateElementProps(dom, props) {
  props.forEach(p => {
    const {
      props: {
        key,
        value
      }
    } = p;

    if (p.type = PropsPatchType.DELETE) {
      dom.removeAttribute(key);
    }

    if (p.type = PropsPatchType.UPDATE) {
      dom.setAttribute(key, value);
    }
  });
} // 更新真实DOM


function updateElement(element, diffPatch, index = 0) {
  if (!diffPatch) {
    return;
  } // 新增节点


  if (diffPatch.type === NodePatchType.CREATE) {
    element.appendChild(createElement(diffPatch.dom));
  } // 获取当前节点，以便后续删除替换和更新


  const curDom = element.childNodes[index]; // 删除当前节点

  if (diffPatch.type === NodePatchType.DELETE) {
    element.removeChild(curDom);
  } // 替换当前节点


  if (diffPatch.type === NodePatchType.REPLACE) {
    element.replaceChild(createElement(diffPatch.dom), curDom);
  } // 更新当前节点


  if (diffPatch.type === NodePatchType.UPDATE) {
    updateElementProps(curDom, diffPatch.props); // 更新子节点

    diffPatch.children.forEach((c, i) => {
      updateElement(curDom, c, i);
    });
  }
}

function tick(element, oldVDom) {
  if (state.cnt > 20) {
    clearInterval(state.timer);
  } // 获取新vdom


  const newVDom = View();
  const diffPatch = diffDom(oldVDom, newVDom);
  updateElement(element, diffPatch);
}

function render() {
  const parent = document.getElementById('root');
  const vdom = View();
  const nodeElemnt = createElement(vdom);
  parent.appendChild(nodeElemnt);
  state.timer = setInterval(() => {
    state.cnt += 1;
    tick(parent, vdom);
  }, 2000);
} // jsx编译时使用，方法名在plugin-transform-react-jsx中定义


function dom(tag, props, ...children) {
  return {
    tag: tag,
    props: props || [],
    children
  };
}

/***/ })
/******/ ]);