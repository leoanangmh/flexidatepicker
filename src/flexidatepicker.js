/**
 * FlexiDatepicker
 * A lightweight, dependency-free JavaScript date picker supporting single, multiple, range, and multi-range selection modes.
 *
 * @version 1.1.0
 * @license MIT
 * @author
 *   Leo Anang Miftahul Huda
 *
 **/
export default class FlexiDatepicker {
    constructor(inputSelector, options = {}) {
        this.inputElement = document.querySelector(inputSelector)
        if (!this.inputElement) {
            console.error("FlexiDatepicker: Input element not found.")
            return
        }

        this.options = {
            mode: "multi-range",
            showClearAll: true,
            dateFormat: "MMM d, yyyy",
            locale: "en-US",
            selectedDatesDisplaySelector: "",
            showSelectWeekdays: true,
            showSelectWeekends: true,
            showSelectAllDays: true,
            disabledDates: [],
            disablePast: false,
            disableFuture: false,
            minDate: null,
            maxDate: null,
            dualCalendar: false,
            ...options,
        }

        this.selectedDisplay = this.options.selectedDatesDisplaySelector
            ? document.querySelector(this.options.selectedDatesDisplaySelector)
            : null

        this.currentDate = new Date()
        this.currentDate2 = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
        this.ranges = []
        this.selectedDates = []
        this.currentRangeStart = null
        this.todayString = new Date().toISOString().split("T")[0]

        this.datepickerElement = this.buildUI()
        document.body.appendChild(this.datepickerElement)

        this.show = this.show.bind(this)
        this.handleOutsideClick = this.handleOutsideClick.bind(this)

        this.attachEventListeners()
        this.renderCalendar()
    }

    buildUI() {
        const datepickerEl = document.createElement("div")
        datepickerEl.className = "mrdp-container"

        if (this.options.dualCalendar) {
            datepickerEl.classList.add("mrdp-dual-calendar")
        }

        const showMultiControls = this.options.mode === "multiple" || this.options.mode === "multi-range"

        let selectionControlsHTML = ""
        if (showMultiControls) {
            const buttons = []
            if (this.options.showSelectWeekdays) buttons.push('<button id="mrdp-select-weekdays">Select Weekdays</button>')
            if (this.options.showSelectWeekends) buttons.push('<button id="mrdp-select-weekends">Select Weekends</button>')
            if (this.options.showSelectAllDays) buttons.push('<button id="mrdp-select-all-days">Select All Days</button>')

            const gridCols = `repeat(${buttons.length}, 1fr)`

            if (buttons.length > 0) {
                selectionControlsHTML = `
                  <div class="mrdp-controls" style="grid-template-columns: ${gridCols};">
                      ${buttons.join("")}
                  </div>`
            }
        }

        let clearButtonHTML = ""
        if (this.options.showClearAll) {
            clearButtonHTML = `
              <div class="mrdp-controls">
                   <button id="mrdp-clear-all" class="mrdp-btn-clear">Clear All Selections</button>
              </div>`
        }

        const weekdayFormatter = new Intl.DateTimeFormat(this.options.locale, { weekday: "short" })
        const weekdayHeaders = []
        const tempDate = new Date(2020, 5, 7)
        for (let i = 0; i < 7; i++) {
            const dayName = weekdayFormatter.format(
                new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + i),
            )
            weekdayHeaders.push(`<div class="mrdp-day-header">${dayName}</div>`)
        }

