import { Routes, Route } from 'react-router-dom';
import { LoginContainer } from '../views';
const WMRoutes = () => {
  <Routes>
    <Route path="/" element={<div>Home</div>} />
    <Route path="/login" element={<LoginContainer />} />
    {/* <Route path="/signup" element={<SignupForm />} /> */}
    {/* <Route
               path="/bookmarks/page/:page/page_size/:pageSize"
               element={
                 <PrivateRoute>
                   <div className="flex flex-wrap flex-row h-full overflow-y-auto">
                     <Bookmarks />
                   </div>
                 </PrivateRoute>
               }
             />
             <Route
               path="/reference"
               element={
                 <PrivateRoute>
                   <Reference />
                 </PrivateRoute>
               }
             />

             <Route
               path="/graphics"
               element={
                 <PrivateRoute>
                   <GraphicsContainer />
                 </PrivateRoute>
               }
             /> */}
    <Route path="*" element={<div>404 nothing here</div>} />
  </Routes>;
};

export default WMRoutes;
