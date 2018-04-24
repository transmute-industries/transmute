import React from 'react';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import DeleteIcon from 'material-ui-icons/Delete';
import FilterListIcon from 'material-ui-icons/FilterList';
import { lighten } from 'material-ui/styles/colorManipulator';

const columnData = [
  {
    id: 'models',
    numeric: false,
    disablePadding: false,
    label: 'Models'
  }
];

class StreamModelTableHead extends React.Component {
  render() {
    const { order, orderBy, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              />
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

StreamModelTableHead.propTypes = {
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  title: {
    flex: '0 0 auto'
  }
});

let StreamModelTableToolbar = props => {
  const { classes } = props;

  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        <Typography variant="title">Models</Typography>
      </div>
    </Toolbar>
  );
};

StreamModelTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired
};

StreamModelTableToolbar = withStyles(toolbarStyles)(StreamModelTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 800
  },
  tableWrapper: {
    overflowX: 'auto'
  }
});

class StreamModelTable extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.streamModel) {
      this.setState({
        data: _.map(_.toPairs(nextProps.streamModel), d => _.fromPairs([d]))
      });
    }
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'desc',
      orderBy: 'index',
      data: [],
      page: 0,
      rowsPerPage: 8
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <StreamModelTableToolbar />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <StreamModelTableHead
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return (
                    <TableRow key={n} hover role="checkbox" tabIndex={-1}>
                      <TableCell>
                        <pre>{JSON.stringify(n, null, 2)}</pre>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={3} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page'
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page'
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

StreamModelTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StreamModelTable);