        if (this.options.dualCalendar) {
            datepickerEl.innerHTML = `
          <div class="mrdp-dual-wrapper">
            <div class="mrdp-calendar-panel">
              <div class="mrdp-header">
                <button id="mrdp-prev-month-btn" class="mrdp-nav-btn">&lt;</button>
                <div class="mrdp-month-year-display">
                  <button id="mrdp-month-btn" class="mrdp-month-year-btn"></button>
                  <button id="mrdp-year-btn" class="mrdp-month-year-btn"></button>
                </div>
                <button class="mrdp-nav-btn" style="visibility: hidden;">&gt;</button>
              </div>
              <div id="mrdp-month-picker" class="mrdp-picker-overlay" style="display: none;">
                <div class="mrdp-picker-header">Select Month</div>
                <div id="mrdp-month-grid" class="mrdp-month-grid"></div>
              </div>
              <div id="mrdp-year-picker" class="mrdp-picker-overlay" style="display: none;">
                <div class="mrdp-picker-header">
                  <button id="mrdp-year-prev" class="mrdp-year-nav">&lt;</button>
                  <span id="mrdp-year-range"></span>
                  <button id="mrdp-year-next" class="mrdp-year-nav">&gt;</button>
                </div>
                <div id="mrdp-year-grid" class="mrdp-year-grid"></div>
              </div>
              <div class="mrdp-grid">
                ${weekdayHeaders.join("")}
              </div>
            </div>
            <div class="mrdp-calendar-panel">
              <div class="mrdp-header">
                <button class="mrdp-nav-btn" style="visibility: hidden;">&lt;</button>
                <div class="mrdp-month-year-display">
                  <button id="mrdp-month-btn-2" class="mrdp-month-year-btn"></button>
                  <button id="mrdp-year-btn-2" class="mrdp-month-year-btn"></button>
                </div>
                <button id="mrdp-next-month-btn" class="mrdp-nav-btn">&gt;</button>
              </div>
              <div id="mrdp-month-picker-2" class="mrdp-picker-overlay" style="display: none;">
                <div class="mrdp-picker-header">Select Month</div>
                <div id="mrdp-month-grid-2" class="mrdp-month-grid"></div>
              </div>
              <div id="mrdp-year-picker-2" class="mrdp-picker-overlay" style="display: none;">
                <div class="mrdp-picker-header">
                  <button id="mrdp-year-prev-2" class="mrdp-year-nav">&lt;</button>
                  <span id="mrdp-year-range-2"></span>
                  <button id="mrdp-year-next-2" class="mrdp-year-nav">&gt;</button>
                </div>
                <div id="mrdp-year-grid-2" class="mrdp-year-grid"></div>
              </div>
              <div class="mrdp-grid-2">
                ${weekdayHeaders.join("")}
              </div>
            </div>
          </div>
          ${selectionControlsHTML}
          ${clearButtonHTML}
        `
        } else {
            datepickerEl.innerHTML = `
          <div class="mrdp-header">
            <button id="mrdp-prev-month-btn" class="mrdp-nav-btn">&lt;</button>
            <div class="mrdp-month-year-display">
              <button id="mrdp-month-btn" class="mrdp-month-year-btn"></button>
              <button id="mrdp-year-btn" class="mrdp-month-year-btn"></button>
            </div>
            <button id="mrdp-next-month-btn" class="mrdp-nav-btn">&gt;</button>
          </div>
          <div id="mrdp-month-picker" class="mrdp-picker-overlay" style="display: none;">
            <div class="mrdp-picker-header">Select Month</div>
            <div id="mrdp-month-grid" class="mrdp-month-grid"></div>
          </div>
          <div id="mrdp-year-picker" class="mrdp-picker-overlay" style="display: none;">
            <div class="mrdp-picker-header">
              <button id="mrdp-year-prev" class="mrdp-year-nav">&lt;</button>
              <span id="mrdp-year-range"></span>
              <button id="mrdp-year-next" class="mrdp-year-nav">&gt;</button>
            </div>
            <div id="mrdp-year-grid" class="mrdp-year-grid"></div>
          </div>
          <div class="mrdp-grid">
            ${weekdayHeaders.join("")}
          </div>
          ${selectionControlsHTML}
          ${clearButtonHTML}
        `
        }

        this.grid = datepickerEl.querySelector(".mrdp-grid")
        this.monthBtn = datepickerEl.querySelector("#mrdp-month-btn")
        this.yearBtn = datepickerEl.querySelector("#mrdp-year-btn")
        this.monthPicker = datepickerEl.querySelector("#mrdp-month-picker")
        this.yearPicker = datepickerEl.querySelector("#mrdp-year-picker")
        this.monthGrid = datepickerEl.querySelector("#mrdp-month-grid")
        this.yearGrid = datepickerEl.querySelector("#mrdp-year-grid")
        this.yearRange = datepickerEl.querySelector("#mrdp-year-range")
        this.yearStartOffset = 0

