export interface IDatabaseClient<T = Movie | Series | Anime> {
  saveMany(items: T[]): Promise<void>
  getAll(): Promise<Array<Movie>>
}
