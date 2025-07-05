import { configureStore } from "@reduxjs/toolkit";
import testReducer from "../slice/test"
import blockedDateReducer from "../slice/blockedDate"
import songRegisterReducer from "../slice/song_registration"
import newReleaseReducer  from "../slice/newRelease";
import ticketReducer  from "../slice/ticket";
import profileReducer  from "../slice/profile";
import eventReducer from "../slice/events";
import notificationReducer from "../slice/notification";
import incomeReducer from "../slice/income";

export const artistStore = configureStore({
    reducer : {
        test : testReducer,
        blockedDate : blockedDateReducer,
        songRegister : songRegisterReducer,
        newRelease : newReleaseReducer,
        ticket : ticketReducer,
        profile : profileReducer,
        event : eventReducer,
        notification: notificationReducer,
        income : incomeReducer,
    }
})

//tes