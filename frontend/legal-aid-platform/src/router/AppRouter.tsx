import { createBrowserRouter } from "react-router-dom";
import Signup from "../pages/Signup";

const router = createBrowserRouter([
    {
        path:"/",
        element:<Signup/>,
        children:[
            {
                index:true,
                element:<></>
            }
        ]
    }
]);

export default router;