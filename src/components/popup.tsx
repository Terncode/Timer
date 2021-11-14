import React from "react";
import styled from 'styled-components';

const Warper = styled.div`
    position: fixed;
    z-index: 9999;
    width: 100%;
    top: 0;
    transition: 1s top;
`

const WarperInner = styled.div`
    background: #333;  
    border: 3px solid green;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    margin: auto;
    min-width: 100px;
    max-width: 80%;
    padding: 10px;
    text-align: center;
`

const ButtonContainer = styled.div`
    display: flex;
`
    
const ButtonWarper = styled.div`
    background: #057bff;
    padding: 2px;
    border-radius: 2px;
    text-align: center;
    margin: 0 5px;
`

interface State {
    top: number;

}

interface Button {
    text: string,
    onClick: () => void;
}

interface Props {
    message: string,
    option: Button; 
    option2?: Button; 
}


export class Popup extends React.Component<Props, State> { 

    constructor(props) {
        super(props);
        this.state = {
            top: -100
        }
    }

    componentDidMount(){
        setTimeout(() => {
            this.setState({
                top: 0,
            })   
        });
    }

    get renderButtons() {
        const buttons = [this.props.option, this.props.option2].filter(e => e);

        return <ButtonContainer>
            { buttons.map((b, i) => {
                return <ButtonWarper key={i} onClick={() => b.onClick()}>
                    {b.text}
                </ButtonWarper>
            })}
        </ButtonContainer>
    }

    render() {
        return <Warper style={{top: this.state.top}}>
            <WarperInner>
                <div>
                    <h2>
                        {this.props.message}
                    </h2>
                </div>
                    {this.renderButtons}
            </WarperInner>
        </Warper>
    }


}