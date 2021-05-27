import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  queryText?: string;
  constant: number;
  frequency: number;
}

export const defaultQuery: Partial<MyQuery> = {
  constant: 6.5,
  frequency: 1.0,
};

export interface Store {
  acc_id: string;
  store_id: string;
  register_key: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  widget?: string;
  pos?: string;
  accessKey?: string;
  stores: Array<Store>;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}
