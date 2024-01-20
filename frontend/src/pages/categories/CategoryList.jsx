import {useEffect, useState} from "react";
import axios from "axios";

export function CategoryList() {
    // Initialize categories endpoint
    const baseUrl = 'http://localhost:3001/categories';

    // Get categories state
    const [categories, setCategories] = useState([]);

    // Get categories from the backend
    useEffect(() => {
        axios.get(baseUrl).then((response) => {
            setCategories(response.data);
        });
    }, []);
    return (
        <div>
            <div className="container-fluid">
                {/* Page Heading */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-2 text-gray-800">
                        <button
                            type="button"
                            className="btn btn-primary btn-sm text-white btn-add-category"
                        >
                            <i className="fas fa-plus mr-1"/>
                            New
                        </button>
                    </h1>
                </div>
                <div className="card shadow mb-4 border-bottom-primary">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table
                                className="table table-bordered"
                                id="dataTable"
                                width="100%"
                                cellSpacing={0}
                            >
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Category name</th>
                                    <th>Options</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* Display categories using map function */}
                                {categories.map((value, key) => {
                                    return (
                                        <tr>
                                            <td>{value.id}</td>
                                            <td>{value.category_name}</td>
                                            <td></td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}