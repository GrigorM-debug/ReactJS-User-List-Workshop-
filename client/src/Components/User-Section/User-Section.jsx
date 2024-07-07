import Search from "../Search/Search";
import Pagination from "../Pagination/Pagination";
import UserList from "./User-List/User-List";
import { useState, useEffect } from "react";
import NoUsersAddedYetContainer from "../NoUsersAddedYet/NoUsersAddedYetContainer";
import FetchingError from "../FetchingError/FetchingError";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CreateEditUser from "./Create-Edit-User/Create-Edit-User";

export default function UserSection() {
    const baseURL = 'http://localhost:3030/jsonstore';

    const [users, setUsers] = useState([]);
    const [showNoUsersYet, setShowNoUsersYet] = useState(false);
    const [showFetchError, setShowFetchError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateEditUser, setshowCreateEditUser] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseURL}/users`);
                const data = await response.json();
                const usersData = Object.values(data);

                if (usersData.length === 0) {
                    setShowNoUsersYet(true);
                }

                setUsers(Object.values(data));
            } catch (error) {
                setShowFetchError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddButtonClick = () => {
        setshowCreateEditUser(true);
    }

    const handleCloseButtonClick = () => {
        setshowCreateEditUser(false);
    }

    return (
        <main className="main">
            <section className="card users-container">
                <Search/>
                
                {isLoading && <LoadingSpinner />}
                
                {showNoUsersYet && <NoUsersAddedYetContainer/>}
                
                {showFetchError && <FetchingError/>}
               
               {showCreateEditUser && <CreateEditUser onClose={handleCloseButtonClick}/>}

                <UserList
                    users={users}
                />

                <button className="btn-add btn" onClick={handleAddButtonClick}>Add new user</button>

                <Pagination/>
            </section>
        </main>
    );
};