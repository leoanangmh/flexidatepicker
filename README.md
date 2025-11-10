# FlexiDatepicker

A lightweight, flexible, and powerful vanilla JavaScript datepicker with multiple selection modes. No dependencies required.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![](https://data.jsdelivr.com/v1/package/gh/leoanangmh/flexidatepicker/badge)](https://www.jsdelivr.com/package/gh/leoanangmh/flexidatepicker)
[![npm version](https://img.shields.io/npm/v/flexidatepicker)](https://www.npmjs.com/package/flexidatepicker)
[![npm downloads](https://img.shields.io/npm/dm/flexidatepicker)](https://www.npmjs.com/package/flexidatepicker)
[![bundle size](https://img.shields.io/bundlephobia/minzip/flexidatepicker)](https://bundlephobia.com/package/flexidatepicker)

## Features

- **Four Selection Modes**: Single, Multiple, Range, and Multi-Range
- **Zero Dependencies**: Pure vanilla JavaScript
- **Lightweight**: ~15KB minified
- **Customizable**: Extensive configuration options
- **Responsive**: Works on all devices
- **Accessible**: ARIA-compliant
- **i18n Support**: Built-in internationalization
- **Date Restrictions**: Min/max dates, disabled dates, past/future blocking
- **Smart Controls**: Quick select weekdays, weekends, or all days
- **Custom Formatting**: Flexible date format patterns

## Demo

[View Live Demo](https://flexidatepicker.vercel.app/)

## Installation

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/leoanangmh/flexidatepicker@latest/dist/flexidatepicker.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/leoanangmh/flexidatepicker@latest/dist/flexidatepicker.umd.min.js"></script>
```

### NPM

```bash
npm install flexidatepicker
```

### yarn

```bash
yarn add flexidatepicker
```

### Manual Download

Download the latest release from the [releases page](https://github.com/leoanangmh/flexidatepicker/releases) and include the files in your project:

```html
<link rel="stylesheet" href="path/to/flexidatepicker.min.css">
<script src="path/to/flexidatepicker.js"></script>
```

## Quick Start

### Single Date Selection

```html
<input type="text" id="single-date" placeholder="Select a date">

<script>
  new FlexiDatepicker('#single-date', {
    mode: 'single',
    dateFormat: 'MMM d, yyyy'
  });
</script>
```

### Multiple Date Selection

```html
<input type="text" id="multiple-dates" placeholder="Select multiple dates">

<script>
  new FlexiDatepicker('#multiple-dates', {
    mode: 'multiple'
  });
</script>
```

### Date Range Selection

```html
<input type="text" id="date-range" placeholder="Select a range">

<script>
  new FlexiDatepicker('#date-range', {
    mode: 'range',
    dateFormat: 'MM/dd/yyyy'
  });
</script>
```

### Multi-Range Selection

```html
<input type="text" id="multi-range" placeholder="Select multiple ranges">

<script>
  new FlexiDatepicker('#multi-range', {
    mode: 'multi-range',
    showSelectWeekdays: true,
    showSelectWeekends: true
  });
</script>
```

## Configuration Options

### Basic Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | String | `'multi-range'` | Selection mode: `'single'`, `'multiple'`, `'range'`, `'multi-range'` |
| `locale` | String | `'en-US'` | Locale for date formatting |
| `dateFormat` | String | `'MMM d, yyyy'` | Date display format |

### Display Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selectedDatesDisplaySelector` | String | `null` | CSS selector for external display element |
| `showClearAll` | Boolean | `true` | Show "Clear All" button |
| `showSelectWeekdays` | Boolean | `true` | Show "Select Weekdays" button (multiple/multi-range modes) |
| `showSelectWeekends` | Boolean | `true` | Show "Select Weekends" button (multiple/multi-range modes) |
| `showSelectAllDays` | Boolean | `true` | Show "Select All Days" button (multiple/multi-range modes) |
| `dualCalendar` | Boolean | `true` | Show Dual Calendar |

### Date Restrictions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabledDates` | Array | `[]` | Array of disabled dates (strings or objects with `from`/`to`) |
| `disablePast` | Boolean | `false` | Disable all past dates |
| `disableFuture` | Boolean | `false` | Disable all future dates |
| `minDate` | String | `null` | Minimum selectable date (YYYY-MM-DD) |
| `maxDate` | String | `null` | Maximum selectable date (YYYY-MM-DD) |

### Callbacks

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onSelectionChange` | Function | `null` | Callback when selection changes. Receives `{ ranges: [], dates: [] }` |

## Date Format Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| `yyyy` | 4-digit year | 2025 |
| `yy` | 2-digit year | 25 |
| `MMMM` | Full month name | January |
| `MMM` | Short month name | Jan |
| `MM` | 2-digit month | 01 |
| `M` | Month number | 1 |
| `dd` | 2-digit day | 05 |
| `d` | Day number | 5 |

### Example Formats

```javascript
'MMM d, yyyy'      // Jan 5, 2025
'MM/dd/yyyy'       // 01/05/2025
'd MMMM yyyy'      // 5 January 2025
'yyyy-MM-dd'       // 2025-01-05
```

## Advanced Examples

### With Callback Function

```javascript
new FlexiDatepicker('#datepicker', {
  mode: 'range',
  onSelectionChange: function(data) {
    console.log('Selected ranges:', data.ranges);
    console.log('Selected dates:', data.dates);
    
    // Update your UI or send to server
    if (data.ranges.length > 0) {
      const range = data.ranges[0];
      console.log(`From ${range.start} to ${range.end}`);
    }
  }
});
```

### With Disabled Dates

```javascript
new FlexiDatepicker('#datepicker', {
  mode: 'single',
  disabledDates: [
    '2025-01-01', // New Year's Day
    '2025-12-25', // Christmas
    { from: '2025-07-01', to: '2025-07-07' } // Vacation week
  ],
  disablePast: true,
  minDate: '2025-01-01',
  maxDate: '2025-12-31'
});
```

### With External Display

```html
<input type="text" id="datepicker" placeholder="Select dates">
<div id="selected-display"></div>

<script>
  new FlexiDatepicker('#datepicker', {
    mode: 'multi-range',
    selectedDatesDisplaySelector: '#selected-display'
  });
</script>
```

### Custom Styling

```javascript
new FlexiDatepicker('#datepicker', {
  mode: 'range',
  locale: 'es-ES', // Spanish locale
  dateFormat: 'd/M/yyyy',
  showClearAll: true,
  showSelectWeekdays: false
});
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Author

**Leo Anang Miftahul Huda**

## Changelog

### v1.0.0 (2025-09-11)
- Initial release
- Four selection modes: single, multiple, range, multi-range
- Customizable date formatting
- Date restrictions and disabled dates
- Quick selection controls
- Internationalization support

## Support

- [Documentation](https://flexidatepicker.vercel.app/)
- [Issues](https://github.com/leoanangmh/flexidatepicker/issues)
- [Discussions](https://github.com/leoanangmh/flexidatepicker/discussions)

## Acknowledgments

Built with vanilla JavaScript for maximum compatibility and performance.
