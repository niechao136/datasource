import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  register_keys?: Array<string>;
  store_ids?: Array<string>;
  date?: Array<string>;
  range?: string;
  constant: number;
  frequency: number;
}

export const defaultQuery: Partial<MyQuery> = {
  register_keys: [],
  store_ids: [],
  date: [],
  range: "ww",
  constant: 6.5,
  frequency: 1.0,
};

export interface Store {
  acc_id: string;
  store_id: string;
  store_name: string;
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
