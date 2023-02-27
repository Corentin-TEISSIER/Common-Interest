import React from "react";
import '../style/ServerErrorMessage.css'


function ServerErrorMessage(props) {
    if(props.error === true){
        return <div id="server-error-message"> 
            <div>
                WARNING :
            </div>
            <div>
                Issue with server connection
            </div>
        </div>
      }
      else {
        return
      }
}

export default ServerErrorMessage;