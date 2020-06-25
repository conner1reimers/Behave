import React from 'react'
import Input from '../../shared/UIElements/Input/Input'
import { useForm } from '../../util/hooks/useForm'
import {VALIDATOR_NONE} from '../../util/validators'

const NewPage = () => {

    const [formState, inputHandler] = useForm({
        name: {
            value: '',
            isValid: true
        },
        number: {}
    }, true)
    return (
        <div className="newpage">

            <div className="newpage--box-container">
                
                    <div className="newpage--box1 newpage--boxClasses">

                        <div className="newpage--box1--contentclass newpage--boxClasses--content">
                            <div className="newpage--box1--contentclass2 newpage--boxClasses--content2">

                                <p>Heyo</p>

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

                    <div className="newpage--box2 newpage--boxClasses">

                        <div className="newpage--box2--contentclass newpage--boxClasses--content">
                            <div className="newpage--box2--contentclass2 newpage--boxClasses--content2">

                            <p>Heyo</p>

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
                    <div className="bob"></div>

            </div>



        </div>
    )
}

export default NewPage
