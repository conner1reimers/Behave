import React from 'react'
import Input from '../../shared/UIElements/Input/Input'
import { useForm } from '../../util/hooks/useForm'
import {VALIDATOR_NONE} from '../../util/validators'
import Button from '@material-ui/core/Button';
import { Typography, Box } from '@material-ui/core';
//API FACE FILTER KEY 866d422c1adcad745b7c5bbcb9a40d64 AppName = Test
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';


const BoxComponent = (props) => {

    const [formState, inputHandler] = useForm({
        name: {
            value: '',
            isValid: true
        },
        number: {}
    }, true)

    
    

    return (
            <div className="newpage--box1 newpage--boxClasses">

                    <div className="newpage--box1--contentclass newpage--boxClasses--content">
                        <div className="newpage--box1--contentclass2 newpage--boxClasses--content2">

                            <p>hi</p>
                            <Input
                            id="name"
                            name="name"
                            type="text"
                            validation={VALIDATOR_NONE()}
                            onInput={inputHandler}
                            />
                            <button className="newpage--btn btn">gdg</button>
                    </div>
            
                </div>
            </div>
    )
}

const NewPage = () => {

    const theme = createMuiTheme({
        palette: {
          primary: {
            main: '#a4d0ad',
          },
          secondary: {
            main: '#ff7043',

          },
        },
      });

      const StyledButton = withStyles({
          root: {
            //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            //   transform: 'scale(1.2)'
          },
          label: {
            fontSize: '1rem',
            color: '#000'

          }
      })(Button);

    return (
        <div className="newpage">
            <ThemeProvider theme={theme}>

            <div className="newpage--picbox">

                {/* <div className="fixr"></div> */}

                <div className="newpage--picbox--gridthird">

                    
                    <div className="newpage--picbox--gridthird--btn-holder">
                        <StyledButton
                            className="newpage--btn btn"
                            variant="contained" 
                            color="secondary"
                            >           Heya
                        </StyledButton>
                        <StyledButton
                            className="newpage--btn btn"
                            variant="contained" 
                            color="secondary"
                            >           Heya
                        </StyledButton>
                        <StyledButton
                            className="newpage--btn btn"
                            variant="contained" 
                            color="secondary"
                            >           Heya
                        </StyledButton>
                    </div>

                    <h1>

                    </h1>
                </div>
                

                <div className="newpage--picbox--gridbox">
                    <ul className="newpage--picbox--gridlist">
                        <li className="newpage--picbox--griitem">grid</li>
                        <li className="newpage--picbox--griditem"> <Typography variant="h1" component="h2">  grid </Typography></li>
                        <li className="newpage--picbox--griditem">grid</li>
                        <li className="newpage--picbox--griditem">grid</li>
                        <li className="newpage--picbox--griditem">grid</li>
                        <li className="newpage--picbox--griditem">grid</li>
                        
                        <Box display="flex">

                            <Box className="newpage--picbox--griditem" color="text.primary">Box inside box
                                <StyledButton
                                className="newpage--btn btn"
                                variant="contained" 
                                color="secondary"
                                >           Heya
                                </StyledButton>
                            </Box>


                            <Box className="newpage--picbox--griditem" color="text.primary">Box inside box
                                <StyledButton
                                className="newpage--btn btn"
                                variant="contained" 
                                color="secondary"
                                >           Heya
                                </StyledButton>
                            </Box>
                        </Box>

               
                    </ul>
                </div>

            </div>

            <div className="newpage--box-container">
                    <BoxComponent/>
                    <BoxComponent/>
                    <div className="bob"/>
            </div>

            </ThemeProvider>

        </div>
    )
}

export default NewPage
