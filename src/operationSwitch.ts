import operations from './operations';

const operationSwitch = async (options) => {
  try{
    return operations(options)
  } catch(e){
    console.error(e)
    throw new Error('Action does not support the options provided')
  }
}

export default operationSwitch