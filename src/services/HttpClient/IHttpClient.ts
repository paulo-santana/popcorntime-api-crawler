export interface IHttpClient {
  get(uri: string): Promise<string>
}
