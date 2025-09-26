import React from 'react';
import Startup from "./application/common/entry/Startup";
import { createBrowserHistory } from "history"

export const history=createBrowserHistory({
    basename: process.env.PUBLIC_URL
})

new Startup()


