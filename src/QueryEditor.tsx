import defaults from 'lodash/defaults';

import React, { PureComponent } from 'react';
import { LegacyForms, InlineFormLabel, getTheme } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { Select } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onStoreChange = (newVal: any) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, store_ids: newVal });
    onRunQuery();
  }
  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { store_ids } = query;
    const stores: any = [];
    this.props.datasource.stores.forEach(store => {
      stores.push({
        value: store.store_id,
        label: store.store_name,
      });
    });
    console.log(getTheme());

    return (
      <div className="gf-form">
        <InlineFormLabel width={4}>
          Store
        </InlineFormLabel>
        <Select
          options={stores}
          width={8}
          showAllSelectedWhenOpen={true}
          value={store_ids}
          onChange={this.onStoreChange}/>
      </div>
    );
  }
}
