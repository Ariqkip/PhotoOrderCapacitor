import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import {AuthContext} from "../../contexts/AuthContext";
import WelcomeView from "../../views/welcome/WelcomeView";
import PhotographerWelcomeView from '../../views/photographerWelcome/PhotographerWelcomeView';

const LoginRoute: React.FC = (props) => {
    const { authUser } = useContext(AuthContext);

    return (
        <Route
            {...props}
            render={(props) =>
                !authUser 
                    ? <WelcomeView {...props} />
                    : <PhotographerWelcomeView userId={authUser.id} />
            }
        />
    );
};

export default LoginRoute;
