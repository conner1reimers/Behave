import React from 'react'
import Input from '../../shared/UIElements/Input/Input'
import { useForm } from '../../util/hooks/useForm'
import {VALIDATOR_NONE} from '../../util/validators'


//API FACE FILTER KEY 866d422c1adcad745b7c5bbcb9a40d64 AppName = Test


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

    return (
        <div className="newpage">

            <div className="newpage--picbox">

                {/* <div className="fixr"></div> */}

                <div className="newpage--picbox--gridthird">

                    
                    <div className="newpage--picbox--gridthird--btn-holder">
                        <button className="newpage--btn btn">gdg</button>
                        <button className="newpage--btn btn">Button 3</button>
                        <button className="newpage--btn btn">gdg</button>
                    </div>

                    <h1>

                    </h1>
                </div>
                

                <div className="newpage--picbox--gridbox">
                    <ul className="newpage--picbox--gridlist">
                        <li className="newpage--picbox--griitem">grid</li>
                        <li className="newpage--picbox--griditem">grid</li>
                        <li className="newpage--picbox--griditem">grid</li>
                        <li className="newpage--picbox--griditem">grid</li>
                        <li className="newpage--picbox--griditem">grid</li>
                        <li className="newpage--picbox--griditem">grid</li>

                    </ul>
                </div>

            </div>

            <div className="newpage--box-container">
                    <BoxComponent/>
                    <BoxComponent/>
                    <div className="bob"/>
            </div>



        </div>
    )
}

export default NewPage
