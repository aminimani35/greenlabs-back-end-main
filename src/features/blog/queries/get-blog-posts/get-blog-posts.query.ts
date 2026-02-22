export class GetBlogPostsQuery {
  constructor(
    public readonly status?: string,
    public readonly tag?: string,
    public readonly category?: string,
    public readonly isFeatured?: boolean,
    public readonly search?: string,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
