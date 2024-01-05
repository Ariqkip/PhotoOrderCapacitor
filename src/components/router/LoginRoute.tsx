import React, {ComponentType, useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from "../../contexts/AuthContext";
import WelcomeView from "../../views/welcome/WelcomeView";

const LoginRoute: React.FC = (props) => {
    const { authUser } = useContext(AuthContext);

    return (
        <Route
            {...props}
            render={(props) =>
                !authUser ? <WelcomeView {...props} /> : <Redirect to={`/photographer/${authUser.id}`} {...props} />
            }
        />
    );
};

export default LoginRoute;
