import React from "react"
import '../style/InformativeMessage.css'

class InformativeMessage extends React.Component {
    
    progressiveDisappear(){
        
        if(document.getElementById("informative-message-container") !== null && document.getElementById("informative-message-container").style !== undefined){
            document.getElementById("informative-message-container").style.transition = "opacity 0.5s linear";
            document.getElementById("informative-message-container").style.opacity = 0;
        } 

    }


    render() {

        setTimeout( () => {
            this.progressiveDisappear()
        }, 3000)


        return this.props.message === undefined || this.props.message === "" || this.props.message === null ?
            null
            :
            <div id="informative-message-container">
                {this.props.message}
            </div>
            
   
    }
}

export default InformativeMessage