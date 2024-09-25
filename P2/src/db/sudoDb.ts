import { generateRandomId } from './IdGenerator';

export type ObjectwithId = {
  id: string;
};

export class MyDb<T extends ObjectwithId> {
  private elements = new Array<T>();

  public async insert(args: T) {
    args.id = generateRandomId();
    this.elements.push(args);
    return args.id;
  }

  public async getBy(argName: keyof T, argValue: string): Promise<T | undefined> {
    const element: T | undefined = this.elements.find((x) => {
      x[argName] === argValue;
    });
    if (element) {
      return element;
    }
  }

  public async findAllBy(argName: keyof T, argValue: string) {
    return this.elements.filter((x) => x[argName] === argValue);
  }

  public async update(id: string, argName: keyof T, argValue: any) {
    const index = this.elements.findIndex((x) => x.id === id);
    this.elements[index][argName] = argValue;
  }

  public async delete(id: string) {
    const index = this.elements.findIndex((x) => x.id === id);
    this.elements.splice(index, 1);
  }

  public async getAllElements(): Promise<T[] | undefined> {
    return this.elements;
  }
}
