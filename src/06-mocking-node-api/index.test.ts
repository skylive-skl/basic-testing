import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

import path from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn(),
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  ...jest.requireActual('fs/promises'),
  readFile: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(setTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setInterval');
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(setInterval).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;
    const times = 3;

    doStuffByInterval(callback, interval);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval * times);
    expect(callback).toHaveBeenCalledTimes(times);
  });
});

describe('readFileAsynchronously', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const pathToFile = 'test.txt';
  const fileContent = 'Hello, world!';
  const joinMock = path.join as jest.Mock;
  const existMock = existsSync as jest.Mock;
  const readFileMock = readFile as jest.Mock;

  test('should call join with pathToFile', async () => {
    joinMock.mockReturnValue(pathToFile);
    existMock.mockReturnValue(true);
    readFileMock.mockResolvedValue(fileContent);

    await readFileAsynchronously(pathToFile);

    expect(joinMock).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    joinMock.mockReturnValue(pathToFile);
    existMock.mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
    expect(readFileMock).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    joinMock.mockReturnValue(pathToFile);
    existMock.mockReturnValue(true);
    readFileMock.mockResolvedValue(fileContent);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(fileContent);
    expect(readFileMock).toHaveBeenCalledWith(pathToFile);
  });
});
