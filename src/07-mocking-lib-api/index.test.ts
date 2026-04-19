// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
const baseURL = 'https://jsonplaceholder.typicode.com';
const relativePath = '/tests';
const mockedResponse = {
  userId: 1,
  id: 1,
  title: 'title',
  body: 'body',
};

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockedResponse }),
    });

    axios.create({ baseURL });

    expect(axios.create).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockedResponse }),
    });

    const axiosClient = axios.create({ baseURL });
    await throttledGetDataFromApi(relativePath);

    expect(axiosClient.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockedResponse }),
    });

    axios.create({ baseURL });
    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(mockedResponse);
  });
});
