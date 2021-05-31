import defaults from 'lodash/defaults';

import React, { PureComponent } from 'react';
import { InlineFormLabel } from '@grafana/ui';
import { DatePicker, Select, Divider, Checkbox } from 'antd';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';
import "./antd.css";
import {CheckboxChangeEvent} from "antd/es/checkbox";

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  all: boolean = false;
  onStoreChange = (newVal: any) => {
    const { onChange, query, onRunQuery, datasource } = this.props;
    this.all = newVal?.length == datasource.stores.length;
    onChange({ ...query, store_ids: newVal });
    onRunQuery();
  }
  allStore = (event: CheckboxChangeEvent) => {
    const { onChange, query, onRunQuery, datasource } = this.props;
    const store_ids: Array<any> = [];
    if (event.target.checked) {
      datasource.stores.forEach(store => store_ids.push(store.store_id));
    }
    onChange({ ...query, store_ids });
    onRunQuery();
  }
  onRangeChange = (newVal: any) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, range: newVal });
    onRunQuery();
  }
  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { store_ids, range } = query;
    const stores: Array<any> = [];
    this.props.datasource.stores.forEach(store => {
      stores.push({
        value: store.store_id,
        label: store.store_name,
      });
    });
    const ranges: Array<any> = [
      {
        value: 'dd',
        label: 'Day',
      },
      {
        value: 'ww',
        label: 'Week',
      },
      {
        value: 'mm',
        label: 'Month',
      },
      {
        value: 'yyyy',
        label: 'Year',
      }
    ];
    const mode: any = {
      dd: "date",
      ww: "week",
      mm: "month",
      yyyy: "year"
    };
    this.all = store_ids?.length == this.props.datasource.stores.length;

    return (
      <div className="gf-form">
        <InlineFormLabel width={3}>
          Store
        </InlineFormLabel>
        <InlineFormLabel width={12}>
          <Select
            options={stores}
            value={store_ids}
            mode="multiple"
            maxTagCount={0}
            onChange={this.onStoreChange}
            style={{width: '100%'}}
            dropdownRender={menu => (
              <div>
                <div style={{ padding: '4px 8px 8px 8px', cursor: 'pointer' }}>
                  <Checkbox checked={this.all} onChange={this.allStore}>All</Checkbox>
                </div>
                <Divider style={{ margin: '2px 0' }} />
                {menu}
              </div>
            )}
          />
        </InlineFormLabel>
        <InlineFormLabel width={3}>
          Period
        </InlineFormLabel>
        <InlineFormLabel width={9}>
          <Select
            options={ranges}
            value={range}
            onChange={this.onRangeChange}
            style={{width: '100%'}}
          />
        </InlineFormLabel>
        <InlineFormLabel width={4}>
          Date
        </InlineFormLabel>
        <DatePicker picker={range ? mode[range] : 'date'} />
      </div>
    );
  }
}
