
# peruse 👀

Scroll through webpages automatically. This is useful for browsing through operations dashboards.

### Usage

```
peruse --links <path> [--rate <px> | --fast | --medium | --slow] [--executable <executable>]
```

Create a file containing all links you wish to load. If this file is executable, stdout is intercepted upon running this file.

```
https://www.lipsum.com/
https://www.gutenberg.org/
```
then run
```sh
peruse --links links.txt
```

to open a Puppeteer window that scrolls through site alternatively.

#### Shortcuts

Peruse binds the following shortcuts to each target page:

- <kbd>1</kbd>: set speed to slow
- <kbd>2</kbd>: set speed to medium
- <kbd>3</kbd>: set speed to fast
- <kbd>`Space`</kbd>: pause / unpause

### Tests

Tests that:

- scrolling stops / starts in the correct locations
- the page title dynamically updates
- pause and unpause works
- each speed scrolls at the expected rate


### Stability Index

1, Experimental - This project might die, it's undertested and underdocumented, and redesigns and breaking changes are likely

### License

The MIT License

Copyright (c) 2020 Róisín Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
