import moment from 'moment';
import _ from 'lodash';
import { Types, Comparisons } from '../constants/filters';

export const attributeFilter = (event, filter) => {
  let { attribute, value, comparison, type } = filter;

  switch (type) {
    case Types.NUMERIC:
      switch (comparison) {
        case Comparisons.EQUAL_TO:
          return _.get(event, attribute) === value
        case Comparisons.LESS_THAN:
          return _.get(event, attribute) < value
        case Comparisons.GREATER_THAN:
          return _.get(event, attribute) > value
        default:
          return true;
      }
    case Types.STRING:
      switch (comparison) {
        case Comparisons.EQUAL_TO:
          return _.get(event, attribute) === value
        case Comparisons.INCLUDES:
          return _.includes(_.get(event, attribute), value);
        default:
          return true;
      }
    case Types.DATE:
      switch (comparison) {
        case Comparisons.EQUAL_TO:
          return moment(_.get(event, attribute)).isSame(moment(value))
        case Comparisons.LESS_THAN:
          return moment(_.get(event, attribute)).isBefore(moment(value))
        case Comparisons.GREATER_THAN:
          return moment(_.get(event, attribute)).isAfter(moment(value))
        default:
          return true;
      }
    case Types.ARRAY:
      switch (comparison) {
        case Comparisons.INCLUDES:
          return _.includes(_.get(event, attribute), value);
        case Comparisons.EXCLUDES:
          return !_.includes(_.get(event, attribute), value);
        case Comparisons.EQUAL_TO:
          return _(_.get(event, attribute)).differenceWith(value, _.isEqual).isEmpty();
        default:
          return true;
      }
    default:
      return true;
  }
};

export const documentFilter = (event) => {
  return event.key.type === 'document';
};

export const userFilter = (event) => {
  return event.key.type === 'user';
};

export const noFilter = (event) => {
  return true
};

export const filters = (filterType) => {
  switch (filterType) {
    case 'document':
      return documentFilter
    case 'user':
      return userFilter
    case 'none':
      return noFilter
  }
};