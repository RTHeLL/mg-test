/**
 * Interface for pagination
 *
 * @interface IPagination
 * @property {number} page - page number
 * @property {number} limit - limit
 * @property {number} offset - offset
 */
export interface IPagination {
  page: number;
  limit: number;
  offset: number;
}
