import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DefaultLayout from "./components/layouts/DefaultLayout";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout/>}>
                    <Route index element={<Dashboard />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
