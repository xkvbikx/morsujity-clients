import { NavigateFunction } from "react-router-dom";
import { dataURLtoFile } from "utils/dataURLToFile";
import { getFetch, imageFetch, postFetch } from "utils/fetches";
import { authorizationFail, logout } from "utils/useful";

import { AppThunk } from "./index";
import { userActions, UserData } from "./user-slice";

export const logoutUser = () => {
    getFetch<never>("/auth/logout").then(() => {
        logout();
    });
};

export const getUserData =
    (setIsLogged: Function): AppThunk =>
    (appDispatch) => {
        getFetch<{ user: UserData }>("/user/data", {
            customError: true,
        })
            .then(({ user }) => {
                appDispatch(userActions.setUserData(user));
                setIsLogged(true);
            })
            .catch(() => {
                authorizationFail();
            });
    };

export const changeUserPseudonym =
    (pseudonym: string): AppThunk =>
    (appDispatch) => {
        postFetch<{ pseudonym: string }>({ pseudonym }, "/user/change-pseudonym").then(() => {
            appDispatch(userActions.updatePseudonym(pseudonym));
        });
    };

export const changeUserPassword =
    (oldPassword: string, newPassword: string): AppThunk =>
    () => {
        postFetch<never>({ oldPassword, newPassword }, "/auth/change-password");
    };

export const changeUserImage =
    (base64EncodedImage: string): AppThunk =>
    (appDispatch) => {
        const data = new FormData();
        data.append("userImage", dataURLtoFile(base64EncodedImage, "userImage.png"));

        imageFetch<{ image: string }>(data, "/user/change-image").then(({ image }) => {
            appDispatch(userActions.updateImage(image));
        });
    };

export const changeToDefUserImage = (): AppThunk => async (appDispatch) => {
    getFetch<{ image: string }>("/user/change-user-image-to-def").then(({ image }) => {
        appDispatch(userActions.updateImage(image));
    });
};

export const newActivity =
    (isMors: boolean, data: string, duration: number, navigate: NavigateFunction): AppThunk =>
    (appDispatch) => {
        postFetch<never>({ isMors, data, duration }, "/user/new-activity").then(() => {
            navigate(`/dashboard`, { replace: true });
        });
    };
