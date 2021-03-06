import {
  ChartDataFieldShape,
  ChartDataField,
  ChartDataFieldType,
} from '@biosimulations/datamodel/core';

export class ChartTypeDataField implements ChartDataField {
  name: string;
  shape: ChartDataFieldShape;
  type: ChartDataFieldType;
  constructor(data: ChartDataField) {
    Object.assign(this, data);
  }
}
