type Position = 'Programmer' | 'HR' | 'Manager';

export type Employee = {
  id: string;
  name: string;
  employedAt: Date;
  position: Position;
  salary: number;
};
