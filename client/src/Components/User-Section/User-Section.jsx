import Search from "../Search/Search";
import Pagination from "../Pagination/Pagination";
import UserList from "./User-List/User-List";
import { useState, useEffect } from "react";
import NoUsersAddedYetContainer from "../NoUsersAddedYet/NoUsersAddedYetContainer";
import FetchingError from "../FetchingError/FetchingError";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CreateEditUser from "./Create-Edit-User/Create-Edit-User";
import UserDelete from "./UserDelete/UserDelete";
import NotFound from "../NotFound/NotFound";
import UserDetails from "./UserDetails/UserDetails";

export default function UserSection() {
    const baseURL = 'http://localhost:3030/jsonstore';

    const [users, setUsers] = useState([]);
    const [showNoUsersYet, setShowNoUsersYet] = useState(false);
    const [showFetchError, setShowFetchError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateEditUser, setshowCreateEditUser] = useState(false);
    const [showDeleteUserById, setShowDeleteUserById] = useState(null);
    const [showNoUsersFound, setNoUsersFound] = useState(false);
    const [showUserDetailsById, setShowUserDetailsById] = useState(null);

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
            alert('User added successfully');
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

    const onClickDeleteHandler = (userId) => {
        setShowDeleteUserById(userId);
    }

    const onCloseDeleteHandler = () => {
        setShowDeleteUserById(null);
    }

    const onSubmitDeleteHandler = async (e) => {
        e.preventDefault();

        const userId = showDeleteUserById;

        setIsLoading(true);

        setIsLoading(true);

        try {
            // Check if the user exists by making a GET request
            const response = await fetch(`${baseURL}/users/${userId}`);
            
            if (!response.ok) {
                // If the user does not exist, handle the error
                if (response.status === 404) {
                    setNoUsersFound(true);
                    setIsLoading(false);
                    alert('User does not exist');
                    return;
                } else {
                    throw new Error('Network response was not ok');
                }
            }

            // If the user exists, proceed with the DELETE request
            await fetch(`${baseURL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                }
            });

            // Handle successful deletion
            alert('User deleted successfully');
            setShowDeleteUserById(false);

            setUsers(oldUsers => oldUsers.filter(u=> u._id !== userId));
        } catch (error) {
            setNoUsersFound(true);
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }

        console.log(users)
    }   

    const showUserDetailsBydIDHandler = (userId) => {
        setShowUserDetailsById(userId);
    }

    const closeUserDetailsByIdHandler = () => {
        setShowUserDetailsById(null);
    }

    return (
        <main className="main">
            <section className="card users-container">
                <Search/>
                
                {isLoading && <LoadingSpinner />}
                
                {showNoUsersYet && <NoUsersAddedYetContainer/>}
                
                {showNoUsersFound && <NotFound/>}

                {showFetchError && <FetchingError/>}
               
                {showCreateEditUser && <CreateEditUser onClose={handleCloseButtonClick} onSubmit={handleSubmitClick}/>}

                {showDeleteUserById && <UserDelete onClose={onCloseDeleteHandler} onSubmit={onSubmitDeleteHandler}/>}

                {showUserDetailsById && <UserDetails 
                                            user={users.find(u=> u._id === showUserDetailsById)}
                                            onClose={closeUserDetailsByIdHandler}
                                            />}

                <UserList
                    users={users}
                    onDelete={onClickDeleteHandler}
                    onClose={onCloseDeleteHandler}
                    showUserDetails={showUserDetailsBydIDHandler}
                />

                <button className="btn-add btn" onClick={handleAddButtonClick}>Add new user</button>

                <Pagination/>
            </section>
        </main>
    );
};