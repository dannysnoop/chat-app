export class Response<T> {
  data: T[];
  totalRecord = 0;
  page = 0;
  limit = 0;

  constructor(data: T[], page = 0, take = 10, totalRecord = 0) {
    this.data = data;
    this.limit = take;
    this.totalRecord = totalRecord;
    this.page = Math.ceil(totalRecord / take);
  }
}
