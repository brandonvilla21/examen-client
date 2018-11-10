import React from 'react';
import api from '../api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  formPaperContainer: {
    display: 'flex',
  },
  table: {
    minWidth: 700,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class Students extends React.Component {
  state ={
    students: [],
    carrers: [],
    dialog: false,
    form: {
      name: '',
      lastname_p: '',
      lastname_m: '',
      id_carrer: ''
    }
  }
  componentDidMount() {
    this.fetchStudents()  
    this.fetchCarrers()  
  }
  fetchStudents = () => {
    api.get('/students')
      .then(response => this.setState({ students: response.data }, () => console.log(this.state)))
      .catch(err => console.log(err))
  }
  fetchCarrers = () => {
    api.get('/carrers')
      .then(response => this.setState({ carrers: response.data }))
      .catch(err => console.log(err))
  }
  handleChange = event => {
    const { name, value } = event.target;
    console.log(name)
    console.log(value)
    this.setState({
      form: {
        ...this.state.form,
        [name]: value
      }
    })
  }

  toggleDialog = () => {
    this.setState( prevState => ({ dialog: !prevState.dialog }))
  }

  createCarrer = () => {
    this.toggleDialog()
    api.post('/students', {
      ...this.state.form
    })
    .then(res => this.fetchStudents())
    .catch(err => { throw err; });
  }

  render() {
    const { classes } = this.props;
    const { students, dialog } = this.state;
    return (
      <React.Fragment>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido paterno</TableCell>
              <TableCell>Apellido materno</TableCell>
              <TableCell>Carrera</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    {row.name}
                  </TableCell>
                  <TableCell>
                    {row.lastname_p}
                  </TableCell>
                  <TableCell>
                    {row.lastname_m}
                  </TableCell>
                  <TableCell>
                    {row.description}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      <Button onClick={this.toggleDialog} variant="fab" className={classes.fab} color="primary">
        <AddIcon/>
      </Button>

      <Dialog
        open={dialog}
        onClose={this.toggleDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title">{"Registra una nueva carrera"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Nombre"
              name="name"
              className={classes.textField}
              value={this.state.form.name}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              label="Apellido paterno"
              name="lastname_p"
              className={classes.textField}
              value={this.state.form.lastname_p}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              label="Apellido materno"
              name="lastname_m"
              className={classes.textField}
              value={this.state.form.lastname_m}
              onChange={this.handleChange}
              fullWidth
            />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-native-simple">Carrera</InputLabel>
              <Select
                native
                value={this.state.form.id_carrer}
                onChange={this.handleChange}
                inputProps={{
                  name: 'id_carrer',
                  id: 'description-id',
                }}
              >
                {
                  this.state.carrers.map( e => {
                    return (
                      <option key={e.id_carrer} value={e.id_carrer}>{e.description}</option>
                    )
                  })
                }
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.createCarrer} color="primary" autoFocus>
              Registrar
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Students);