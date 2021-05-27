import defaults from 'lodash/defaults';
import axios from 'axios';
import qs from 'qs';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame,
} from '@grafana/data';

import {defaultQuery, MyDataSourceOptions, MyQuery, Store} from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  accessKey: string;
  widget: string;
  pos: string;
  stores: Array<Store>;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    console.log(instanceSettings);
    this.accessKey = instanceSettings.jsonData.accessKey || "";
    this.widget = instanceSettings.jsonData.widget || "";
    this.pos = instanceSettings.jsonData.pos || "";
    this.stores = instanceSettings.jsonData.stores || [];
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();
    const duration = to - from;
    const step = duration / 1000;
    console.log(options);

    // Return a constant for each query.
    const data = options.targets.map(target => {
      const query = defaults(target, defaultQuery);
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'time', type: FieldType.time },
          { name: 'value', type: FieldType.number },
        ],
      });
      for (let t = 0; t < duration; t += step) {
        frame.add({ time: from + t, value: Math.sin((2 * Math.PI * query.frequency * t) / duration) });
      }
      return frame;
    });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return this.widgetRequest("/api/store/list", {
      access_key: this.accessKey
    }).then(res => {
      if (res.data.status == 1) {
        res.data.stores.forEach((value: any) => this.stores.push(value));
        if (this.stores.length == 0) {
          return {
            status: 'error',
            message: 'No Store',
          };
        }
        else {
          return this.posRequest("/api/pos/isposdata", {
            "account_id": this.stores[0].acc_id,
            "rk": this.stores[0].register_key,
            "access_key": this.accessKey
          }).then(data => {
            if (data.data.status && data.data.status == 1) {
              return {
                status: 'success',
                message: 'Success',
              };
            }
            else {
              return {
                status: 'error',
                message: data.data.msg,
              };
            }
          }).catch(() => {
            return {
              status: 'error',
              message: 'Network Error',
            };
          })
        }
      }
      else {
        return {
          status: 'error',
          message: res.data.error_message,
        };
      }
    }).catch(() => {
      return {
        status: 'error',
        message: 'Network Error',
      };
    });
  }

  async widgetRequest(url: string, data: any) {
    return await axios.post(this.widget + url, JSON.stringify(data));
  }

  async posRequest(url: string, data: any) {
    return await axios.post(this.pos + url, qs.stringify(data));
  }
}
