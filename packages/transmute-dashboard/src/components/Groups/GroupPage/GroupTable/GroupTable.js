import React from 'react';
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

import { history } from '../../../../store';

const columnData = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'ID'
  },
  {
    id: 'firstName',
    numeric: false,
    disablePadding: false,
    label: 'Given Name'
  },
  {
    id: 'lastName',
    numeric: false,
    disablePadding: false,
    label: 'Family Name'
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email'
  }
];

class GroupTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };
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
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

GroupTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
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

let GroupTableToolbar = props => {
  const { classes, group } = props;
  if (group == null) return null;

  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        <Typography variant="title">{group.name}</Typography>
        <Typography variant="subheading">{group.description}</Typography>
      </div>
    </Toolbar>
  );
};

GroupTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired
};

GroupTableToolbar = withStyles(toolbarStyles)(GroupTableToolbar);

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

class GroupTable extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.group.members) {
      this.setState({
        data: nextProps.group.members
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

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

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
        <GroupTableToolbar group={this.props.group}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <GroupTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return (
                    <TableRow
                      hover
                      onClick={() => history.push('/directory/' + n.id)}
                      role="checkbox"
                      tabIndex={-1}
                      key={n.id}
                    >
                      <TableCell>{n.id}</TableCell>
                      <TableCell>{n.profile.firstName}</TableCell>
                      <TableCell>{n.profile.lastName}</TableCell>
                      <TableCell>{n.profile.email}</TableCell>
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

GroupTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GroupTable);