        if (this.options.dualCalendar) {
            this.grid2 = datepickerEl.querySelector(".mrdp-grid-2")
            this.monthBtn2 = datepickerEl.querySelector("#mrdp-month-btn-2")
            this.yearBtn2 = datepickerEl.querySelector("#mrdp-year-btn-2")
            this.monthPicker2 = datepickerEl.querySelector("#mrdp-month-picker-2")
            this.yearPicker2 = datepickerEl.querySelector("#mrdp-year-picker-2")
            this.monthGrid2 = datepickerEl.querySelector("#mrdp-month-grid-2")
            this.yearGrid2 = datepickerEl.querySelector("#mrdp-year-grid-2")
            this.yearRange2 = datepickerEl.querySelector("#mrdp-year-range-2")
            this.yearStartOffset2 = 0
        }

        this.setupMonthYearPickers()

        datepickerEl.querySelector("#mrdp-prev-month-btn").addEventListener("click", () => this.handlePrevMonth())
        datepickerEl.querySelector("#mrdp-next-month-btn").addEventListener("click", () => this.handleNextMonth())

        if (showMultiControls) {
            if (this.options.showSelectWeekdays)
                datepickerEl.querySelector("#mrdp-select-weekdays").addEventListener("click", () => this.handleSelectWeekdays())
            if (this.options.showSelectWeekends)
                datepickerEl.querySelector("#mrdp-select-weekends").addEventListener("click", () => this.handleSelectWeekends())
            if (this.options.showSelectAllDays)
                datepickerEl.querySelector("#mrdp-select-all-days").addEventListener("click", () => this.handleSelectAllDays())
        }
        if (this.options.showClearAll)
            datepickerEl.querySelector("#mrdp-clear-all").addEventListener("click", () => this.handleClearAll())

        this.monthBtn.addEventListener("click", () => this.showMonthPicker())
        this.yearBtn.addEventListener("click", () => this.showYearPicker())
        datepickerEl.querySelector("#mrdp-year-prev").addEventListener("click", () => this.changeYearRange(-12))
        datepickerEl.querySelector("#mrdp-year-next").addEventListener("click", () => this.changeYearRange(12))

        if (this.options.dualCalendar) {
            this.monthBtn2.addEventListener("click", () => this.showMonthPicker(2))
            this.yearBtn2.addEventListener("click", () => this.showYearPicker(2))
            datepickerEl.querySelector("#mrdp-year-prev-2").addEventListener("click", () => this.changeYearRange(-12, 2))
            datepickerEl.querySelector("#mrdp-year-next-2").addEventListener("click", () => this.changeYearRange(12, 2))
        }

