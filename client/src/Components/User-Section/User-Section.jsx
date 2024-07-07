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
        setIsLoading(true)
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

    const handleSubmitClick = (e) => {
        e.preventDefault();

        const formData = e.target;

        const newUser = {
            firstName: formData['firstName'].value,
            lastName: formData['lastName'].value,
            email: formData['email'].value,
            phoneNumber: formData['phoneNumber'].value,
            createdAt: new Date().toISOString(),
            imageUrl: formData['imageUrl'].value,
            address: {
                country: formData['country'].value,
                city: formData['city'].value,
                street: formData['street'].value,
                streetNumber: formData['streetNumber'].value
            }
        }
        
        // Send the new user data to the server
        setIsLoading(true);
        fetch(`${baseURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
        .then((res) => res.json())
        .then((data) => {
            // Update the users state with the new user
            setUsers((oldUsers) => [...oldUsers, newUser]);
        })
        .catch((error) => {
            setShowFetchError(true);
        })
        .finally(() => {
            setIsLoading(false);
            setShowFetchError(false);
        });

        setshowCreateEditUser(false)
    }

    return (
        <main className="main">
            <section className="card users-container">
                <Search/>
                
                {isLoading && <LoadingSpinner />}
                
                {showNoUsersYet && <NoUsersAddedYetContainer/>}
                
                {showFetchError && <FetchingError/>}
               
               {showCreateEditUser && <CreateEditUser onClose={handleCloseButtonClick} onSubmit={handleSubmitClick}/>}

                <UserList
                    users={users}
                />

                <button className="btn-add btn" onClick={handleAddButtonClick}>Add new user</button>

                <Pagination/>
            </section>
        </main>
    );
};