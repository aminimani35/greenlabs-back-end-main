export class GetUsersQuery {
  // Add pagination, filtering, sorting parameters here as needed
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
