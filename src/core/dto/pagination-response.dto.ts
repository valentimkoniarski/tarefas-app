export class PaginationResponseDto<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;

  constructor(data: T[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.totalPages = Math.ceil(total / pageSize);
    this.currentPage = page;
  }
}
