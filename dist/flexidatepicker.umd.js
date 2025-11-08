(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FlexiDatepicker = factory());
})(this, (function () { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
  }
  function _createForOfIteratorHelper(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!t) {
      if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
        t && (r = t);
        var n = 0,
          F = function () {};
        return {
          s: F,
          n: function () {
            return n >= r.length ? {
              done: true
            } : {
              done: false,
              value: r[n++]
            };
          },
          e: function (r) {
            throw r;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o,
      a = true,
      u = false;
    return {
      s: function () {
        t = t.call(r);
      },
      n: function () {
        var r = t.next();
        return a = r.done, r;
      },
      e: function (r) {
        u = true, o = r;
      },
      f: function () {
        try {
          a || null == t.return || t.return();
        } finally {
          if (u) throw o;
        }
      }
    };
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  /**
   * FlexiDatepicker
   * A lightweight, dependency-free JavaScript date picker supporting single, multiple, range, and multi-range selection modes.
   *
   * @version 1.0.0
   * @license MIT
   * @author
   *   Leo Anang Miftahul Huda
   *
   **/
  var FlexiDatepicker = /*#__PURE__*/function () {
    function FlexiDatepicker(inputSelector) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _classCallCheck(this, FlexiDatepicker);
      this.inputElement = document.querySelector(inputSelector);
      if (!this.inputElement) {
        console.error("FlexiDatepicker: Input element not found.");
        return;
      }
      this.options = _objectSpread2({
        mode: 'single',
        showClearAll: true,
        dateFormat: 'MMM d, yyyy',
        locale: 'en-US',
        showSelectWeekdays: true,
        showSelectWeekends: true,
        showSelectAllDays: true,
        disabledDates: [],
        disablePast: false,
        disableFuture: false,
        minDate: null,
        maxDate: null
      }, options);
      this.selectedDisplay = this.options.selectedDatesDisplaySelector ? document.querySelector(this.options.selectedDatesDisplaySelector) : null;
      this.currentDate = new Date();
      this.ranges = [];
      this.selectedDates = [];
      this.currentRangeStart = null;
      this.todayString = new Date().toISOString().split('T')[0];
      this.datepickerElement = this.buildUI();
      document.body.appendChild(this.datepickerElement);
      this.show = this.show.bind(this);
      this.handleOutsideClick = this.handleOutsideClick.bind(this);
      this.attachEventListeners();
      this.renderCalendar();
    }
    return _createClass(FlexiDatepicker, [{
      key: "buildUI",
      value: function buildUI() {
        var _this = this;
        var datepickerEl = document.createElement('div');
        datepickerEl.className = 'mrdp-container';
        var showMultiControls = this.options.mode === 'multiple' || this.options.mode === 'multi-range';
        var selectionControlsHTML = '';
        if (showMultiControls) {
          var buttons = [];
          if (this.options.showSelectWeekdays) buttons.push('<button id="mrdp-select-weekdays">Select Weekdays</button>');
          if (this.options.showSelectWeekends) buttons.push('<button id="mrdp-select-weekends">Select Weekends</button>');
          if (this.options.showSelectAllDays) buttons.push('<button id="mrdp-select-all-days">Select All Days</button>');
          var gridCols = "repeat(".concat(buttons.length, ", 1fr)");
          if (buttons.length > 0) {
            selectionControlsHTML = "\n                <div class=\"mrdp-controls\" style=\"grid-template-columns: ".concat(gridCols, ";\">\n                    ").concat(buttons.join(''), "\n                </div>");
          }
        }
        var clearButtonHTML = '';
        if (this.options.showClearAll) {
          clearButtonHTML = "\n            <div class=\"mrdp-controls\">\n                 <button id=\"mrdp-clear-all\" class=\"mrdp-btn-clear\">Clear All Selections</button>\n            </div>";
        }
        var weekdayFormatter = new Intl.DateTimeFormat(this.options.locale, {
          weekday: 'short'
        });
        var weekdayHeaders = [];
        var tempDate = new Date(2020, 5, 7);
        for (var i = 0; i < 7; i++) {
          var dayName = weekdayFormatter.format(new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + i));
          weekdayHeaders.push("<div class=\"mrdp-day-header\">".concat(dayName, "</div>"));
        }
        datepickerEl.innerHTML = "\n            <div class=\"mrdp-header\">\n                <button id=\"mrdp-prev-month-btn\" class=\"mrdp-nav-btn\">&lt;</button>\n                <h3 id=\"mrdp-current-month-year\"></h3>\n                <button id=\"mrdp-next-month-btn\" class=\"mrdp-nav-btn\">&gt;</button>\n            </div>\n            <div class=\"mrdp-grid\">\n                ".concat(weekdayHeaders.join(''), "\n            </div>\n            ").concat(selectionControlsHTML, "\n            ").concat(clearButtonHTML, "\n        ");
        this.grid = datepickerEl.querySelector('.mrdp-grid');
        this.monthYearEl = datepickerEl.querySelector('#mrdp-current-month-year');
        datepickerEl.querySelector('#mrdp-prev-month-btn').addEventListener('click', function () {
          return _this.handlePrevMonth();
        });
        datepickerEl.querySelector('#mrdp-next-month-btn').addEventListener('click', function () {
          return _this.handleNextMonth();
        });
        if (showMultiControls) {
          if (this.options.showSelectWeekdays) datepickerEl.querySelector('#mrdp-select-weekdays').addEventListener('click', function () {
            return _this.handleSelectWeekdays();
          });
          if (this.options.showSelectWeekends) datepickerEl.querySelector('#mrdp-select-weekends').addEventListener('click', function () {
            return _this.handleSelectWeekends();
          });
          if (this.options.showSelectAllDays) datepickerEl.querySelector('#mrdp-select-all-days').addEventListener('click', function () {
            return _this.handleSelectAllDays();
          });
        }
        if (this.options.showClearAll) datepickerEl.querySelector('#mrdp-clear-all').addEventListener('click', function () {
          return _this.handleClearAll();
        });
        return datepickerEl;
      }
    }, {
      key: "attachEventListeners",
      value: function attachEventListeners() {
        this.inputElement.addEventListener('click', this.show);
        document.addEventListener('mousedown', this.handleOutsideClick);
      }
    }, {
      key: "show",
      value: function show() {
        if (this.datepickerElement.classList.contains('mrdp-visible')) return;
        var rect = this.inputElement.getBoundingClientRect();
        this.datepickerElement.style.top = "".concat(rect.bottom + window.scrollY + 5, "px");
        this.datepickerElement.style.left = "".concat(rect.left + window.scrollX, "px");
        this.datepickerElement.classList.add('mrdp-visible');
      }
    }, {
      key: "hide",
      value: function hide() {
        this.datepickerElement.classList.remove('mrdp-visible');
      }
    }, {
      key: "handleOutsideClick",
      value: function handleOutsideClick(e) {
        if (e.target === this.inputElement) return;
        if (this.datepickerElement.contains(e.target)) return;
        this.hide();
      }
    }, {
      key: "renderCalendar",
      value: function renderCalendar() {
        var _this2 = this;
        var year = this.currentDate.getFullYear();
        var month = this.currentDate.getMonth();
        var dayHeaders = this.grid.querySelectorAll('.mrdp-day-header');
        this.grid.innerHTML = '';
        dayHeaders.forEach(function (header) {
          return _this2.grid.appendChild(header);
        });
        this.monthYearEl.textContent = new Date(year, month).toLocaleString(this.options.locale, {
          month: 'long',
          year: 'numeric'
        });
        var firstDayOfMonth = new Date(year, month, 1).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        for (var i = 0; i < firstDayOfMonth; i++) {
          var emptyCell = document.createElement('div');
          emptyCell.classList.add('mrdp-day-cell', 'empty');
          this.grid.appendChild(emptyCell);
        }
        var _loop = function _loop() {
          var date = new Date(year, month, day);
          var dateString = _this2._getDateString(year, month, day);
          var dayCell = document.createElement('div');
          dayCell.classList.add('mrdp-day-cell');
          dayCell.textContent = day;
          dayCell.dataset.date = dateString;
          var disabled = _this2.isDateDisabled(date);
          if (disabled) dayCell.classList.add('disabled');
          if (dateString === _this2.todayString) dayCell.classList.add('today');
          _this2._applySelectionStyles(dayCell, dateString);
          if (!disabled) {
            dayCell.addEventListener('click', function () {
              return _this2.handleDateClick(dateString);
            });
          }
          _this2.grid.appendChild(dayCell);
        };
        for (var day = 1; day <= daysInMonth; day++) {
          _loop();
        }
      }
    }, {
      key: "_applySelectionStyles",
      value: function _applySelectionStyles(dayCell, dateString) {
        if (this.options.mode === 'single' || this.options.mode === 'multiple') {
          if (this.selectedDates.includes(dateString)) {
            dayCell.classList.add('selected-start', 'selected-end');
          }
          return;
        }
        var isStart = false,
          isEnd = false,
          inRange = false;
        var _iterator = _createForOfIteratorHelper(this.ranges),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var range = _step.value;
            if (dateString === range.start) isStart = true;
            if (dateString === range.end) isEnd = true;
            if (dateString > range.start && dateString < range.end) inRange = true;
            if (dateString === range.start && dateString === range.end) isStart = isEnd = true;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (isStart && isEnd) dayCell.classList.add('selected-start', 'selected-end');else if (isStart) dayCell.classList.add('selected-start');else if (isEnd) dayCell.classList.add('selected-end');else if (inRange) dayCell.classList.add('in-range');
        if (dateString === this.currentRangeStart) {
          dayCell.classList.add('pending-start');
        }
      }
    }, {
      key: "handleDateClick",
      value: function handleDateClick(dateString) {
        switch (this.options.mode) {
          case 'single':
            this._handleSingleClick(dateString);
            break;
          case 'multiple':
            this._handleMultipleClick(dateString);
            break;
          case 'range':
            this._handleRangeClick(dateString);
            break;
          case 'multi-range':
            this._handleFlexiClick(dateString);
            break;
        }
        this.renderCalendar();
        this.updateSelectedDisplay();
      }
    }, {
      key: "_handleSingleClick",
      value: function _handleSingleClick(dateString) {
        this.selectedDates = [dateString];
        this.hide();
      }
    }, {
      key: "_handleMultipleClick",
      value: function _handleMultipleClick(dateString) {
        var index = this.selectedDates.indexOf(dateString);
        if (index > -1) {
          this.selectedDates.splice(index, 1);
        } else {
          this.selectedDates.push(dateString);
        }
      }
    }, {
      key: "_handleRangeClick",
      value: function _handleRangeClick(dateString) {
        if (this.currentRangeStart === null) {
          this.currentRangeStart = dateString;
          this.ranges = [];
        } else {
          var startDate = this.currentRangeStart,
            endDate = dateString;
          this.currentRangeStart = null;
          if (endDate < startDate) {
            var _ref = [endDate, startDate];
            startDate = _ref[0];
            endDate = _ref[1];
          }
          this.ranges = [{
            start: startDate,
            end: endDate
          }];
        }
      }
    }, {
      key: "_handleFlexiClick",
      value: function _handleFlexiClick(dateString) {
        var clickedRangeIndex = this.ranges.findIndex(function (range) {
          return dateString >= range.start && dateString <= range.end;
        });
        if (clickedRangeIndex > -1) {
          var clickedRange = this.ranges[clickedRangeIndex];
          this.ranges.splice(clickedRangeIndex, 1);
          var beforeDate = this.addDay(dateString, -1);
          var afterDate = this.addDay(dateString, 1);
          if (clickedRange.start === dateString) {
            if (afterDate <= clickedRange.end) this.ranges.push({
              start: afterDate,
              end: clickedRange.end
            });
          } else if (clickedRange.end === dateString) {
            if (beforeDate >= clickedRange.start) this.ranges.push({
              start: clickedRange.start,
              end: beforeDate
            });
          } else {
            if (beforeDate >= clickedRange.start) this.ranges.push({
              start: clickedRange.start,
              end: beforeDate
            });
            if (afterDate <= clickedRange.end) this.ranges.push({
              start: afterDate,
              end: clickedRange.end
            });
          }
          this.currentRangeStart = null;
        } else if (this.currentRangeStart === null) {
          this.currentRangeStart = dateString;
        } else {
          var startDate = this.currentRangeStart,
            endDate = dateString;
          this.currentRangeStart = null;
          if (endDate < startDate) {
            var _ref2 = [endDate, startDate];
            startDate = _ref2[0];
            endDate = _ref2[1];
          }
          this.ranges.push({
            start: startDate,
            end: endDate
          });
          this.simplifyRanges();
        }
      }
    }, {
      key: "handlePrevMonth",
      value: function handlePrevMonth() {
        var newMonth = this.currentDate.getMonth() - 1;
        var newYear = this.currentDate.getFullYear();
        if (newMonth < 0) {
          newMonth = 11;
          newYear -= 1;
        }
        this.currentDate = new Date(newYear, newMonth, 1);
        this.renderCalendar();
      }
    }, {
      key: "handleNextMonth",
      value: function handleNextMonth() {
        var newMonth = this.currentDate.getMonth() + 1;
        var newYear = this.currentDate.getFullYear();
        if (newMonth > 11) {
          newMonth = 0;
          newYear += 1;
        }
        this.currentDate = new Date(newYear, newMonth, 1);
        this.renderCalendar();
      }
    }, {
      key: "handleSelectAllDays",
      value: function handleSelectAllDays() {
        var year = this.currentDate.getFullYear();
        var month = this.currentDate.getMonth();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        if (this.options.mode === 'multiple') {
          for (var day = 1; day <= daysInMonth; day++) {
            var dateString = this._getDateString(year, month, day);
            if (!this.selectedDates.includes(dateString)) {
              this.selectedDates.push(dateString);
            }
          }
        } else if (this.options.mode === 'multi-range') {
          var firstDayString = this._getDateString(year, month, 1);
          var lastDayString = this._getDateString(year, month, daysInMonth);
          this.addRanges([{
            start: firstDayString,
            end: lastDayString
          }]);
        }
        this.renderCalendar();
        this.updateSelectedDisplay();
      }
    }, {
      key: "handleSelectWeekdays",
      value: function handleSelectWeekdays() {
        var _this$selectedDates;
        var year = this.currentDate.getFullYear();
        var month = this.currentDate.getMonth();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var newRanges = [];
        var newDates = [];
        for (var day = 1; day <= daysInMonth; day++) {
          var date = new Date(year, month, day);
          var dayOfWeek = date.getDay();
          var dateString = this._getDateString(year, month, day);
          var isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
          if (isWeekday) {
            if (this.options.mode === 'multiple' && !this.selectedDates.includes(dateString)) {
              newDates.push(dateString);
            } else if (this.options.mode === 'multi-range' && !this.isDateInRange(dateString)) {
              newRanges.push({
                start: dateString,
                end: dateString
              });
            }
          }
        }
        if (this.options.mode === 'multiple') (_this$selectedDates = this.selectedDates).push.apply(_this$selectedDates, newDates);
        if (this.options.mode === 'multi-range') this.addRanges(newRanges);
        this.renderCalendar();
        this.updateSelectedDisplay();
      }
    }, {
      key: "handleSelectWeekends",
      value: function handleSelectWeekends() {
        var _this$selectedDates2;
        var year = this.currentDate.getFullYear();
        var month = this.currentDate.getMonth();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var newRanges = [];
        var newDates = [];
        for (var day = 1; day <= daysInMonth; day++) {
          var date = new Date(year, month, day);
          var dayOfWeek = date.getDay();
          var dateString = this._getDateString(year, month, day);
          var isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          if (isWeekend) {
            if (this.options.mode === 'multiple' && !this.selectedDates.includes(dateString)) {
              newDates.push(dateString);
            } else if (this.options.mode === 'multi-range' && !this.isDateInRange(dateString)) {
              newRanges.push({
                start: dateString,
                end: dateString
              });
            }
          }
        }
        if (this.options.mode === 'multiple') (_this$selectedDates2 = this.selectedDates).push.apply(_this$selectedDates2, newDates);
        if (this.options.mode === 'multi-range') this.addRanges(newRanges);
        this.renderCalendar();
        this.updateSelectedDisplay();
      }
    }, {
      key: "handleClearAll",
      value: function handleClearAll() {
        this.ranges = [];
        this.selectedDates = [];
        this.currentRangeStart = null;
        this.renderCalendar();
        this.updateSelectedDisplay();
      }
    }, {
      key: "updateSelectedDisplay",
      value: function updateSelectedDisplay() {
        this._updateInputValue();
        if (this.selectedDisplay) {
          this._updateExternalDisplay();
        }
        if (this.options.onSelectionChange && typeof this.options.onSelectionChange === 'function') {
          this.options.onSelectionChange({
            ranges: this.ranges,
            dates: this.selectedDates
          });
        }
      }
    }, {
      key: "_updateInputValue",
      value: function _updateInputValue() {
        if (this.options.mode === 'single') {
          if (this.selectedDates.length === 0) {
            this.inputElement.value = '';
          } else {
            this.inputElement.value = this.formatDate(this.selectedDates[0]);
          }
        } else if (this.options.mode === 'multiple') {
          if (this.selectedDates.length === 0) {
            this.inputElement.value = '';
          } else if (this.selectedDates.length === 1) {
            this.inputElement.value = this.formatDate(this.selectedDates[0]);
          } else {
            this.inputElement.value = "".concat(this.selectedDates.length, " Dates Selected");
          }
        } else if (this.options.mode === 'range') {
          if (this.ranges.length === 0) {
            this.inputElement.value = '';
          } else {
            var range = this.ranges[0];
            var start = this.formatDate(range.start);
            var end = this.formatDate(range.end);
            this.inputElement.value = start === end ? start : "".concat(start, " - ").concat(end);
          }
        } else if (this.options.mode === 'multi-range') {
          if (this.ranges.length === 0) {
            this.inputElement.value = '';
          } else if (this.ranges.length === 1) {
            var _range = this.ranges[0];
            var _start = this.formatDate(_range.start);
            var _end = this.formatDate(_range.end);
            this.inputElement.value = _start === _end ? _start : "".concat(_start, " - ").concat(_end);
          } else {
            this.inputElement.value = "".concat(this.ranges.length, " Ranges Selected");
          }
        }
      }
    }, {
      key: "_updateExternalDisplay",
      value: function _updateExternalDisplay() {
        var _this3 = this;
        var html = '';
        this.selectedDates.sort();
        this.ranges.sort(function (a, b) {
          return a.start.localeCompare(b.start);
        });
        if (this.selectedDates.length === 0 && this.ranges.length === 0 && !this.currentRangeStart) {
          this.selectedDisplay.innerHTML = 'None';
          return;
        }
        this.selectedDates.forEach(function (dateStr) {
          html += "<div>".concat(_this3.formatDate(dateStr, true), "</div>");
        });
        this.ranges.forEach(function (range) {
          var start = _this3.formatDate(range.start, true);
          var end = _this3.formatDate(range.end, true);
          if (start === end) html += "<div>".concat(start, "</div>");else html += "<div>".concat(start, " &mdash; ").concat(end, "</div>");
        });
        if (this.currentRangeStart) {
          var start = this.formatDate(this.currentRangeStart, true);
          html += "<div><em>Selecting range from: ".concat(start, "...</em></div>");
        }
        this.selectedDisplay.innerHTML = html;
      }
    }, {
      key: "formatDate",
      value: function formatDate(dateString) {
        var date = new Date(dateString + 'T00:00:00');
        var fmt = this.options.dateFormat || 'MMM d, yyyy';
        return this.formatCustomDate(date, fmt);
      }
    }, {
      key: "formatCustomDate",
      value: function formatCustomDate(date, format) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var pad = function pad(n) {
          return n.toString().padStart(2, '0');
        };
        var locale = this.options.locale || 'en-US';
        var monthNameShort = new Intl.DateTimeFormat(locale, {
          month: 'short'
        }).format(date);
        var monthNameLong = new Intl.DateTimeFormat(locale, {
          month: 'long'
        }).format(date);
        return format.replace(/dd/g, pad(day)).replace(/d(?![a-z])/g, day).replace(/MMMM/g, monthNameLong).replace(/MMM/g, monthNameShort).replace(/MM/g, pad(month)).replace(/M(?![a-z])/g, month).replace(/yyyy/g, year).replace(/yy/g, String(year).slice(-2));
      }
    }, {
      key: "addDay",
      value: function addDay(dateString, days) {
        var date = new Date(dateString + 'T00:00:00');
        date.setDate(date.getDate() + days);
        return this._getDateString(date.getFullYear(), date.getMonth(), date.getDate());
      }
    }, {
      key: "_getDateString",
      value: function _getDateString(year, month, day) {
        return "".concat(year, "-").concat(String(month + 1).padStart(2, '0'), "-").concat(String(day).padStart(2, '0'));
      }
    }, {
      key: "isDateInRange",
      value: function isDateInRange(dateString) {
        return this.ranges.some(function (range) {
          return dateString >= range.start && dateString <= range.end;
        });
      }
    }, {
      key: "isDateDisabled",
      value: function isDateDisabled(date) {
        var d = date.toISOString().split('T')[0];
        if (this.options.disabledDates.some(function (dis) {
          return dis === d;
        })) {
          return true;
        }
        var _iterator2 = _createForOfIteratorHelper(this.options.disabledDates),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var item = _step2.value;
            if (item && item.from && item.to) {
              if (d >= item.from && d <= item.to) return true;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (this.options.disablePast && date < today) return true;
        if (this.options.disableFuture && date > today) return true;
        if (this.options.minDate && d < this.options.minDate) return true;
        if (this.options.maxDate && d > this.options.maxDate) return true;
        return false;
      }
    }, {
      key: "simplifyRanges",
      value: function simplifyRanges() {
        if (this.ranges.length < 2) return;
        this.ranges.sort(function (a, b) {
          return a.start.localeCompare(b.start);
        });
        var simplified = [this.ranges[0]];
        for (var i = 1; i < this.ranges.length; i++) {
          var current = this.ranges[i];
          var last = simplified[simplified.length - 1];
          var adjacentDate = this.addDay(last.end, 1);
          if (current.start <= last.end || current.start === adjacentDate) {
            last.end = current.end > last.end ? current.end : last.end;
          } else {
            simplified.push(current);
          }
        }
        this.ranges = simplified;
      }
    }, {
      key: "addRanges",
      value: function addRanges(newRanges) {
        var _this4 = this;
        var _iterator3 = _createForOfIteratorHelper(newRanges),
          _step3;
        try {
          var _loop2 = function _loop2() {
            var newRange = _step3.value;
            var isContained = _this4.ranges.some(function (r) {
              return newRange.start >= r.start && newRange.end <= r.end;
            });
            if (!isContained) {
              _this4.ranges.push(newRange);
            }
          };
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            _loop2();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        this.simplifyRanges();
      }
    }]);
  }();

  return FlexiDatepicker;

}));
//# sourceMappingURL=flexidatepicker.umd.js.map
