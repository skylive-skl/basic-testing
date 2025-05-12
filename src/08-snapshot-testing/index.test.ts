import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const values = [1, 2, 3];
    const linkedList = generateLinkedList(values);
    const expectedLinkedList = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    expect(linkedList).toStrictEqual(expectedLinkedList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const values = [4, 5, 6];
    const linkedList = generateLinkedList(values);

    expect(linkedList).toMatchSnapshot();
  });
});
