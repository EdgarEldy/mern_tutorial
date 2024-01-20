import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DefaultLayout from "./components/layouts/DefaultLayout";
import Dashboard from "./pages/Dashboard";
import {CategoryList} from "./pages/categories/CategoryList";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout/>}>
                    <Route index element={<Dashboard/>}/>
                </Route>
                <Route path="/categories" element={<DefaultLayout/>}>
                    <Route index element={<CategoryList/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