        return datepickerEl
    }

    setupMonthYearPickers() {
        const monthFormatter = new Intl.DateTimeFormat(this.options.locale, { month: "short" })

        this.monthGrid.innerHTML = ""
        for (let i = 0; i < 12; i++) {
            const monthName = monthFormatter.format(new Date(2020, i, 1))
            const monthBtn = document.createElement("button")
            monthBtn.className = "mrdp-picker-item"
            monthBtn.textContent = monthName
            monthBtn.dataset.month = i
            monthBtn.addEventListener("click", () => this.selectMonth(i))
            this.monthGrid.appendChild(monthBtn)
        }

        if (this.options.dualCalendar) {
            this.monthGrid2.innerHTML = ""
            for (let i = 0; i < 12; i++) {
                const monthName = monthFormatter.format(new Date(2020, i, 1))
                const monthBtn = document.createElement("button")
                monthBtn.className = "mrdp-picker-item"
                monthBtn.textContent = monthName
                monthBtn.dataset.month = i
                monthBtn.addEventListener("click", () => this.selectMonth(i, 2))
                this.monthGrid2.appendChild(monthBtn)
            }
        }

        this.renderYearGrid()
    }

    renderYearGrid(calendarNum = 1) {
        const currentYear = new Date().getFullYear()
        const startYear = currentYear + (calendarNum === 1 ? this.yearStartOffset : this.yearStartOffset2)
        const yearRange = calendarNum === 1 ? this.yearRange : this.yearRange2
        const yearGrid = calendarNum === 1 ? this.yearGrid : this.yearGrid2

        yearRange.textContent = `${startYear} - ${startYear + 11}`
        yearGrid.innerHTML = ""

        for (let i = 0; i < 12; i++) {
            const year = startYear + i
            const yearBtn = document.createElement("button")
            yearBtn.className = "mrdp-picker-item"
            yearBtn.textContent = year
            yearBtn.dataset.year = year

            if (year === currentYear) {
                yearBtn.classList.add("current-year")
            }

            yearBtn.addEventListener("click", () => this.selectYear(year, calendarNum))
            yearGrid.appendChild(yearBtn)
        }
    }

    changeYearRange(offset, calendarNum = 1) {
        if (calendarNum === 1) {
            this.yearStartOffset += offset
        } else {
            this.yearStartOffset2 += offset
        }
        this.renderYearGrid(calendarNum)
    }

    showMonthPicker(calendarNum = 1) {
        if (calendarNum === 1) {
            this.monthPicker.style.display = "block"
            this.yearPicker.style.display = "none"

            const currentMonth = this.currentDate.getMonth()
            this.monthGrid.querySelectorAll(".mrdp-picker-item").forEach((btn, idx) => {
                btn.classList.toggle("active", idx === currentMonth)
            })
        } else {
            this.monthPicker2.style.display = "block"
            this.yearPicker2.style.display = "none"

            const currentMonth = this.currentDate2.getMonth()
            this.monthGrid2.querySelectorAll(".mrdp-picker-item").forEach((btn, idx) => {
                btn.classList.toggle("active", idx === currentMonth)
            })
        }
    }

    showYearPicker(calendarNum = 1) {
        if (calendarNum === 1) {
            this.yearPicker.style.display = "block"
            this.monthPicker.style.display = "none"

            const currentYear = this.currentDate.getFullYear()
            const baseYear = new Date().getFullYear()
            this.yearStartOffset = Math.floor((currentYear - baseYear) / 12) * 12
            this.renderYearGrid(1)

            this.yearGrid.querySelectorAll(".mrdp-picker-item").forEach((btn) => {
                btn.classList.toggle("active", Number.parseInt(btn.dataset.year) === currentYear)
            })
        } else {
            this.yearPicker2.style.display = "block"
            this.monthPicker2.style.display = "none"

            const currentYear = this.currentDate2.getFullYear()
            const baseYear = new Date().getFullYear()
            this.yearStartOffset2 = Math.floor((currentYear - baseYear) / 12) * 12
            this.renderYearGrid(2)

            this.yearGrid2.querySelectorAll(".mrdp-picker-item").forEach((btn) => {
                btn.classList.toggle("active", Number.parseInt(btn.dataset.year) === currentYear)
            })
        }
    }

    selectMonth(month, calendarNum = 1) {
        if (calendarNum === 1) {
            this.currentDate.setMonth(month)
            this.monthPicker.style.display = "none"
        } else {
            this.currentDate2.setMonth(month)
            this.monthPicker2.style.display = "none"
        }
        if (this.options.dualCalendar && calendarNum === 1) {
            this.currentDate2 = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
        }
        this.renderCalendar()
    }

    selectYear(year, calendarNum = 1) {
        if (calendarNum === 1) {
            this.currentDate.setFullYear(year)
            this.yearPicker.style.display = "none"
        } else {
            this.currentDate2.setFullYear(year)
            this.yearPicker2.style.display = "none"
        }
        if (this.options.dualCalendar && calendarNum === 1) {
            this.currentDate2 = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
        }
        this.renderCalendar()
    }

    show() {
        if (this.datepickerElement.classList.contains("mrdp-visible")) return

        const rect = this.inputElement.getBoundingClientRect()

        this.datepickerElement.style.top = `${rect.bottom + window.scrollY + 5}px`
        this.datepickerElement.style.left = `${rect.left + window.scrollX}px`

        this.datepickerElement.classList.add("mrdp-visible")
    }

    hide() {
        this.datepickerElement.classList.remove("mrdp-visible")
    }

    handleOutsideClick(e) {
        if (e.target === this.inputElement) return
        if (this.datepickerElement.contains(e.target)) return
        this.hide()
    }

    renderCalendar() {
        this.renderSingleCalendar(this.currentDate, this.grid, this.monthBtn, this.yearBtn)

        if (this.options.dualCalendar) {
            this.renderSingleCalendar(this.currentDate2, this.grid2, this.monthBtn2, this.yearBtn2)
        }
    }

    renderSingleCalendar(date, grid, monthBtn, yearBtn) {
        const year = date.getFullYear()
        const month = date.getMonth()

        const dayHeaders = Array.from(grid.querySelectorAll(".mrdp-day-header"))

        const dateCells = Array.from(grid.querySelectorAll(".mrdp-day-cell"))
        dateCells.forEach((cell) => cell.remove())

        const monthFormatter = new Intl.DateTimeFormat(this.options.locale, { month: "long" })
        monthBtn.textContent = monthFormatter.format(date)
        yearBtn.textContent = year

        const firstDayOfMonth = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement("div")
            emptyCell.classList.add("mrdp-day-cell", "empty")
            grid.appendChild(emptyCell)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cellDate = new Date(year, month, day)
            const dateString = this._getDateString(year, month, day)
            const dayCell = document.createElement("div")
            dayCell.classList.add("mrdp-day-cell")
            dayCell.textContent = day
            dayCell.dataset.date = dateString

            const disabled = this.isDateDisabled(cellDate)
            if (disabled) dayCell.classList.add("disabled")

            if (dateString === this.todayString) dayCell.classList.add("today")

            this._applySelectionStyles(dayCell, dateString)

            if (!disabled) {
                dayCell.addEventListener("click", () => this.handleDateClick(dateString))
            }

            grid.appendChild(dayCell)
        }
    }

    _applySelectionStyles(dayCell, dateString) {
        if (this.options.mode === "single" || this.options.mode === "multiple") {
            if (this.selectedDates.includes(dateString)) {
                dayCell.classList.add("selected-start", "selected-end") // Use range style for single day
            }
            return
        }

        let isStart = false,
            isEnd = false,
            inRange = false
        for (const range of this.ranges) {
            if (dateString === range.start) isStart = true
            if (dateString === range.end) isEnd = true
            if (dateString > range.start && dateString < range.end) inRange = true
            if (dateString === range.start && dateString === range.end) isStart = isEnd = true
        }

        if (isStart && isEnd) dayCell.classList.add("selected-start", "selected-end")
        else if (isStart) dayCell.classList.add("selected-start")
        else if (isEnd) dayCell.classList.add("selected-end")
        else if (inRange) dayCell.classList.add("in-range")

        if (dateString === this.currentRangeStart) {
            dayCell.classList.add("pending-start")
        }
    }

    handleDateClick(dateString) {
        switch (this.options.mode) {
            case "single":
                this._handleSingleClick(dateString)
                break
            case "multiple":
                this._handleMultipleClick(dateString)
                break
            case "range":
                this._handleRangeClick(dateString)
                break
            case "multi-range":
                this._handleFlexiClick(dateString)
                break
        }

        this.renderCalendar()
        this.updateSelectedDisplay()
    }

    _handleSingleClick(dateString) {
        this.selectedDates = [dateString]
        this.hide()
    }

    _handleMultipleClick(dateString) {
        const index = this.selectedDates.indexOf(dateString)
        if (index > -1) {
            this.selectedDates.splice(index, 1)
        } else {
            this.selectedDates.push(dateString)
        }
    }

    _handleRangeClick(dateString) {
        if (this.currentRangeStart === null) {
            this.currentRangeStart = dateString
            this.ranges = []
        } else {
            let startDate = this.currentRangeStart,
                endDate = dateString
            this.currentRangeStart = null
            if (endDate < startDate) [startDate, endDate] = [endDate, startDate]

            this.ranges = [{ start: startDate, end: endDate }]
        }
    }

    _handleFlexiClick(dateString) {
        const clickedRangeIndex = this.ranges.findIndex((range) => dateString >= range.start && dateString <= range.end)

        if (clickedRangeIndex > -1) {
            const clickedRange = this.ranges[clickedRangeIndex]
            this.ranges.splice(clickedRangeIndex, 1)

            const beforeDate = this.addDay(dateString, -1)
            const afterDate = this.addDay(dateString, 1)

            if (clickedRange.start === dateString) {
                if (afterDate <= clickedRange.end) this.ranges.push({ start: afterDate, end: clickedRange.end })
            } else if (clickedRange.end === dateString) {
                if (beforeDate >= clickedRange.start) this.ranges.push({ start: clickedRange.start, end: beforeDate })
            } else {
                if (beforeDate >= clickedRange.start) this.ranges.push({ start: clickedRange.start, end: beforeDate })
                if (afterDate <= clickedRange.end) this.ranges.push({ start: afterDate, end: clickedRange.end })
            }
            this.currentRangeStart = null
        } else if (this.currentRangeStart === null) {
            this.currentRangeStart = dateString
        } else {
            let startDate = this.currentRangeStart,
                endDate = dateString
            this.currentRangeStart = null
            if (endDate < startDate) [startDate, endDate] = [endDate, startDate]

            this.ranges.push({ start: startDate, end: endDate })
            this.simplifyRanges()
        }
    }

    handlePrevMonth() {
        let newMonth = this.currentDate.getMonth() - 1
        let newYear = this.currentDate.getFullYear()
        if (newMonth < 0) {
            newMonth = 11
            newYear -= 1
        }
        this.currentDate = new Date(newYear, newMonth, 1)

        if (this.options.dualCalendar) {
            this.currentDate2 = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
        }

        this.renderCalendar()
    }

    handleNextMonth() {
        let newMonth = this.currentDate.getMonth() + 1
        let newYear = this.currentDate.getFullYear()
        if (newMonth > 11) {
            newMonth = 0
            newYear += 1
        }
        this.currentDate = new Date(newYear, newMonth, 1)

        if (this.options.dualCalendar) {
            this.currentDate2 = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
        }

        this.renderCalendar()
    }

    handleSelectAllDays() {
        const year = this.currentDate.getFullYear()
        const month = this.currentDate.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        if (this.options.mode === "multiple") {
            for (let day = 1; day <= daysInMonth; day++) {
                const dateString = this._getDateString(year, month, day)
                if (!this.selectedDates.includes(dateString)) {
                    this.selectedDates.push(dateString)
                }
            }
        } else if (this.options.mode === "multi-range") {
            const firstDayString = this._getDateString(year, month, 1)
            const lastDayString = this._getDateString(year, month, daysInMonth)
            this.addRanges([{ start: firstDayString, end: lastDayString }])
        }

        if (this.options.dualCalendar) {
            const year = this.currentDate2.getFullYear()
            const month = this.currentDate2.getMonth()
            const daysInMonth = new Date(year, month + 1, 0).getDate()

            if (this.options.mode === "multiple") {
                for (let day = 1; day <= daysInMonth; day++) {
                    const dateString = this._getDateString(year, month, day)
                    if (!this.selectedDates.includes(dateString)) {
                        this.selectedDates.push(dateString)
                    }
                }
            } else if (this.options.mode === "multi-range") {
                const firstDayString = this._getDateString(year, month, 1)
                const lastDayString = this._getDateString(year, month, daysInMonth)
                this.addRanges([{ start: firstDayString, end: lastDayString }])
            }
        }

        this.renderCalendar()
        this.updateSelectedDisplay()
    }

    handleSelectWeekdays() {
        const year = this.currentDate.getFullYear()
        const month = this.currentDate.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        const newRanges = []
        const newDates = []

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            const dayOfWeek = date.getDay()
            const dateString = this._getDateString(year, month, day)

            const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5

            if (isWeekday) {
                if (this.options.mode === "multiple" && !this.selectedDates.includes(dateString)) {
                    newDates.push(dateString)
                } else if (this.options.mode === "multi-range" && !this.isDateInRange(dateString)) {
                    newRanges.push({ start: dateString, end: dateString })
                }
            }
        }

        if (this.options.dualCalendar) {
            const year = this.currentDate2.getFullYear()
            const month = this.currentDate2.getMonth()
            const daysInMonth = new Date(year, month + 1, 0).getDate()

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day)
                const dayOfWeek = date.getDay()
                const dateString = this._getDateString(year, month, day)

                const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5

                if (isWeekday) {
                    if (this.options.mode === "multiple" && !this.selectedDates.includes(dateString)) {
                        newDates.push(dateString)
                    } else if (this.options.mode === "multi-range" && !this.isDateInRange(dateString)) {
                        newRanges.push({ start: dateString, end: dateString })
                    }
                }
            }
        }

        if (this.options.mode === "multiple") this.selectedDates.push(...newDates)
        if (this.options.mode === "multi-range") this.addRanges(newRanges)

        this.renderCalendar()
        this.updateSelectedDisplay()
    }

    handleSelectWeekends() {
        const year = this.currentDate.getFullYear()
        const month = this.currentDate.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        const newRanges = []
        const newDates = []

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            const dayOfWeek = date.getDay()
            const dateString = this._getDateString(year, month, day)

            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

            if (isWeekend) {
                if (this.options.mode === "multiple" && !this.selectedDates.includes(dateString)) {
                    newDates.push(dateString)
                } else if (this.options.mode === "multi-range" && !this.isDateInRange(dateString)) {
                    newRanges.push({ start: dateString, end: dateString })
                }
            }
        }
        if (this.options.dualCalendar) {
            const year = this.currentDate2.getFullYear()
            const month = this.currentDate2.getMonth()
            const daysInMonth = new Date(year, month + 1, 0).getDate()

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day)
                const dayOfWeek = date.getDay()
                const dateString = this._getDateString(year, month, day)

                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                if (isWeekend) {
                    if (this.options.mode === "multiple" && !this.selectedDates.includes(dateString)) {
                        newDates.push(dateString)
                    } else if (this.options.mode === "multi-range" && !this.isDateInRange(dateString)) {
                        newRanges.push({ start: dateString, end: dateString })
                    }
                }
            }
        }

        if (this.options.mode === "multiple") this.selectedDates.push(...newDates)
        if (this.options.mode === "multi-range") this.addRanges(newRanges)

        this.renderCalendar()
        this.updateSelectedDisplay()
    }

    handleClearAll() {
        this.ranges = []
        this.selectedDates = []
        this.currentRangeStart = null
        this.renderCalendar()
        this.updateSelectedDisplay()
    }

    updateSelectedDisplay() {
        this._updateInputValue()

        if (this.selectedDisplay) {
            this._updateExternalDisplay()
        }

        if (this.options.onSelectionChange && typeof this.options.onSelectionChange === "function") {
            this.options.onSelectionChange({
                ranges: this.ranges,
                dates: this.selectedDates,
            })
        }
    }

    _updateInputValue() {
        if (this.options.mode === "single") {
            if (this.selectedDates.length === 0) {
                this.inputElement.value = ""
            } else {
                this.inputElement.value = this.formatDate(this.selectedDates[0])
            }
        } else if (this.options.mode === "multiple") {
            if (this.selectedDates.length === 0) {
                this.inputElement.value = ""
            } else if (this.selectedDates.length === 1) {
                this.inputElement.value = this.formatDate(this.selectedDates[0])
            } else {
                this.inputElement.value = `${this.selectedDates.length} Dates Selected`
            }
        } else if (this.options.mode === "range") {
            if (this.ranges.length === 0) {
                this.inputElement.value = ""
            } else {
                const range = this.ranges[0]
                const start = this.formatDate(range.start)
                const end = this.formatDate(range.end)
                this.inputElement.value = start === end ? start : `${start} - ${end}`
            }
        } else if (this.options.mode === "multi-range") {
            if (this.ranges.length === 0) {
                this.inputElement.value = ""
            } else if (this.ranges.length === 1) {
                const range = this.ranges[0]
                const start = this.formatDate(range.start)
                const end = this.formatDate(range.end)
                this.inputElement.value = start === end ? start : `${start} - ${end}`
            } else {
                this.inputElement.value = `${this.ranges.length} Ranges Selected`
            }
        }
    }

    _updateExternalDisplay() {
        let html = ""

        this.selectedDates.sort()
        this.ranges.sort((a, b) => a.start.localeCompare(b.start))

        if (this.selectedDates.length === 0 && this.ranges.length === 0 && !this.currentRangeStart) {
            this.selectedDisplay.innerHTML = "None"
            return
        }

        this.selectedDates.forEach((dateStr) => {
            html += `<div>${this.formatDate(dateStr, true)}</div>`
        })

        this.ranges.forEach((range) => {
            const start = this.formatDate(range.start, true)
            const end = this.formatDate(range.end, true)
            if (start === end) html += `<div>${start}</div>`
            else html += `<div>${start} &mdash; ${end}</div>`
        })

        if (this.currentRangeStart) {
            const start = this.formatDate(this.currentRangeStart, true)
            html += `<div><em>Selecting range from: ${start}...</em></div>`
        }

        this.selectedDisplay.innerHTML = html
    }

    formatDate(dateString, showYear = false) {
        const date = new Date(dateString + "T00:00:00")
        const fmt = this.options.dateFormat || "MMM d, yyyy"
        return this.formatCustomDate(date, fmt)
    }

    formatCustomDate(date, format) {
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        const pad = (n) => n.toString().padStart(2, "0")

        const locale = this.options.locale || "en-US"
        const monthNameShort = new Intl.DateTimeFormat(locale, { month: "short" }).format(date)
        const monthNameLong = new Intl.DateTimeFormat(locale, { month: "long" }).format(date)

        return format
            .replace(/dd/g, pad(day))
            .replace(/d(?![a-z])/g, day)
            .replace(/MMMM/g, monthNameLong)
            .replace(/MMM/g, monthNameShort)
            .replace(/MM/g, pad(month))
            .replace(/M(?![a-z])/g, month)
            .replace(/yyyy/g, year)
            .replace(/yy/g, String(year).slice(-2))
    }

    addDay(dateString, days) {
        const date = new Date(dateString + "T00:00:00")
        date.setDate(date.getDate() + days)
        return this._getDateString(date.getFullYear(), date.getMonth(), date.getDate())
    }

    _getDateString(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    }

    isDateInRange(dateString) {
        return this.ranges.some((range) => dateString >= range.start && dateString <= range.end)
    }

    isDateDisabled(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const d = `${year}-${month}-${day}`

        if (this.options.disabledDates.some((dis) => dis === d)) {
            return true
        }

        for (const item of this.options.disabledDates) {
            if (item && item.from && item.to) {
                if (d >= item.from && d <= item.to) {
                    return true
                }
            }
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const todayYear = today.getFullYear()
        const todayMonth = String(today.getMonth() + 1).padStart(2, '0')
        const todayDay = String(today.getDate()).padStart(2, '0')
        const todayStr = `${todayYear}-${todayMonth}-${todayDay}`

        if (this.options.disablePast && d < todayStr) return true
        if (this.options.disableFuture && d > todayStr) return true

        if (this.options.minDate && d < this.options.minDate) return true
        if (this.options.maxDate && d > this.options.maxDate) return true

        return false
    }

    simplifyRanges() {
        if (this.ranges.length < 2) return
        this.ranges.sort((a, b) => a.start.localeCompare(b.start))

        const simplified = [this.ranges[0]]
        for (let i = 1; i < this.ranges.length; i++) {
            const current = this.ranges[i]
            const last = simplified[simplified.length - 1]
            const adjacentDate = this.addDay(last.end, 1)

            if (current.start <= last.end || current.start === adjacentDate) {
                last.end = current.end > last.end ? current.end : last.end
            } else {
                simplified.push(current)
            }
        }
        this.ranges = simplified
    }


    addRanges(newRanges) {
        for (const newRange of newRanges) {
            const isContained = this.ranges.some((r) => newRange.start >= r.start && newRange.end <= r.end)
            if (!isContained) {
                this.ranges.push(newRange)
            }
        }
        this.simplifyRanges()
    }

    attachEventListeners() {
        this.inputElement.addEventListener("click", this.show)
        document.addEventListener('mousedown', this.handleOutsideClick);
    }
}