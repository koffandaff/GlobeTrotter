export interface CommunityTripsQuery {
  page: number;
  limit: number;
  sort: "popular" | "recent";
  region?: string;
}

export interface AddCommentDto {
  content: string;
}

export interface PaginationQuery {
  page: number;
  limit: number;
}
