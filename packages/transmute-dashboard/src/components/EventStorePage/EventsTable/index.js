import React from 'react';
import { connect } from 'react-redux';
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
  { id: 'index', numeric: true, disablePadding: false, label: 'Index' },
  {
    id: 'sender',
    numeric: false,
    disablePadding: false,
    label: 'Sender'
  },
  {
    id: 'key',
    numeric: false,
    disablePadding: false,
    label: 'Key'
  },
  {
    id: 'value',
    numeric: false,
    disablePadding: false,
    label: 'Value'
  }
];

class EventsTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };
  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      rowCount
    } = this.props;

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

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  }
});

let EventsTableToolbar = props => {
  const { classes } = props;

  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        <Typography variant="title">Events</Typography>
      </div>
    </Toolbar>
  );
};

EventsTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

EventsTableToolbar = withStyles(toolbarStyles)(EventsTableToolbar);

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

class EventsTable extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.events) {
      this.setState({
        data: nextProps.events
      });
    }
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'desc',
      orderBy: 'index',
      data: props.events == null ? [] : props.events,
      page: 0,
      rowsPerPage: 10
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

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EventsTableToolbar />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <EventsTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return n.sender === this.props.user.web3Account ?
                     (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={n.id}
                      >
                        <TableCell numeric>{n.index}</TableCell>
                        <TableCell>{n.sender.substring(0, 16) + '...'}</TableCell>
                        <TableCell>
                          <pre>{JSON.stringify(n.key, null, 2)}</pre>
                        </TableCell>
                        <TableCell>
                          <pre>{JSON.stringify(n.value, null, 2)}</pre>
                        </TableCell>
                      </TableRow>
                    ) :
                    (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={n.id}
                      >
                        <TableCell numeric>{n.index}</TableCell>
                        <TableCell>[ENCRYPTED]</TableCell>
                        <TableCell>[ENCRYPTED]</TableCell>
                        <TableCell>[ENCRYPTED]</TableCell>
                      </TableRow>
                    )
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

EventsTable.propTypes = {
  classes: PropTypes.object.isRequired
};


const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default withStyles(styles)(connect(mapStateToProps, null)(EventsTable));
