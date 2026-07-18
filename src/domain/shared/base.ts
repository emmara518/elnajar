export interface Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ValueObject<T> {
  readonly value: T;
  equals(other: ValueObject<T>): boolean;
}
