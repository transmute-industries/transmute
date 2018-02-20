import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import GetAccounts from './Steps/GetAccounts';
import CreateFactory from './Steps/CreateFactory';

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  }
});

class FactoryTour extends React.Component {
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if (
      nextProps.transmute.hasWeb3 &&
      this.props.transmute.factoryTour.activeStep === 0
    ) {
      this.props.actions.updateFactoryTour(1);
    }
  }

  isNextDisabled = () => {
    if (this.props.transmute.factoryTour.activeStep === 1) {
      return this.props.transmute.accounts === null;
    }
    return true;
  };

  handleNext = async () => {
    this.props.actions.updateFactoryTour(
      this.props.transmute.factoryTour.activeStep + 1
    );
  };

  handleBack = () => {
    this.props.actions.updateFactoryTour(
      this.props.transmute.factoryTour.activeStep - 1
    );
  };

  handleReset = () => {
    this.props.actions.updateFactoryTour(0);
  };

  getStepContent = step => {
    switch (step) {
      case 0:
        return `Download, install and sign in to MetaMask.`;
      case 1:
        return (
          <GetAccounts
            transmute={this.props.transmute}
            actions={this.props.actions}
          />
        );
      case 2:
        return (
          <CreateFactory
            transmute={this.props.transmute}
            actions={this.props.actions}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  render() {
    const { classes } = this.props;
    const steps = [
      'Get a web3',
      'Get web3 accounts',
      'Create a factory smart contract'
    ];
    const { activeStep } = this.props.transmute.factoryTour;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {this.getStepContent(index)}
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                      <Button
                        variant="raised"
                        color="primary"
                        disabled={this.isNextDisabled()}
                        onClick={this.handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&quot;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

FactoryTour.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(FactoryTour);
