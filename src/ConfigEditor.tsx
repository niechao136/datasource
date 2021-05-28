import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from './types';

const { SecretFormField, FormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    ConfigEditor.onStoreChange = this.onStoreChange.bind(this); // 最重要的一步！！
  }
  static onStoreChange(newVal: any) {
    // @ts-ignore
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      stores: newVal,
    };
    onOptionsChange({ ...options, jsonData });
  }
  onWidgetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      widget: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onPosChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      pos: event.target.value,
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

  onStoreChange = (newVal: any) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      stores: newVal,
    };
    onOptionsChange({ ...options, jsonData });
  }

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

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="API"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onWidgetChange}
            value={jsonData.widget || ''}
            placeholder="Enter the API path"
          />
        </div>

        <div className="gf-form">
          <FormField
            label="POS"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onPosChange}
            value={jsonData.pos || ''}
            placeholder="Enter the POS path"
          />
        </div>

        <div className="gf-form">
          <FormField
            label="AccessKey"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onAccessKeyChange}
            value={jsonData.accessKey || ''}
            placeholder="Enter the accessKey"
          />
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
