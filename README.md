# ExFile

ExFile is a extendable file wraper in browser.

It extends native file and provide way to install plugins, but ExFile won't provide any feature it self.

## Install

```sh
npm i -S ex-file
yarn add ex-file
```

## Usage

Create ExFile like a native file, or create ExFile by pass a native file.
and ExFile works just like native file.

```javascript
import ExFile from '@ex-file/ex-file';

const exFile1 = new ExFile(['string'], 'filename.txt', {
  lastModified: 1188489600000
});
const nativeFile = new File(['string'], 'filename.txt', {
  lastModified: 1188489600000
});
const exFile2 = new ExFile(nativeFile);

// exFile1.size === nativeFile.size === exFile2.size
// exFile1.name === nativeFile.name === exFile2.name
```

## Write a plugin for ExFile

A plugin is a object with property 'name', which contains a string, it should be same as the package name.
and ExFile plugin should implements 'install' method, when plugin install to exfile, the method will be call and pass ExFile class.

```javascript
import ExFile from '@ex-file/ex-file';

const plugin = {
  name: 'ex-file-is-modified-today',
  install(E) {
    E.prototype.isModifiedToday = function() {
      const currentDay = new Date();
      const modifiedDate = new Date(this.lastModified);
      return (
        currentDay.getFullYear() === modifiedDate.getFullYear() &&
        currentDay.getMonth() === modifiedDate.getMonth() &&
        currentDay.getDate() === modifiedDate.getDate()
      );
    };
  }
};

ExFile.use(plugin);

const today = new Date();
const todayFile = new YukineFile(['yukine'], 'yukine.txt', {
  lastModified: today.getTime()
});
todayFile.isModifiedToday();
// => true

const yestoday = new Date();
yestoday.setDate(yestoday.getDate() - 1);
const yestodayFile = new YukineFile(['yukine'], 'yukine.txt', {
  lastModified: yestoday.getTime()
});
yestodayFile.isModifiedToday();
// => false
```

# Todo

I will publish some plugins for ExFile, the followings are todos.

- [ ] **@ex-file/select-files**: open a file select dialog by function call, and get ExFile asynchronous.
- [ ] **@ex-file/read-as-stream**: asynchronous read file part by part.
- [ ] **@ex-file/get-md5**: get the md5 of file using SparkMD5.
- [ ] **@ex-file/get-local-url**: get a blob url for a file.
- [ ] **@ex-file/get-image-size**: asynchronous get size of a image file.
- [ ] **@ex-file/get-audio-duration**: asynchronous get the audio duration of a audio file.
- [ ] **@ex-file/read-text**: asynchronous read text in a file.
