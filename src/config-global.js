// routes
import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------
 // eslint-disable-next-line no-unused-vars
//  const REACT_APP_HOST_API='https://dapis.ma-moh.com'
export const HOST_API = 'https://dapis.ma-moh.com'
export const ASSETS_API = process.env.REACT_APP_ASSETS_API;

export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
