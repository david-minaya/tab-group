import * as React from 'react';
import '../styles/popup.css';
import { TextField, PrimaryButton } from 'office-ui-fabric-react';

export class Popup extends React.Component {


  handleButtonClick = () => {
    
  }

  render() {
    return (
      <div className='popup'>
        <div className='title'>Crear nuevo grupo de pestañas</div>
        <TextField className='text-field' placeholder='Nombre'></TextField>
        <PrimaryButton className='button' text='Crear grupo' onClick={this.handleButtonClick}></PrimaryButton>
      </div>
    );
  }
}
