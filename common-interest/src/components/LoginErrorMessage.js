import React from "react";
import '../style/LoginErrorMessage.css'


function LoginErrorMessage(props) {
    if(props.wrong === true){
        return <div id="login-error-message"> 
            <div>
                WARNING :
            </div>
            <div>
                Wrong username or password
            </div>
        </div>
      }
      else {
        return
      }
}

export default LoginErrorMessage;