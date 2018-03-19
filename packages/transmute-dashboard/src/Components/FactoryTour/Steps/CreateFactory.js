import React from 'react';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import transmute from '../../../store/transmute';
import { ReadModel } from 'transmute-framework';

class CreateFactory extends React.Component {
  render() {
    console.log('start here....');
    return (
      <div className="CreateFactory">
        <Typography>Factory Smart Contract:</Typography>

        <pre>{JSON.stringify(this.props.transmute, null, 2)}</pre>

        <Button
          variant="raised"
          color="secondary"
          onClick={async () => {
            let factory = await transmute.middleware.createFactory();

            console.log('yolo...')

            // let readModel = await transmute.middleware.getFactoryReadModel(
            //   factory
            // );

            // console.log(readModel)
          }}
        >
          Create Factory
        </Button>
      </div>
    );
  }
}

export default CreateFactory;
