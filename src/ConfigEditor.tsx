import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms, InlineLabel } from '@grafana/ui';
import {DataSourcePluginOptionsEditorProps} from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData, APIType } from './types';

const { SecretFormField, FormField, Select } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onPathChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      path: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onAccessKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      accessKey: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onTypeChange = (newVal: any) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      type: newVal,
    };
    onOptionsChange({ ...options, jsonData });
  };

  // Secure field (only sent to the backend)
  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        apiKey: event.target.value,
      },
    });
  };

  onResetAPIKey = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        apiKey: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        apiKey: '',
      },
    });
  };

  render() {
    const { options } = this.props;
    const { jsonData, secureJsonFields } = options;
    const secureJsonData = (options.secureJsonData || {}) as MySecureJsonData;
    const types = [
      {
        value: 'widget' as APIType,
        label: 'Widget',
      },
      {
        value: 'pos' as APIType,
        label: 'Pos',
      },
    ];

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="Path"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onPathChange}
            value={jsonData.path || ''}
            placeholder="json field returned to frontend"
          />
        </div>

        <div className="gf-form">
          <FormField
            label="AccessKey"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onAccessKeyChange}
            value={jsonData.accessKey || ''}
            placeholder="Enter a number"
          />
        </div>

        <div className="gf-form">
          <InlineLabel width={6}>
            Type
            <Select
              width={20}
              options={types}
              onChange={this.onTypeChange}/>
          </InlineLabel>

        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.apiKey) as boolean}
              value={secureJsonData.apiKey || ''}
              label="API Key"
              placeholder="secure json field (backend only)"
              labelWidth={6}
              inputWidth={20}
              onReset={this.onResetAPIKey}
              onChange={this.onAPIKeyChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
