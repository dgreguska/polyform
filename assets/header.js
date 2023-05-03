/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/global-custom/header/js/header.js":
/*!**********************************************************!*\
  !*** ./src/components/global-custom/header/js/header.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainMenu)
/* harmony export */ });
/* harmony import */ var _mobile_menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mobile_menu */ "./src/components/global-custom/header/js/mobile_menu.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var MainMenu = /*#__PURE__*/function () {
  function MainMenu() {
    var _this = this;

    _classCallCheck(this, MainMenu);

    this.initComponents();
    new this.components.mobileMenu();
    window.Global.resizeSensitiveFnc(function () {
      if (!_this.mobileMenuInitialized) {
        if (window.innerWidth <= SBBreakpoints.LG) {
          _this.mobileMenuInitialized = new _this.components.mobileMenu();
        }
      }
    });
  } //TODO: rework if needed


  _createClass(MainMenu, [{
    key: "initComponents",
    value: function initComponents() {
      this.components = {
        mobileMenu: _mobile_menu__WEBPACK_IMPORTED_MODULE_0__["default"]
      };
    }
  }, {
    key: "highlightActiveItem",
    value: function highlightActiveItem() {
      var current_path = window.location.pathname;
      var result_item, result_path;
      document.querySelectorAll('.menu__list .menu__list-item').forEach(function (item) {
        var _item$querySelector;

        var item_path = (_item$querySelector = item.querySelector('a')) === null || _item$querySelector === void 0 ? void 0 : _item$querySelector.getAttribute('href');

        if (current_path.includes(item_path) && (!result_path || item_path > result_path)) {
          result_item = item;
          result_path = item_path;
        }
      });

      if (result_item) {
        result_item.classList.add('menu__list-item--active');
      }
    }
  }]);

  return MainMenu;
}();



/***/ }),

/***/ "./src/components/global-custom/header/js/mobile_menu.js":
/*!***************************************************************!*\
  !*** ./src/components/global-custom/header/js/mobile_menu.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MobileMenu)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var MobileMenu = /*#__PURE__*/function () {
  function MobileMenu() {
    _classCallCheck(this, MobileMenu);

    this.selectors = {
      'item': '.js-mobile-menu-item',
      'sub-level': '.js-mobile-menu-sub-level',
      'back': '.js-mobile-menu-back',
      'scroll': '.js-mobile-menu-scroll',
      'mover': '.js-mobile-menu-mover'
    };
    this.mobileMenu = document.getElementById('mobile-menu');
    this.menuScrollPart = document.querySelector(this.selectors['scroll']);
    this.subLevels = [{
      el: null
    }];
    this.mover = document.querySelector(this.selectors['mover']); // purchase process has different header

    if (this.mobileMenu) {
      this.mobileMenu.addEventListener('click', this.handleMobileMenuClick.bind(this));
    }
  }

  _createClass(MobileMenu, [{
    key: "handleMobileMenuClick",
    value: function handleMobileMenuClick(e) {
      var subMenuItem = e.target.closest(this.selectors['item']);

      if (subMenuItem && subMenuItem.querySelector(this.selectors['sub-level'])) {
        var currentSubMenu = this.subLevels[this.subLevels.length - 1].el;

        if (currentSubMenu == null || currentSubMenu.contains(subMenuItem)) {
          e.stopPropagation();
          this.openSubMenu(subMenuItem);
        }
      }

      var subMenuItemBack = e.target.closest(this.selectors['back']);

      if (subMenuItemBack) {
        e.stopPropagation();
        this.closeSubMenu();
      }
    }
  }, {
    key: "openSubMenu",
    value: function openSubMenu(menuItem) {
      var _this = this;

      this.subLevels.push({
        el: menuItem.querySelector(this.selectors['sub-level'])
      });
      this.subLevels[this.subLevels.length - 1].el.classList.add('active');
      this.subLevels[this.subLevels.length - 1].el.style = 'overflow-x: hidden; overflow-y: auto;';

      if (this.subLevels[this.subLevels.length - 2] && this.subLevels[this.subLevels.length - 2].el) {
        this.subLevels[this.subLevels.length - 2].el.style = '';
      }

      this.mover.style = "transform: translateX(".concat(-100 * (this.subLevels.length - 1), "%)");
      setTimeout(function () {
        _this.menuScrollPart.style = 'overflow: visible;';
      }, 250);
    }
  }, {
    key: "closeSubMenu",
    value: function closeSubMenu() {
      var _this2 = this;

      var current = this.subLevels[this.subLevels.length - 1];
      setTimeout(function () {
        current.el.classList.remove('active');
        current.el.style = '';

        if (_this2.subLevels[_this2.subLevels.length - 1].el) {
          _this2.subLevels[_this2.subLevels.length - 1].el.style = 'overflow-x: hidden; overflow-y: auto;';
        }
      }, 250);
      this.subLevels.pop();
      this.mover.style = "transform: translateX(".concat(-100 * (this.subLevels.length - 1), "%)");

      if (this.subLevels.length - 1 === 0) {
        this.menuScrollPart.style = '';
      }
    }
  }]);

  return MobileMenu;
}();



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************************!*\
  !*** ./src/components/global-custom/header/js/main.js ***!
  \********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header */ "./src/components/global-custom/header/js/header.js");

window.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    new _header__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }, 1);
});
})();

/******/ })()
;
//# sourceMappingURL=header.js.map