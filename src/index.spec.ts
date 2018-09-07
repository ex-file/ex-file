// tslint:disable:no-expression-statement
import { test } from 'ava';
import ExFile, { ExFilePlugin } from './';

const exFile = new ExFile(['clannad'], 'clannad.txt', {
  lastModified: 1188489600000
});

const originFile = new File(['clannad'], 'clannad.txt', {
  lastModified: 1188489600000
});

test('ExFile should works like origin file', t => {
  t.is(exFile.name, originFile.name);
  t.is(exFile.size, originFile.size);
  t.is(exFile.lastModified, originFile.lastModified);
});

test('ExFile construct by File should works', t => {
  const file = new ExFile(originFile);
  t.is(file.name, originFile.name);
  t.is(file.size, originFile.size);
  t.is(file.lastModified, originFile.lastModified);
});

test('ExFile throw error when params error', t => {
  try {
    // tslint:disable-next-line:no-unused-expression
    new ExFile(['error']);
    t.fail();
  } catch (e) {
    t.pass();
  }
  try {
    // tslint:disable-next-line:no-unused-expression
    new ExFile(['success'], 'success.txt');
    t.pass();
  } catch (e) {
    t.fail();
  }
});

test('ExFile should be able to install plugin', t => {
  const plugin: ExFilePlugin = {
    name: 'ex-file-info',
    install(E) {
      E.prototype.info = function() {
        return `filename: ${this.name}, size: ${
          this.size
        }, lastModifiedTime: ${new Date(this.lastModified).toDateString()}`;
      };
    }
  };

  ExFile.use(plugin);

  const file = new ExFile(['miku'], 'miku.txt', {
    lastModified: 1188489600000
  });

  t.is(
    file.info(),
    'filename: miku.txt, size: 4, lastModifiedTime: Fri Aug 31 2007'
  );
});

test('ExFile should install plugin just once when multiple install', t => {
  let installCound = 0;

  const plugin: ExFilePlugin = {
    name: 'multiple-test-plugin',
    install() {
      installCound += 1;
    }
  };

  ExFile.use(plugin);
  ExFile.use(plugin);

  t.is(installCound, 1);
});

test('Example in readme should works', t => {
  const plugin: ExFilePlugin = {
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
  const todayFile = new ExFile(['yukine'], 'yukine.txt', {
    lastModified: today.getTime()
  });
  t.is(todayFile.isModifiedToday(), true);

  const yestoday = new Date();
  yestoday.setDate(yestoday.getDate() - 1);
  const yestodayFile = new ExFile(['yukine'], 'yukine.txt', {
    lastModified: yestoday.getTime()
  });
  t.is(yestodayFile.isModifiedToday(), false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFile = new ExFile(['yukine'], 'yukine.txt', {
    lastModified: tomorrow.getTime()
  });
  t.is(tomorrowFile.isModifiedToday(), false);
});
